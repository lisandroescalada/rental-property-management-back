# 🏛️ Arquitectura Hexagonal — Módulo Users

## ¿Qué es la arquitectura hexagonal?

La arquitectura hexagonal (también llamada **Ports & Adapters**) organiza el
código en capas concéntricas con una regla fundamental:

> **Las dependencias solo pueden apuntar hacia adentro.**
> El dominio no conoce a nadie. La aplicación conoce al dominio. La infraestructura conoce a todos.

```
┌─────────────────────────────────────────────────────┐
│  INFRAESTRUCTURA (adaptadores)                      │
│  ┌───────────────────────────────────────────────┐  │
│  │  APLICACIÓN (casos de uso, CQRS)              │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │  DOMINIO (entidades, puertos, errores)  │  │  │
│  │  │  — sin dependencias externas —          │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
        ↑ las dependencias van hacia dentro ↑
```

---

## Estructura de carpetas del módulo

```
src/users/
│
├── domain/                         ← 🔵 CAPA DE DOMINIO
│   ├── entities/
│   │   └── user.entity.ts          ← Entidad de dominio (puro TypeScript)
│   ├── errors/
│   │   └── user-not-found.error.ts ← Errores de dominio
│   └── repositories/
│       ├── user.repository.ts      ← Puerto (interfaz, contrato)
│       └── user.repository.token.ts← Token de inyección (Symbol)
│
├── application/                    ← 🟡 CAPA DE APLICACIÓN
│   └── queries/
│       └── find-by-id-user/
│           ├── find-by-id.user.query.ts   ← Query CQRS (objeto inmutable)
│           └── find-by-id.user.handler.ts ← QueryHandler (caso de uso)
│
└── infrastructure/                 ← 🔴 CAPA DE INFRAESTRUCTURA
    ├── controllers/
    │   └── users.controller.ts     ← Adaptador HTTP (entrada)
    ├── dto/
    │   └── find-by-id.user.dto.ts  ← Validación de entrada HTTP
    ├── modules/
    │   └── users.module.ts         ← Registro DI de NestJS
    └── persistence/
        ├── user.orm-entity.ts      ← Modelo TypeORM (decoradores ORM aquí)
        ├── user.mapper.ts          ← Traduce dominio ↔ persistencia
        ├── my-sql.users.repository.ts     ← Adaptador MySQL (salida)
        └── in-memory.users.repository.ts  ← Adaptador en memoria (tests)
```

---

## Las tres capas explicadas

### 🔵 Dominio — El corazón

Es la capa más interna. **No importa nada externo**: ni NestJS, ni TypeORM,
ni Express. Solo TypeScript puro.

#### `user.entity.ts` — La entidad

```typescript
// ✅ Solo TypeScript. Cero imports de frameworks.
export class User {
    private constructor(         // constructor privado: nadie puede hacer new User()
        public readonly id: bigint,
        public readonly email: string,
        // ...todos readonly: estado inmutable
    ) {}

    // Punto de entrada 1: crear un usuario NUEVO con validaciones
    static create(params: { name: string; email: string; hashedPassword: string }): User {
        if (!params.email.includes('@')) throw new Error('User email is invalid')
        // ...más validaciones (invariantes de negocio)
        return new User(0n, params.name, params.email.toLowerCase(), ...)
    }

    // Punto de entrada 2: REHIDRATAR desde base de datos (sin re-validar)
    static reconstitute(id: bigint, name: string, email: string, ...): User {
        return new User(id, name, email, ...)
    }

    // Comportamiento de dominio
    get isEmailVerified(): boolean { ... }
    verifyEmail(date: Date): User { ... }  // retorna nueva instancia (inmutabilidad)
}
```

**Por qué dos métodos estáticos:**
- `create()` se usa al registrar un usuario. Aplica todas las reglas de negocio.
- `reconstitute()` se usa al leer de la BD. Los datos ya fueron validados cuando
  se crearon; rehidratarlos no debe re-lanzar errores.

#### `user.repository.ts` — El puerto (interfaz)

```typescript
// Contrato que el dominio exige. No sabe si es MySQL, MongoDB, o memoria RAM.
export interface UserRepository {
    findAll(pagination: { page: number; limit: number }): Promise<User[]>
    findById(id: bigint): Promise<User | null>
    save(user: User): Promise<void>
    update(id: bigint, user: User): Promise<void>
    delete(id: bigint): Promise<void>
}
```

El dominio **define** la interfaz. La infraestructura **implementa** la interfaz.
Nunca al revés.

#### `user.repository.token.ts` — El token de inyección

```typescript
// Un Symbol único que NestJS usa para resolver qué implementación inyectar.
export const USER_REPOSITORY_TOKEN = Symbol('UserRepository')
```

