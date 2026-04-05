import { CreateTenantCommand } from './create-tenant.command'
import { CreateTenantHandler } from './create-tenant.handler'
import { Tenant } from '../../../domain/entities/tenant.entity'
import { TenantRepository } from '../../../domain/repositories/tenant.repository'
import { InvalidNameException } from '../../../domain/excepcions/invalid-name.exception'

/**
 * TESTS UNITARIOS PARA CREATE TENANT COMMAND
 * 
 * Commands:
 * - Representan acciones que cambian el estado (write operations)
 * - Se usan para cambios de dominio
 * - Handlers: ejecutan la lógica y guardan cambios
 * - Importante: Mockeamos las dependencias (repositorio)
 */
describe('CreateTenantHandler', () => {
  
  let handler: CreateTenantHandler
  let mockRepository: jest.Mocked<TenantRepository>

  beforeEach(() => {
    // Arrange: Preparar mock del repositorio
    mockRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    } as any

    // Inyectar mock en el handler
    handler = new CreateTenantHandler(mockRepository)
  })

  describe('execute()', () => {
    
    it('should create and save a new tenant', async () => {
      // Arrange: Preparar datos válidos
      const command = new CreateTenantCommand(
        'Juan López',
        '+34 600 123 456',
        '12345678A',
        '1990-01-15',
        'Cliente VIP',
        1n
      )

      // Act: Ejecutar el handler
      await handler.execute(command)

      // Assert: Verificar que el repositorio.save fue llamado
      expect(mockRepository.save).toHaveBeenCalledTimes(1)
      const savedTenant = mockRepository.save.mock.calls[0][0]
      expect(savedTenant).toBeInstanceOf(Tenant)
      expect(savedTenant.name).toBe(command.name)
      expect(savedTenant.phone).toBe(command.phone)
      expect(savedTenant.dni).toBe(command.dni)
      expect(savedTenant.birthdate).toBe(command.birthdate)
      expect(savedTenant.observations).toBe(command.observations)
      expect(savedTenant.userId).toBe(command.userId)
    })

    it('should create tenant without optional fields', async () => {
      const command = new CreateTenantCommand(
        'María García',
        '+34 600 987 654',
        '87654321B',
        '1985-05-20',
        undefined,
        undefined
      )

      await handler.execute(command)

      expect(mockRepository.save).toHaveBeenCalledTimes(1)
      const savedTenant = mockRepository.save.mock.calls[0][0]
      expect(savedTenant.observations).toBeUndefined()
      expect(savedTenant.userId).toBeUndefined()
    })

    it('should throw InvalidNameException when name is invalid', async () => {
      const command = new CreateTenantCommand(
        '',
        '+34 600 123 456',
        '12345678A',
        '1990-01-15',
        undefined,
        undefined
      )

      await expect(handler.execute(command)).rejects.toThrow(InvalidNameException)
      expect(mockRepository.save).not.toHaveBeenCalled()
    })

    it('should throw error if repository save fails', async () => {
      const command = new CreateTenantCommand(
        'Juan López',
        '+34 600 123 456',
        '12345678A',
        '1990-01-15',
        undefined,
        undefined
      )

      mockRepository.save.mockRejectedValueOnce(new Error('Database connection failed'))

      await expect(handler.execute(command)).rejects.toThrow('Database connection failed')
    })

    it('should call repository save exactly once per command', async () => {
      const command = new CreateTenantCommand(
        'Juan López',
        '+34 600 123 456',
        '12345678A',
        '1990-01-15',
        undefined,
        undefined
      )

      await handler.execute(command)
      expect(mockRepository.save).toHaveBeenCalledTimes(1)
    })
  })
})
