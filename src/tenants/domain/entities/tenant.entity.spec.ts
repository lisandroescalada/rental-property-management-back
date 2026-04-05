import { Tenant } from './tenant.entity'
import { InvalidNameException } from '../excepcions/invalid-name.exception'
import { InvalidPhoneException } from '../excepcions/invalid-phone.exception'
import { InvalidDniException } from '../excepcions/invalid-dni.exception'
import { InvalidBirthdateException } from '../excepcions/invalid-birthdate.exception'

/**
 * TESTS UNITARIOS PARA TENANT ENTITY
 * 
 * Explica:
 * - Hereda de DDD (Domain-Driven Design)
 * - La entidad encapsula la lógica de negocio
 * - Validamos que los métodos estáticos crean tenants correctamente
 * - Cada test es independiente y prueba una responsabilidad
 */
describe('Tenant Entity', () => {
  
  // ─── CREATE METHOD ────────────────────────────────────────────────────────────
  describe('create()', () => {
    
    it('should create a new tenant with valid data', () => {
      // Arrange: Preparar datos válidos
      const params = {
        name: 'Juan López',
        phone: '+34 600 123 456',
        dni: '12345678A',
        birthdate: '1990-01-15',
        observations: 'Cliente VIP',
        userId: 1n
      }

      // Act: Ejecutar la creación
      const tenant = Tenant.create(params)

      // Assert: Verificar que se creó correctamente
      expect(tenant).toBeDefined()
      expect(tenant.id).toBeDefined()
      expect(typeof tenant.id.value).toBe('string')
      expect(tenant.id.toString()).toBe(tenant.id.value)
      expect(tenant.name).toBe(params.name)
      expect(tenant.phone).toBe(params.phone)
      expect(tenant.dni).toBe(params.dni)
      expect(tenant.birthdate).toBe(params.birthdate)
      expect(tenant.observations).toBe(params.observations)
      expect(tenant.userId).toBe(params.userId)
      expect(tenant.created_at).toBeInstanceOf(Date)
      expect(tenant.updated_at).toBeInstanceOf(Date)
    })

    it('should create tenant without optional fields', () => {
      const params = {
        name: 'María García',
        phone: '+34 600 987 654',
        dni: '87654321B',
        birthdate: '1985-05-20'
      }

      const tenant = Tenant.create(params)

      expect(tenant).toBeDefined()
      expect(tenant.observations).toBeUndefined()
      expect(tenant.userId).toBeUndefined()
    })

    it('should throw InvalidNameException when name is empty', () => {
      const params = {
        name: '',
        phone: '+34 600 123 456',
        dni: '12345678A',
        birthdate: '1990-01-15'
      }

      expect(() => Tenant.create(params)).toThrow(InvalidNameException)
    })

    it('should throw InvalidNameException when name is only whitespace', () => {
      const params = {
        name: '   ',
        phone: '+34 600 123 456',
        dni: '12345678A',
        birthdate: '1990-01-15'
      }

      expect(() => Tenant.create(params)).toThrow(InvalidNameException)
    })

    it('should throw InvalidPhoneException when phone is empty', () => {
      const params = {
        name: 'Juan López',
        phone: '',
        dni: '12345678A',
        birthdate: '1990-01-15'
      }

      expect(() => Tenant.create(params)).toThrow(InvalidPhoneException)
    })

    it('should throw InvalidDniException when dni is empty', () => {
      const params = {
        name: 'Juan López',
        phone: '+34 600 123 456',
        dni: '',
        birthdate: '1990-01-15'
      }

      expect(() => Tenant.create(params)).toThrow(InvalidDniException)
    })

    it('should throw InvalidBirthdateException when birthdate is empty', () => {
      const params = {
        name: 'Juan López',
        phone: '+34 600 123 456',
        dni: '12345678A',
        birthdate: ''
      }

      expect(() => Tenant.create(params)).toThrow(InvalidBirthdateException)
    })
  })

  // ─── RECONSTITUTE METHOD ──────────────────────────────────────────────────────
  describe('reconstitute()', () => {
    
    it('should reconstitute a tenant from database values', () => {
      // Arrange: Simular datos que vienen de la DB
      const id = 123n
      const name = 'Pedro Martínez'
      const phone = '+34 600 111 222'
      const dni = '11223344C'
      const birthdate = '1992-03-10'
      const observations = 'Observación importante'
      const userId = 2n
      const createdAt = new Date('2024-01-01')
      const updatedAt = new Date('2024-02-15')

      // Act: Reconstitute del tenant
      const tenant = Tenant.reconstitute(
        id, name, phone, dni, birthdate, observations, userId, createdAt, updatedAt
      )

      // Assert: Verificar que todos los valores se asignaron correctamente
      expect(tenant.id.toString()).toBe(id.toString())
      expect(tenant.name).toBe(name)
      expect(tenant.phone).toBe(phone)
      expect(tenant.dni).toBe(dni)
      expect(tenant.birthdate).toBe(birthdate)
      expect(tenant.observations).toBe(observations)
      expect(tenant.userId).toBe(userId)
      expect(tenant.created_at).toBe(createdAt)
      expect(tenant.updated_at).toBe(updatedAt)
    })

    it('should reconstitute tenant with minimal data', () => {
      const tenant = Tenant.reconstitute(
        1n,
        'Test Tenant',
        '+34 600 000 000',
        '00000000A',
        '1990-01-01'
      )

      expect(tenant.id.toString()).toBe('1')
      expect(tenant.observations).toBeUndefined()
      expect(tenant.userId).toBeUndefined()
      expect(tenant.created_at).toBeUndefined()
      expect(tenant.updated_at).toBeUndefined()
    })
  })

  // ─── UPDATE PROFILE METHOD ────────────────────────────────────────────────────
  describe('updateProfile()', () => {
    
    it('should update all tenant profile fields', () => {
      // Arrange: Crear un tenant inicial
      const originalTenant = Tenant.create({
        name: 'Original Name',
        phone: '+34 600 111 111',
        dni: '11111111A',
        birthdate: '1990-01-01',
        observations: 'Original observation'
      })

      // Act: Actualizar el perfil
      const updatedTenant = originalTenant.updateProfile({
        name: 'New Name',
        phone: '+34 600 222 222',
        dni: '22222222B',
        birthdate: '1991-02-02',
        observations: 'New observation'
      })

      // Assert: Verificar que los datos se actualizaron
      expect(updatedTenant.name).toBe('New Name')
      expect(updatedTenant.phone).toBe('+34 600 222 222')
      expect(updatedTenant.dni).toBe('22222222B')
      expect(updatedTenant.birthdate).toBe('1991-02-02')
      expect(updatedTenant.observations).toBe('New observation')
    })

    it('should update only some fields', () => {
      const originalTenant = Tenant.create({
        name: 'Juan López',
        phone: '+34 600 111 111',
        dni: '11111111A',
        birthdate: '1990-01-01'
      })

      // Act: Actualizar solo el nombre y teléfono
      const updatedTenant = originalTenant.updateProfile({
        name: 'Juan García',
        phone: '+34 600 222 222'
      })

      // Assert: Verificar actualizaciones parciales
      expect(updatedTenant.name).toBe('Juan García')
      expect(updatedTenant.phone).toBe('+34 600 222 222')
      // Los campos no actualizados mantienen el valor original
      expect(updatedTenant.dni).toBe('11111111A')
      expect(updatedTenant.birthdate).toBe('1990-01-01')
    })

    it('should throw InvalidNameException when updating with invalid name', () => {
      const tenant = Tenant.create({
        name: 'Juan López',
        phone: '+34 600 123 456',
        dni: '12345678A',
        birthdate: '1990-01-01'
      })

      expect(() => tenant.updateProfile({ name: '' })).toThrow(InvalidNameException)
    })

    it('should throw InvalidPhoneException when updating with invalid phone', () => {
      const tenant = Tenant.create({
        name: 'Juan López',
        phone: '+34 600 123 456',
        dni: '12345678A',
        birthdate: '1990-01-01'
      })

      expect(() => tenant.updateProfile({ phone: '  ' })).toThrow(InvalidPhoneException)
    })

    it('should preserve id when updating profile', () => {
      const tenant = Tenant.reconstitute(
        999n,
        'Original',
        '+34 600 123 456',
        '12345678A',
        '1990-01-01'
      )

      const updated = tenant.updateProfile({ name: 'Updated Name' })

      expect(updated.id.toString()).toBe('999')
    })
  })

  // ─── IMMUTABILITY TEST ────────────────────────────────────────────────────────
  describe('immutability', () => {
    
    it('should not modify original tenant after update', () => {
      const original = Tenant.create({
        name: 'Original Name',
        phone: '+34 600 123 456',
        dni: '12345678A',
        birthdate: '1990-01-01'
      })

      const updated = original.updateProfile({ name: 'New Name' })

      // Original debe mantener sus valores
      expect(original.name).toBe('Original Name')
      expect(updated.name).toBe('New Name')
    })
  })
})
