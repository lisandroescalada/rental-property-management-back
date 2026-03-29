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
├── domain/                               ← 🔵 CAPA DE DOMINIO
│   ├── entities/
│   │   └── user.entity.ts                ← Entidad de dominio (puro TypeScript)
│   ├── errors/
│   │   ├── user-not-found.error.ts       ← Error de dominio (recibe bigint id)
│   │   └── user-already-exists.error.ts  ← Error de dominio (recibe string email)
│   └── repositories/
│       ├── user.repository.ts            ← Puerto (interfaz, contrato)
│       └── user.repository.token.ts      ← Token de inyección (Symbol)
│
├── application/                          ← 🟡 CAPA DE APLICACIÓN
│   ├── commands/
│   │   ├── create-user/
│   │   │   ├── create-user.command.ts
│   │   │   └── create-user.handler.ts
│   │   ├── update-user/
│   │   │   ├── update-user.command.ts
│   │   │   └── update-user.handler.ts
│   │   └── delete-user/
│   │       ├── delete-user.command.ts
│   │       └── delete-user.handler.ts
│   └── queries/
│       ├── find-all-users/
│       │   ├── find-all.users.query.ts   ← Query<PaginatedResponseDto<UserResponseDto>>
│       │   └── find-all.users.handler.ts ← usa Assembler, devuelve DTO paginado
│       └── find-by-id-user/
│           ├── find-by-id.user.query.ts  ← Query<UserResponseDto>
│           └── find-by-id.user.handler.ts← usa Assembler, devuelve DTO
│
└── infrastructure/                       ← 🔴 CAPA DE INFRAESTRUCTURA
    ├── assemblers/
    │   └── user.assembler.ts             ← ⭐ Transforma User → DTO de respuesta
    ├── controllers/
    │   └── users.controller.ts           ← Adaptador HTTP (entrada)
    ├── dto/
    │   ├── create-user.dto.ts            ← Validación de entrada (POST)
    │   ├── update-user.dto.ts            ← Validación de entrada (PATCH)
    │   ├── pagination-query.dto.ts       ← Validación de entrada (GET paginado)
    │   ├── user-response.dto.ts          ← ⭐ Contrato de salida (un usuario)
    │   └── paginated-response.dto.ts     ← ⭐ Contrato de salida (lista paginada)
    ├── modules/
    │   └── users.module.ts               ← Registro DI de NestJS
    └── persistence/
        ├── user.orm-entity.ts            ← Modelo TypeORM (decoradores ORM aquí)
        ├── user.mapper.ts                ← Traduce dominio ↔ persistencia
        ├── my-sql.users.repository.ts    ← Adaptador MySQL (salida)
        └── in-memory.users.repository.ts ← Adaptador en memoria (tests)
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
    updateProfile(params: { name?: string; email?: string }): User { ... }
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
    count(): Promise<number>   // ← necesario para construir la paginación real
    findById(id: bigint): Promise<User | null>
    findByEmail(email: string): Promise<User | null>
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
// Recibe el id directamente y construye el mensaje internamente.
// Consistente con UserAlreadyExistsError que recibe el email.
export class UserNotFoundError extends Error {
    constructor(id: bigint) {
        super(`User with id '${id}' not found`)
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
- **Query** → lee datos, usa el **Assembler** y retorna un DTO de respuesta
- **Command** → modifica estado, retorna `void`

#### `find-by-id.user.query.ts` — El objeto Query

```typescript
// El tipo genérico indica que el handler devolverá un UserResponseDto,
// no la entidad de dominio (que nunca sale de la capa de aplicación).
export class FindByIdUserQuery extends Query<UserResponseDto> {
    constructor(public readonly userId: bigint) {
        super()
    }
}
```

#### `find-by-id.user.handler.ts` — El QueryHandler (caso de uso)

```typescript
@QueryHandler(FindByIdUserQuery)
export class FindByIdUserHandler implements IQueryHandler<FindByIdUserQuery, UserResponseDto> {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: UserRepository  // depende del PUERTO
    ) {}

    async execute(query: FindByIdUserQuery): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(query.userId)

        if (!user) throw new UserNotFoundError(query.userId)  // error de dominio

        return UserAssembler.toDto(user)  // ← transforma antes de devolver
    }
}
```

**Flujo del handler:**
1. Recibe el `FindByIdUserQuery` del bus.
2. Llama al puerto `UserRepository.findById()`.
3. Si no existe, lanza `UserNotFoundError` con el id (dominio).
4. Usa `UserAssembler.toDto()` para transformar la entidad en un DTO seguro.
5. Retorna `UserResponseDto` (nunca la entidad de dominio cruda).

#### `find-all.users.handler.ts` — Paginación real

```typescript
@QueryHandler(FindAllUsersQuery)
export class FindAllUsersHandler
    implements IQueryHandler<FindAllUsersQuery, PaginatedResponseDto<UserResponseDto>> {

    async execute(query: FindAllUsersQuery): Promise<PaginatedResponseDto<UserResponseDto>> {
        // Consulta datos y total en paralelo (una sola ida al repositorio)
        const [users, total] = await Promise.all([
            this.userRepository.findAll({ page: query.page, limit: query.limit }),
            this.userRepository.count(),
        ])

        return UserAssembler.toPaginatedDto(users, total, query.page, query.limit)
    }
}
```

---

### 🔴 Infraestructura — Los adaptadores

Implementa los puertos definidos en el dominio y conecta el sistema con el
mundo exterior (HTTP, MySQL, etc.).

#### `user-response.dto.ts` — Contrato de salida (un usuario)

```typescript
// Define exactamente qué campos se exponen al cliente.
// Campos sensibles (password, remember_token, settings) nunca aparecen aquí.
export class UserResponseDto {
    id!: string                    // bigint serializado como string (seguro en JSON)
    name!: string
    email!: string
    email_verified_at!: Date | null
    provider!: string | null
    receive_notifications!: number
    created_at!: Date | undefined
    updated_at!: Date | undefined
}
```

#### `paginated-response.dto.ts` — Contrato de salida (lista paginada)

```typescript
// Respuesta estándar para cualquier listado paginado.
// Genérico: PaginatedResponseDto<UserResponseDto>
export class PaginatedResponseDto<T> {
    data!: T[]          // items de la página actual
    total!: number      // total de registros en la BD
    page!: number       // página actual
    limit!: number      // tamaño de página
    totalPages!: number // Math.ceil(total / limit)
}
```

#### `user.assembler.ts` — El transformador dominio → DTO ⭐

```typescript
// Único responsable de convertir entidades de dominio en DTOs de respuesta.
// Centraliza qué datos se exponen y cómo se formatean.
export class UserAssembler {
    // User → UserResponseDto (para findById)
    static toDto(user: User): UserResponseDto {
        const dto = new UserResponseDto()
        dto.id    = user.id.toString()  // bigint → string
        dto.name  = user.name
        dto.email = user.email
        // ...resto de campos públicos (sin password, sin remember_token)
        return dto
    }

    // User[] + metadatos → PaginatedResponseDto<UserResponseDto> (para findAll)
    static toPaginatedDto(
        users: User[],
        total: number,
        page: number,
        limit: number,
    ): PaginatedResponseDto<UserResponseDto> {
        const dto = new PaginatedResponseDto<UserResponseDto>()
        dto.data       = users.map(UserAssembler.toDto)
        dto.total      = total
        dto.page       = page
        dto.limit      = limit
        dto.totalPages = Math.ceil(total / limit)
        return dto
    }
}
```

**Por qué un Assembler y no hacerlo en el mapper:**
- El `UserMapper` traduce entre **dominio ↔ persistencia** (ORM entity).
- El `UserAssembler` traduce entre **dominio ↔ presentación** (DTO de respuesta).
- Son responsabilidades distintas con distintos destinos.

#### `users.controller.ts` — Adaptador de entrada (HTTP)

```typescript
@Controller('users')
export class UsersController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @Get(':id')
    findById(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
        // El controlador solo despacha al bus. No contiene lógica.
        // El tipo de retorno explicita el contrato de la API.
        return this.queryBus.execute(new FindByIdUserQuery(BigInt(id)))
    }

    @Get()
    findAll(@Query() pagination: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>> {
        return this.queryBus.execute(
            new FindAllUsersQuery(pagination.page, pagination.limit),
        )
    }
}
```

#### `create-user.dto.ts` — Validación de la petición HTTP (POST)

```typescript
export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 255)
    name!: string

    @IsNotEmpty()
    @IsEmail()
    email!: string

    @IsNotEmpty()
    @IsString()
    @Length(8, 255)
    password!: string
}
```

#### `update-user.dto.ts` — Validación de la petición HTTP (PATCH)

```typescript
export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @Length(1, 255)
    name?: string

    @IsOptional()
    @IsEmail()
    email?: string

    // Nota: no incluye password, para evitar envíos accidentales
}
```

#### `pagination-query.dto.ts` — Validación de la paginación (GET paginado)

```typescript
export class PaginationQueryDto {
    @IsOptional()
    @IsInt()
    @IsPositive()
    page?: number = 1

    @IsOptional()
    @IsInt()
    @IsPositive()
    limit?: number = 10
}
```

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

#### `user.mapper.ts` — El traductor ORM ↔ Dominio

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
como el modelo de persistencia.

#### `my-sql.users.repository.ts` — Adaptador de salida (MySQL)

```typescript
@Injectable()
export class MySqlUsersRepository implements UserRepository {  // implementa el PUERTO
    async findAll(pagination): Promise<User[]> {
        const entities = await this.ormRepository.find({ skip, take })
        return entities.map(UserMapper.toDomain)  // devuelve entidades de dominio
    }

    async count(): Promise<number> {
        return this.ormRepository.count()  // delegado a TypeORM
    }

    async findById(id: bigint): Promise<User | null> {
        const orm = await this.ormRepository.findOneBy({ id })
        return orm ? UserMapper.toDomain(orm) : null
    }
    // ...
}
```

#### `users.module.ts` — El cableado (DI)

```typescript
@Module({
    imports: [
        CqrsModule,                                // habilita CommandBus, QueryBus
        TypeOrmModule.forFeature([UserOrmEntity]), // registra el repositorio TypeORM
    ],
    controllers: [UsersController],
    providers: [
        ...QueryHandlers,   // [FindByIdUserHandler, FindAllUsersHandler]
        ...CommandHandlers, // [CreateUserHandler, UpdateUserHandler, DeleteUserHandler]
        {
            provide: USER_REPOSITORY_TOKEN,   // cuando alguien pida este token...
            useClass: MySqlUsersRepository,   // ...inyecta esta implementación
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
│ INFRAESTRUCTURA (entrada)                                         │
│                                                                   │
│  ParseIntPipe             ← valida que "42" es un número positivo │
│  UsersController          ← crea FindByIdUserQuery(42n)           │
│         │                                                         │
│         │  queryBus.execute(new FindByIdUserQuery(42n))           │
└──────────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────────┐
│ APLICACIÓN                                                        │
│                                                                   │
│  FindByIdUserHandler.execute(query)                               │
│         │                                                         │
│         │  userRepository.findById(42n)     ← llama al PUERTO    │
│         ▼                                                         │
│  [si no existe] → throw UserNotFoundError(42n)  ← error dominio  │
│         │                                                         │
│         │  UserAssembler.toDto(user)  ← transforma al DTO        │
└──────────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────────┐
│ INFRAESTRUCTURA (salida)                                          │
│                                                                   │
│  MySqlUsersRepository.findById(42n)                               │
│         │                                                         │
│         │  ormRepository.findOneBy({ id: 42n })  ← TypeORM/MySQL │
│         ▼                                                         │
│  UserMapper.toDomain(ormEntity)  ← convierte a entidad dominio   │
│         │                                                         │
│         │  return User (entidad de dominio, solo internamente)    │
└──────────────────────────────────────────────────────────────────┘
        │
        ▼
HTTP Response: 200 {
    "id": "42", "name": "...", "email": "...",
    "email_verified_at": null, "provider": null,
    "receive_notifications": 1, "created_at": "...", "updated_at": "..."
    // ❌ password, remember_token y settings NUNCA aparecen aquí
}
```

## Flujo completo de una petición `GET /users?page=1&limit=10`

```
HTTP Request: GET /users?page=1&limit=10
        │
        ▼
┌──────────────────────────────────────────────────────────────────┐
│ INFRAESTRUCTURA (entrada)                                         │
│                                                                   │
│  PaginationQueryDto       ← valida page y limit (defaults: 1, 10)│
│  UsersController          ← crea FindAllUsersQuery(1, 10)         │
└──────────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────────┐
│ APLICACIÓN                                                        │
│                                                                   │
│  FindAllUsersHandler.execute(query)                               │
│         │                                                         │
│         │  Promise.all([findAll(...), count()])  ← en paralelo   │
│         ▼                                                         │
│  UserAssembler.toPaginatedDto(users, total, page, limit)         │
└──────────────────────────────────────────────────────────────────┘
        │
        ▼
HTTP Response: 200 {
    "data": [ { "id": "1", "name": "..." }, ... ],
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
}
```

---

## Regla de dependencias — resumen visual

```
users.controller.ts
    │  imports
    ▼
FindByIdUserQuery / FindAllUsersQuery ──────────▶  [aplicación]
FindByIdUserHandler / FindAllUsersHandler
    │  @Inject(USER_REPOSITORY_TOKEN)
    ▼
UserRepository (interfaz)  ◀──────────────────────  [dominio define el contrato]
    ▲
    │  implements
MySqlUsersRepository  ───▶  UserOrmEntity  ─────────  [infraestructura]
                      ───▶  UserMapper (ORM ↔ dominio)
                      ───▶  TypeORM

UserAssembler  ───▶  User (dominio)  ─────────────── [infra conoce al dominio]
               ───▶  UserResponseDto
               ───▶  PaginatedResponseDto

✅ El dominio NO importa nada de infraestructura ni de aplicación
✅ La aplicación NO importa nada de infraestructura
✅ La infraestructura importa dominio y aplicación (correcto)
✅ Los datos sensibles (password, remember_token) NUNCA llegan al cliente
```

---

## Tests sin base de datos

La separación de capas permite testear sin levantar Docker ni MySQL:

```bash
# Tests de la entidad de dominio (puro TypeScript, sin NestJS)
# src/users/domain/entities/user.entity.spec.ts

# Tests de los query handlers (usan InMemoryUsersRepository)
# src/users/application/queries/find-by-id-user/find-by-id.user.handler.spec.ts
# src/users/application/queries/find-all-users/find-all.users.handler.spec.ts

# Tests de los command handlers
# src/users/application/commands/create-user/create-user.handler.spec.ts
# src/users/application/commands/update-user/update-user.handler.spec.ts
# src/users/application/commands/delete-user/delete-user.handler.spec.ts

npm test  # o: make test (dentro del contenedor)
```

Los specs de query handlers verifican también que:
- El resultado es `instanceof UserResponseDto` / `instanceof PaginatedResponseDto`
- Los campos sensibles (`password`, `remember_token`) **no están presentes** en la respuesta
- El `id` se serializa como `string` (no como `bigint`)

El `InMemoryUsersRepository` implementa el mismo puerto `UserRepository`
que `MySqlUsersRepository`. El handler no sabe cuál de los dos está usando.

---

## Añadir un nuevo caso de uso — checklist

Ejemplo: verificar el email de un usuario (`PATCH /users/:id/verify-email`)

```
1. DOMINIO (si hace falta)
   └── user.entity.ts ya tiene verifyEmail(date: Date): User ✅

2. APLICACIÓN
   ├── src/users/application/commands/verify-email/
   │   ├── verify-email.command.ts     ← Command con el id del usuario
   │   └── verify-email.handler.ts     ← CommandHandler que llama a repo.update()

3. INFRAESTRUCTURA
   ├── controllers/users.controller.ts  ← añadir @Patch(':id/verify-email')
   └── modules/users.module.ts          ← añadir VerifyEmailHandler a CommandHandlers
```

**Reglas:**
- Los **CommandHandlers** retornan `void`. No devuelven datos de negocio.
- Los **QueryHandlers** siempre usan `UserAssembler` antes de retornar. Nunca
  exponen la entidad de dominio directamente.
- Si un comando necesita devolver el recurso creado/modificado, lo correcto es
  que el cliente haga una `Query` posterior, o lanzar un evento de dominio
  `UserCreatedEvent` manejado por un `EventHandler` separado.