NestJS no puede inyectar interfaces de TypeScript directamente (se borran en
runtime). El Symbol actúa como identificador estable en tiempo de ejecución.

#### `user-not-found.error.ts` — Error de dominio

```typescript
export class UserNotFoundError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'UserNotFoundError'
    }
}
```

Los errores de dominio no son `HttpException`. Son errores de negocio puros.
Un `ExceptionFilter` en infraestructura se encarga de convertirlos en HTTP 404.

---

### 🟡 Aplicación — Los casos de uso

Orquesta el dominio para ejecutar una operación concreta. No contiene lógica
de negocio propia: eso es responsabilidad del dominio.

Este módulo usa **CQRS** (`@nestjs/cqrs`): las operaciones se dividen en:
- **Query** → lee datos, no modifica estado
- **Command** → modifica estado, no retorna datos de negocio

#### `find-by-id.user.query.ts` — El objeto Query

```typescript
// Objeto inmutable que representa "la intención de buscar un usuario por id".
// El tipo genérico Query<User> indica qué tipo retornará el handler.
export class FindByIdUserQuery extends Query<User> {
    constructor(public readonly userId: bigint) {
        super()
    }
}
```

#### `find-by-id.user.handler.ts` — El QueryHandler (caso de uso)

```typescript
@QueryHandler(FindByIdUserQuery)                    // registra el handler en el bus
export class FindByIdUserHandler implements IQueryHandler<FindByIdUserQuery, User> {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)              // inyecta por token, no por clase concreta
        private readonly userRepository: UserRepository  // depende de la interfaz (puerto)
    ) {}

    async execute(query: FindByIdUserQuery): Promise<User> {
        const user = await this.userRepository.findById(query.userId)  // usa el puerto

        if (!user) throw new UserNotFoundError(...)  // error de dominio, no HttpException

        return user
    }
}
```

**Flujo del handler:**
1. Recibe el `FindByIdUserQuery` del bus.
2. Llama al puerto `UserRepository.findById()`.
3. Si no existe, lanza `UserNotFoundError` (dominio).
4. Retorna la entidad de dominio `User`.

---

### 🔴 Infraestructura — Los adaptadores

Implementa los puertos definidos en el dominio y conecta el sistema con el
mundo exterior (HTTP, MySQL, etc.).

#### `users.controller.ts` — Adaptador de entrada (HTTP)

```typescript
@Controller('users')
export class UsersController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {}

    @Get(':id')
    async findById(@Param() dto: FindByIdUserDto) {
        // El controlador solo despacha al bus. No contiene lógica.
        return this.queryBus.execute(
            new FindByIdUserQuery(BigInt(dto.userId))
        )
    }
}
```

El controlador es un **adaptador de entrada**: convierte una petición HTTP en
un objeto del dominio (`FindByIdUserQuery`) y lo envía al bus de CQRS.

#### `find-by-id.user.dto.ts` — Validación de la petición HTTP

```typescript
export class FindByIdUserDto {
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    userId!: number
}
```

Los DTOs solo existen en infraestructura. Validan que lo que llega por HTTP
tiene el formato correcto antes de entrar al sistema.

#### `user.orm-entity.ts` — Modelo de persistencia

```typescript
// ✅ Los decoradores TypeORM SOLO aparecen aquí, nunca en domain/
@Entity('users')
export class UserOrmEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
    id!: bigint

    @Column({ type: 'varchar', length: 255, unique: true })
    email!: string
    // ...
}
```

Esta clase es exclusiva de TypeORM. Si mañana cambias a Prisma o MongoDB,
solo tocas este archivo y el mapper.

#### `user.mapper.ts` — El traductor

```typescript
export class UserMapper {
    // ORM → Dominio: llamado al LEER de la base de datos
    static toDomain(orm: UserOrmEntity): User {
        return User.reconstitute(orm.id, orm.name, orm.email, ...)
    }

    // Dominio → ORM: llamado al ESCRIBIR en la base de datos
    static toPersistence(user: User): Partial<UserOrmEntity> {
        return { id: user.id, email: user.email, ... }
    }
}
```

Es el **único punto del código** que conoce tanto la entidad de dominio
como el modelo de persistencia. Actúa como frontera entre las dos representaciones.

#### `my-sql.users.repository.ts` — Adaptador de salida (MySQL)

```typescript
@Injectable()
export class MySqlUsersRepository implements UserRepository {  // implementa el PUERTO
    constructor(
        @InjectRepository(UserOrmEntity)
        private readonly ormRepository: Repository<UserOrmEntity>  // TypeORM
    ) {}

    async findById(id: bigint): Promise<User | null> {
        const orm = await this.ormRepository.findOneBy({ id })  // TypeORM
        return orm ? UserMapper.toDomain(orm) : null             // devuelve dominio
    }
    // ...
}
```

