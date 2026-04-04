import { UpdateTenantCommand } from './update-tenant.command'
import { UpdateTenantHandler } from './update-tenant.handler'
import { Tenant } from '../../../domain/entities/tenant.entity'
import { TenantRepository } from '../../../domain/repositories/tenant.repository'
import { TenantNotFoundexception } from '../../../domain/excepcions/tenant-not-found.exception'

/**
 * TESTS UNITARIOS PARA UPDATE TENANT COMMAND
 */
describe('UpdateTenantHandler', () => {
  
  let handler: UpdateTenantHandler
  let mockRepository: jest.Mocked<TenantRepository>

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn(),
      count: jest.fn()
    } as any

    handler = new UpdateTenantHandler(mockRepository)
  })

  describe('execute()', () => {
    
    it('should update all tenant fields', async () => {
      // Arrange: Preparar tenant existente y comando
      const existingTenant = Tenant.reconstitute(
        1n,
        'Original Name',
        '+34 600 111 111',
        '11111111A',
        '1990-01-01',
        'Original obs',
        1n
      )

      mockRepository.findById.mockResolvedValueOnce(existingTenant)

      const command = new UpdateTenantCommand(
        1n,
        'New Name',
        '+34 600 222 222',
        '22222222B',
        '1991-02-02',
        'New obs'
      )

      // Act: Ejecutar update
      await handler.execute(command)

      // Assert: Verificar que findById fue llamado
      expect(mockRepository.findById).toHaveBeenCalledWith(1n)
      
      // Verificar que update fue llamado con los datos correctos
      expect(mockRepository.update).toHaveBeenCalledTimes(1)
      const [id, updatedTenant] = mockRepository.update.mock.calls[0]
      expect(id).toBe(1n)
      expect(updatedTenant.name).toBe('New Name')
      expect(updatedTenant.phone).toBe('+34 600 222 222')
      expect(updatedTenant.dni).toBe('22222222B')
      expect(updatedTenant.birthdate).toBe('1991-02-02')
      expect(updatedTenant.observations).toBe('New obs')
    })

    it('should update only some fields and preserve others', async () => {
      const existingTenant = Tenant.reconstitute(
        1n,
        'Juan López',
        '+34 600 111 111',
        '11111111A',
        '1990-01-01'
      )

      mockRepository.findById.mockResolvedValueOnce(existingTenant)

      const command = new UpdateTenantCommand(
        1n,
        'Juan García',
        undefined,
        undefined,
        undefined,
        undefined
      )

      await handler.execute(command)

      const [, updatedTenant] = mockRepository.update.mock.calls[0]
      expect(updatedTenant.name).toBe('Juan García')
      expect(updatedTenant.phone).toBe('+34 600 111 111') // Se preserva
      expect(updatedTenant.dni).toBe('11111111A') // Se preserva
      expect(updatedTenant.birthdate).toBe('1990-01-01') // Se preserva
    })

    it('should throw TenantNotFoundexception when tenant does not exist', async () => {
      mockRepository.findById.mockResolvedValueOnce(null)

      const command = new UpdateTenantCommand(999n, 'New Name')

      await expect(handler.execute(command)).rejects.toThrow(TenantNotFoundexception)
      expect(mockRepository.update).not.toHaveBeenCalled()
    })

    it('should preserve tenant id during update', async () => {
      const existingTenant = Tenant.reconstitute(
        123n,
        'Juan López',
        '+34 600 111 111',
        '11111111A',
        '1990-01-01'
      )

      mockRepository.findById.mockResolvedValueOnce(existingTenant)

      const command = new UpdateTenantCommand(123n, 'New Name')

      await handler.execute(command)

      const [id, updatedTenant] = mockRepository.update.mock.calls[0]
      expect(id).toBe(123n)
      expect(updatedTenant.id).toBe(123n)
    })

    it('should handle partial update with only one field', async () => {
      const existingTenant = Tenant.reconstitute(
        1n,
        'Juan López',
        '+34 600 111 111',
        '11111111A',
        '1990-01-01',
        'Important obs'
      )

      mockRepository.findById.mockResolvedValueOnce(existingTenant)

      const command = new UpdateTenantCommand(1n, undefined, '+34 600 999 999')

      await handler.execute(command)

      const [, updatedTenant] = mockRepository.update.mock.calls[0]
      expect(updatedTenant.phone).toBe('+34 600 999 999')
      expect(updatedTenant.name).toBe('Juan López')
      expect(updatedTenant.observations).toBe('Important obs')
    })

    it('should throw error if repository update fails', async () => {
      const existingTenant = Tenant.reconstitute(
        1n,
        'Juan López',
        '+34 600 111 111',
        '11111111A',
        '1990-01-01'
      )

      mockRepository.findById.mockResolvedValueOnce(existingTenant)
      mockRepository.update.mockRejectedValueOnce(new Error('Database error'))

      const command = new UpdateTenantCommand(1n, 'New Name')

      await expect(handler.execute(command)).rejects.toThrow('Database error')
    })
  })
})
