# 📋 Guía Completa de Tests Unitarios - Tenants Module

## Índice
1. [Conceptos Fundamentales](#conceptos-fundamentales)
2. [Estructura de los Tests](#estructura-de-los-tests)
3. [Cómo Ejecutar los Tests](#cómo-ejecutar-los-tests)
4. [Arquitectura de Tests por Capa](#arquitectura-de-tests-por-capa)
5. [Mejores Prácticas](#mejores-prácticas)
6. [Hacer Tests Sin Ayuda](#hacer-tests-sin-ayuda)

---

## Conceptos Fundamentales

### ¿Qué son los tests unitarios?

Son pruebas automatizadas que verifican que una **unidad individual de código** funciona correctamente en aislamiento. Una "unidad" puede ser:
- Una función
- Un método
- Una clase
- Un comportamiento específico

### ¿Para qué sirven?

| Beneficio | Descripción |
|-----------|-------------|
| **Validar correctitud** | Aseguran que el código hace lo que se espera |
| **Detectar bugs** | Los encuentran antes de producción |
| **Facilitar refactorización** | Permiten cambiar código sin miedo |
| **Documentación viva** | Los tests muestran cómo usar el código |
| **Confianza en cambios** | Incrementan la seguridad al modificar |
| **Reducir debugging** | Menos tiempo buscando errores |

### ¿Cómo escribir un test?

**AAA Pattern (Arrange-Act-Assert):**

```typescript
it('should [comportamiento esperado]', () => {
  // ARRANGE: Preparar datos y configuración
  const input = "datos";
  const expectedOutput = "resultado";

  // ACT: Ejecutar la función/método
  const result = funcion(input);

  // ASSERT: Verificar que el resultado es correcto
  expect(result).toBe(expectedOutput);
});
```

---

## Estructura de los Tests

### Anatomía de un Test Completo

```typescript
describe('MiClase', () => {  // Describe: Agrupar tests relacionados
  
  let instancia: MiClase;
  
  beforeEach(() => {  // beforeEach: Se ejecuta antes de cada test
    // Configuración común
    instancia = new MiClase();
  });

  describe('miMetodo()', () => {  // Describe anidado: Grupo de tests para un método
    
    it('should [comportamiento esperado]', () => {  // it: Un test individual
      // Arrange
      const input = "datos";
      
      // Act
      const result = instancia.miMetodo(input);
      
      // Assert
      expect(result).toBe("resultado esperado");
    });

    it('should [otro comportamiento]', () => {
      // Test adicional
    });
  });
});
```

### Matchers Comunes en Jest

```typescript
// Igualdad
expect(resultado).toBe(5);                    // igualdad estricta (===)
expect(resultado).toEqual({ id: 1 });        // igualdad profunda
expect(resultado).toStrictEqual({ id: 1 });  // más estricto

// Verdad
expect(resultado).toBeTruthy();
expect(resultado).toBeFalsy();
expect(resultado).toBeNull();
expect(resultado).toBeUndefined();

// Números
expect(resultado).toBeGreaterThan(5);
expect(resultado).toBeLessThan(10);
expect(resultado).toBeCloseTo(3.14);

// Arrays
expect(resultado).toHaveLength(3);
expect(resultado).toContain("elemento");
expect(resultado).toEqual(["a", "b", "c"]);

// Objetos
expect(resultado).toHaveProperty("nombre");
expect(resultado.nombre).toBe("Juan");

// Errores
expect(() => funcion()).toThrow();
expect(() => funcion()).toThrow(MiExcepcion);
expect(promesa).rejects.toThrow();

// Llamadas (mocks)
expect(mock).toHaveBeenCalled();
expect(mock).toHaveBeenCalledWith("arg");
expect(mock).toHaveBeenCalledTimes(2);
```

---

## Cómo Ejecutar los Tests

### Comandos Básicos

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests de un archivo específico
npm test -- tenants.controller.spec.ts

# Ejecutar tests de una carpeta
npm test -- src/tenants

# Modo "watch" (re-ejecuta al guardar archivos)
npm run test:watch

# Generar reporte de cobertura
npm run test:cov

# Tests end-to-end (integración)
npm run test:e2e
```

### Entender la Salida

```
 PASS  src/tenants/domain/entities/tenant.entity.spec.ts
  Tenant Entity
    create()
      ✓ should create a new tenant with valid data (5 ms)
      ✓ should throw InvalidNameException when name is empty (2 ms)
    updateProfile()
      ✓ should update all tenant profile fields (3 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

- `PASS`: El archivo de tests pasó ✓
- `FAIL`: Algún test falló ✗
- `●`: Test que falló
- `✓`: Test que pasó

---

## Arquitectura de Tests por Capa

Este proyecto sigue **Domain-Driven Design (DDD)** con arquitectura en capas:

### 1. **Domain Layer** (Capa de Dominio)

#### Entity Tests: `tenant.entity.spec.ts`

Se prueban:
- Creación de entidades (`create()`)
- Reconstitución desde BD (`reconstitute()`)
- Lógica de negocio (`updateProfile()`)
- Validaciones de Value Objects
- Inmutabilidad

**Ejemplo:**
```typescript
it('should create a new tenant with valid data', () => {
  const tenant = Tenant.create({
    name: 'Juan López',
    phone: '+34 600 123 456',
    dni: '12345678A',
    birthdate: '1990-01-15'
  });

  expect(tenant.name).toBe('Juan López');
  expect(tenant.id).toBe(0n); // Nuevos tenants tienen id 0
});
```

#### Value Object Tests: `*.vo.spec.ts`

Se prueban:
- Validaciones específicas del dominio
- Lanzamiento de excepciones
- Encapsulación

**Ejemplo:**
```typescript
it('should throw InvalidNameException when name is empty', () => {
  expect(() => Name.create('')).toThrow(InvalidNameException);
});
```

### 2. **Application Layer** (Capa de Aplicación)

#### Command Handler Tests: `*handler.spec.ts` (en commands/)

Se prueban:
- Ejecución de cambios de estado
- Validación de existencia (antes de actualizar/eliminar)
- Integración con repositorio

**Ejemplo:**
```typescript
it('should create and save a new tenant', async () => {
  const handler = new CreateTenantHandler(mockRepository);
  const command = new CreateTenantCommand('Juan López', ...);
  
  await handler.execute(command);
  
  expect(mockRepository.save).toHaveBeenCalled();
});
```

#### Query Handler Tests: `*handler.spec.ts` (en queries/)

Se prueban:
- Lectura de datos
- Transformación a DTOs
- Paginación

**Ejemplo:**
```typescript
it('should return paginated list of tenants', async () => {
  const handler = new FindAllTenantsHandler(mockRepository);
  const query = new FindAllTenantsQuery(1, 10);
  
  const result = await handler.execute(query);
  
  expect(result.data).toHaveLength(3);
  expect(result.total).toBe(3);
});
```

### 3. **Infrastructure Layer** (Capa de Infraestructura)

#### Controller Tests: `*.controller.spec.ts`

Se prueban:
- Mapeo de solicitudes HTTP a Comandos/Queries
- Validación de parámetros
- Códigos de estado HTTP correctos

**Ejemplo:**
```typescript
it('should create a new tenant', async () => {
  const dto = { name: 'Juan López', phone: '...', ... };
  
  await controller.create(dto);
  
  expect(commandBus.execute).toHaveBeenCalled();
});
```

---

## Mejores Prácticas

### 1. **Naming Conventions**

```typescript
// ✅ BIEN: Descriptivo y claro
it('should create a new tenant with valid data', () => { ... });
it('should throw InvalidNameException when name is empty', () => { ... });

// ❌ MAL: Vago
it('should work', () => { ... });
it('test creation', () => { ... });
```

### 2. **One Assertion per Test (cuando sea posible)**

```typescript
// ✅ BIEN: Un test por comportamiento
it('should set the name correctly', () => {
  const tenant = Tenant.create({ ... });
  expect(tenant.name).toBe('Juan');
});

it('should set the phone correctly', () => {
  const tenant = Tenant.create({ ... });
  expect(tenant.phone).toBe('+34 600 123 456');
});

// ❌ EVITAR: Múltiples aserciones sin contexto
it('should create tenant', () => {
  expect(tenant.name).toBe(...);
  expect(tenant.phone).toBe(...);
  expect(tenant.dni).toBe(...);
  // Si falla la primera, no se ejecutan las otras
});
```

### 3. **Mock Solamente Dependencias Externas**

```typescript
// ✅ BIEN: Mockeamos el repositorio (dependencia externa)
const mockRepository = {
  save: jest.fn(),
  findById: jest.fn()
};

// ❌ MAL: Mockeamos la lógica que queremos probar
const mockTenant = jest.fn();
```

### 4. **Usar `beforeEach` para Setup Común**

```typescript
// ✅ BIEN
beforeEach(() => {
  mockRepository = {};
  handler = new CreateTenantHandler(mockRepository);
});

it('test 1', () => { ... });
it('test 2', () => { ... });

// ❌ MAL: Duplicar setup
it('test 1', () => {
  mockRepository = {};
  handler = new CreateTenantHandler(mockRepository);
  ...
});

it('test 2', () => {
  mockRepository = {};
  handler = new CreateTenantHandler(mockRepository);
  ...
});
```

### 5. **Test Edge Cases y Errores**

```typescript
describe('CreateTenantHandler', () => {
  it('should handle valid case', () => { ... });          // Happy path
  it('should handle missing optional fields', () => { ... });  // Edge case
  it('should throw when invalid name', () => { ... });    // Error case
  it('should throw when DB fails', () => { ... });        // Error path
});
```

### 6. **DRY (Don't Repeat Yourself)**

```typescript
// ✅ BIEN: Helpers reutilizables
const createValidTenant = () => ({
  name: 'Juan López',
  phone: '+34 600 123 456',
  dni: '12345678A',
  birthdate: '1990-01-15'
});

it('test 1', () => {
  const tenant = Tenant.create(createValidTenant());
  ...
});

// ❌ MAL: Duplicado
it('test 1', () => {
  const tenant = Tenant.create({
    name: 'Juan López',
    phone: '+34 600 123 456',
    dni: '12345678A',
    birthdate: '1990-01-15'
  });
});
```

---

## Hacer Tests Sin Ayuda

### Paso a Paso para Crear un Test Nuevo

#### 1. Entiende Tu Código

Antes de escribir tests, responde:
- ¿Qué hace este método?
- ¿Cuáles son los inputs?
- ¿Cuál es el output esperado?
- ¿Qué puede salir mal?

#### 2. Identifica Casos de Prueba

```
Entrada Normal (Happy Path)
├─ Caso básico
├─ Casos con valores extremos
└─ Casos con valores límite

Entrada Inválida (Error Cases)
├─ Valores vacíos/null
├─ Valores del tipo incorrecto
└─ Violaciones de negocio
```

#### 3. Escribe el Test

**Estructura:**

```typescript
describe('MiClase', () => {
  let instancia: MiClase;
  let mockDependencia: jest.Mocked<Dependencia>;

  beforeEach(() => {
    // Setup común
    mockDependencia = {
      metodo: jest.fn()
    } as any;

    instancia = new MiClase(mockDependencia);
  });

  describe('miMetodo()', () => {
    
    it('should [comportamiento esperado]', () => {
      // ARRANGE
      const input = ...;
      const expected = ...;

      // ACT
      const result = instancia.miMetodo(input);

      // ASSERT
      expect(result).toBe(expected);
    });

    it('should throw [excepción] when [condición]', () => {
      // ARRANGE
      const invalidInput = ...;

      // ACT & ASSERT
      expect(() => instancia.miMetodo(invalidInput)).toThrow(MiExcepcion);
    });
  });
});
```

#### 4. Ejecuta y Verifica

```bash
# Ejecuta tus tests
npm test -- miArchivo.spec.ts --watch

# Verifica que pasen
# Verifica que sea rápido (< 100ms por test)
# Verifica que la cobertura sea buena (> 80%)
```

### Checklist para Escribir Tests

- [ ] He entendido completamente qué testea
- [ ] El nombre describe claramente el comportamiento
- [ ] Hay un Arrange, Act y Assert claros
- [ ] Las dependencias están mockeadas
- [ ] Pruebo el happy path
- [ ] Pruebo al menos un error case
- [ ] Pruebo edge cases relevantes
- [ ] El test es independiente de otros
- [ ] El test es rápido (< 100ms)
- [ ] No hay duplication de código

### Ejercicios Prácticos

#### Ejercicio 1: Test Simple de Value Object

Crea un test para `Phone.create()`:

```typescript
describe('Phone Value Object', () => {
  it('should create a valid phone', () => {
    // TODO: Implementa
  });

  it('should throw when phone is empty', () => {
    // TODO: Implementa
  });
});
```

#### Ejercicio 2: Test de Entity

Crea tests para `Tenant.updateProfile()`:

```typescript
describe('Tenant.updateProfile()', () => {
  it('should update phone', () => {
    // TODO: Implementa
  });

  it('should throw when invalid phone', () => {
    // TODO: Implementa
  });

  it('should preserve id after update', () => {
    // TODO: Implementa
  });
});
```

#### Ejercicio 3: Test de Handler

Crea tests para un handler con mocks:

```typescript
describe('DeleteTenantHandler', () => {
  it('should delete tenant if exists', async () => {
    // TODO: Implementa con mocks
  });

  it('should throw if tenant not found', async () => {
    // TODO: Implementa
  });
});
```

---

## Cobertura de Código

La cobertura mide qué porcentaje de tu código está siendo testado:

```bash
npm run test:cov
```

Genera un reporte en `coverage/`:

| Métrica | Cobertura | Descripción |
|---------|-----------|-------------|
| **Statements** | % de instrucciones ejecutadas |
| **Branches** | % de condiciones evaluadas (if/else) |
| **Functions** | % de funciones llamadas |
| **Lines** | % de líneas ejecutadas |

**Objetivo:** > 80% es excelente, > 70% es aceptable.

---

## Resumen de Archivos Creados

```
src/tenants/
├── domain/
│   ├── entities/
│   │   └── tenant.entity.spec.ts          ✓ Tests de Entity
│   └── value-object/
│       ├── name.vo.spec.ts                ✓ Tests de Name VO
│       ├── phone.vo.spec.ts               ✓ Tests de Phone VO
│       ├── dni.vo.spec.ts                 ✓ Tests de DNI VO
│       ├── birthdate.vo.spec.ts           ✓ Tests de Birthdate VO
│       └── observations.vo.spec.ts        ✓ Tests de Observations VO
├── application/
│   ├── commands/
│   │   ├── create-tenant/
│   │   │   └── create-tenant.handler.spec.ts     ✓
│   │   ├── update-tenant/
│   │   │   └── update-tenant.handler.spec.ts     ✓
│   │   └── delete-tenant/
│   │       └── delete-tenant.handler.spec.ts     ✓
│   └── queries/
│       ├── find-all-tenant/
│       │   └── find-all.tenants.handler.spec.ts  ✓
│       └── find-by-id-tenant/
│           └── find-by-id.tenant.handler.spec.ts ✓
└── infrastructure/
    └── controllers/
        └── tenants.controller.spec.ts           ✓ Tests del Controller
```

---

## Siguientes Pasos

1. **Ejecuta los tests:** `npm test -- tenants`
2. **Verifica cobertura:** `npm run test:cov`
3. **Aprende de esos tests** - Léelos para entender los patrones
4. **Crea tests nuevos** para nuevas funcionalidades
5. **Mantén los tests actualizados** cuando cambies código

¡Felicidades! Ahora tienes un conjunto robusto de tests unitarios para tenants. 🎉
