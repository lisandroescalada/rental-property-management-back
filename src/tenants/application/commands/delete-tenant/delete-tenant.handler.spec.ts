import { DeleteTenantCommand } from './delete-tenant.command'
import { DeleteTenantHandler } from './delete-tenant.handler'
import { Tenant } from '../../../domain/entities/tenant.entity'
import { TenantRepository } from '../../../domain/repositories/tenant.repository'
import { TenantNotFoundexception } from '../../../domain/excepcions/tenant-not-found.exception'

/**
 * TESTS UNITARIOS PARA DELETE TENANT COMMAND
 */
describe('DeleteTenantHandler', () => {
  
  let handler: DeleteTenantHandler
  let mockRepository: jest.Mocked<TenantRepository>

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn().mockResolvedValue(undefined),
      count: jest.fn()
    } as any

    handler = new DeleteTenantHandler(mockRepository)
  })

  describe('execute()', () => {
    
    it('should delete an existing tenant', async () => {
      // Arrange: Preparar tenant existente
      const existingTenant = Tenant.reconstitute(
        1n,
        'Juan López',
        '+34 600 123 456',
        '12345678A',
        '1990-01-15'
      )

      mockRepository.findById.mockResolvedValueOnce(existingTenant)

      const command = new DeleteTenantCommand(1n)

      // Act: Ejecutar delete
      await handler.execute(command)

      // Assert: Verificar que findById y delete fueron llamados
      expect(mockRepository.findById).toHaveBeenCalledWith(1n)
      expect(mockRepository.delete).toHaveBeenCalledWith(1n)
      expect(mockRepository.delete).toHaveBeenCalledTimes(1)
    })

    it('should throw TenantNotFoundexception when tenant does not exist', async () => {
      mockRepository.findById.mockResolvedValueOnce(null)

      const command = new DeleteTenantCommand(999n)

      await expect(handler.execute(command)).rejects.toThrow(TenantNotFoundexception)
      expect(mockRepository.delete).not.toHaveBeenCalled()
    })

    it('should verify tenant exists before deletion', async () => {
      mockRepository.findById.mockResolvedValueOnce(null)

      const command = new DeleteTenantCommand(1n)

      try {
        await handler.execute(command)
      } catch (e) {
        // Error esperado
      }

      // El orden de llamadas debe ser: primero findById, nunca delete
      expect(mockRepository.findById).toHaveBeenCalled()
      expect(mockRepository.delete).not.toHaveBeenCalled()
    })

    it('should delete with correct tenant id', async () => {
      const existingTenant = Tenant.reconstitute(
        123n,
        'Test Tenant',
        '+34 600 000 000',
        '00000000A',
        '1990-01-01'
      )

      mockRepository.findById.mockResolvedValueOnce(existingTenant)

      const command = new DeleteTenantCommand(123n)

      await handler.execute(command)

      expect(mockRepository.delete).toHaveBeenCalledWith(123n)
    })

    it('should throw error if repository delete fails', async () => {
      const existingTenant = Tenant.reconstitute(
        1n,
        'Juan López',
        '+34 600 123 456',
        '12345678A',
        '1990-01-15'
      )

      mockRepository.findById.mockResolvedValueOnce(existingTenant)
      mockRepository.delete.mockRejectedValueOnce(new Error('Database constraint violation'))

      const command = new DeleteTenantCommand(1n)

      await expect(handler.execute(command)).rejects.toThrow('Database constraint violation')
    })

    it('should handle deletion of multiple tenants in sequence', async () => {
      const tenant1 = Tenant.reconstitute(1n, 'Tenant 1', '+34 600 111 111', '11111111A', '1990-01-01')
      const tenant2 = Tenant.reconstitute(2n, 'Tenant 2', '+34 600 222 222', '22222222B', '1991-02-02')

      mockRepository.findById.mockResolvedValueOnce(tenant1)
      mockRepository.delete.mockResolvedValueOnce(undefined)

      await handler.execute(new DeleteTenantCommand(1n))

      mockRepository.findById.mockResolvedValueOnce(tenant2)
      mockRepository.delete.mockResolvedValueOnce(undefined)

      await handler.execute(new DeleteTenantCommand(2n))

      expect(mockRepository.delete).toHaveBeenNthCalledWith(1, 1n)
      expect(mockRepository.delete).toHaveBeenNthCalledWith(2, 2n)
      expect(mockRepository.delete).toHaveBeenCalledTimes(2)
    })
  })
})