El repositorio MySQL **implementa el puerto** del dominio. Habla TypeORM
internamente pero devuelve entidades de dominio.

#### `users.module.ts` — El cableado (DI)

```typescript
@Module({
    imports: [
        CqrsModule,                              // habilita CommandBus, QueryBus, EventBus
        TypeOrmModule.forFeature([UserOrmEntity]), // registra el repositorio TypeORM
    ],
    controllers: [UsersController],
    providers: [
        FindByIdUserHandler,                     // handler registrado para el bus CQRS
        {
            provide: USER_REPOSITORY_TOKEN,      // cuando alguien pida este token...
            useClass: MySqlUsersRepository,      // ...inyecta esta implementación
        },
    ],
})
export class UsersModule {}
```

Este es el único lugar donde se decide qué implementación concreta se usa.
Para tests, basta cambiar `useClass: MySqlUsersRepository` por
`useClass: InMemoryUsersRepository`.

---

## Flujo completo de una petición `GET /users/42`

```
HTTP Request: GET /users/42
        │
        ▼
┌──────────────────────────────────────────────────────────────────┐
│ INFRAESTRUCTURA                                                   │
│                                                                   │
│  FindByIdUserDto          ← valida que "42" es un número positivo │
│  UsersController          ← extrae dto.userId, crea la Query      │
│         │                                                         │
│         │  new FindByIdUserQuery(42n)                             │
│         ▼                                                         │
│  QueryBus.execute(query)  ← despacha al handler registrado        │
└──────────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────────┐
│ APLICACIÓN                                                        │
│                                                                   │
│  FindByIdUserHandler.execute(query)                               │
│         │                                                         │
│         │  userRepository.findById(42n)   ← llama al PUERTO      │
│         ▼                                                         │
│  [si no existe] → throw UserNotFoundError(...)  ← error dominio  │
└──────────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────────┐
│ INFRAESTRUCTURA (adaptador de salida)                             │
│                                                                   │
│  MySqlUsersRepository.findById(42n)                               │
│         │                                                         │
│         │  ormRepository.findOneBy({ id: 42n })  ← TypeORM/MySQL │
│         ▼                                                         │
│  UserMapper.toDomain(ormEntity)  ← convierte a entidad dominio   │
│         │                                                         │
│         │  return User (entidad de dominio)                       │
└──────────────────────────────────────────────────────────────────┘
        │
        ▼
HTTP Response: 200 { id: 42, name: "...", email: "..." }
```

---

## Regla de dependencias — resumen visual

```
users.controller.ts
    │  imports
    ▼
FindByIdUserQuery  ──────────────────────────▶  [dominio]
FindByIdUserHandler
    │  @Inject(USER_REPOSITORY_TOKEN)
    ▼
UserRepository (interfaz)  ◀──────────────────  [dominio define el contrato]
    ▲
    │  implements
MySqlUsersRepository  ───▶  UserOrmEntity  ────  [infraestructura]
                      ───▶  UserMapper
                      ───▶  TypeORM

✅ El dominio NO importa nada de infraestructura
✅ La aplicación NO importa nada de infraestructura
✅ La infraestructura importa dominio y aplicación (correcto)
```

---

## Tests sin base de datos

La separación de capas permite testear sin levantar Docker ni MySQL:

```bash
# Tests de la entidad de dominio (puro TypeScript, sin NestJS)
# src/users/domain/entities/user.entity.spec.ts

# Tests del handler (usa InMemoryUsersRepository en lugar de MySQL)
# src/users/application/queries/find-by-id-user/find-by-id.user.handler.spec.ts

npm test  # o: make test (dentro del contenedor)
```

El `InMemoryUsersRepository` implementa el mismo puerto `UserRepository`
que `MySqlUsersRepository`. El handler no sabe cuál de los dos está usando.

---

## Añadir un nuevo caso de uso — checklist

Ejemplo: crear un usuario (`POST /users`)

```
1. DOMINIO (si hace falta)
   └── user.entity.ts ya tiene User.create() ✅

2. APLICACIÓN
   ├── src/users/application/commands/create-user/
   │   ├── create-user.command.ts     ← Command con los datos del nuevo usuario
   │   └── create-user.handler.ts     ← CommandHandler que llama a repo.save()

3. INFRAESTRUCTURA
   ├── controllers/users.controller.ts  ← añadir @Post() con CreateUserDto
   ├── dto/create-user.dto.ts           ← validar name, email, password
   └── modules/users.module.ts          ← añadir CreateUserHandler a providers
```

**Regla:** los CommandHandlers no retornan datos de negocio (solo `void` o el
id asignado). Si necesitas devolver el usuario creado, lanza un evento de dominio
`UserCreatedEvent` y maneja la proyección en un EventHandler separado.

