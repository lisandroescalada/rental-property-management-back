import { FindAllTenantsQuery } from './find-all.tenants.query'
import { FindAllTenantsHandler } from './find-all.tenants.handler'
import { Tenant } from '../../../domain/entities/tenant.entity'
import { TenantRepository } from '../../../domain/repositories/tenant.repository'
import { TenantAssembler } from '../../../infrastructure/assemblers/tenant.assembler'

/**
 * TESTS UNITARIOS PARA FIND ALL TENANTS QUERY
 * 
 * Queries:
 * - Representan lectura de datos (read-only operations)
 * - No cambian el estado
 * - Retornan datos al usuario
 * - Handlers: orquestan la obtención y transformación de datos
 */
describe('FindAllTenantsHandler', () => {
  
  let handler: FindAllTenantsHandler
  let mockRepository: jest.Mocked<TenantRepository>

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn().mockResolvedValue(0)
    } as any

    handler = new FindAllTenantsHandler(mockRepository)
  })

  describe('execute()', () => {
    
    it('should return paginated list of tenants', async () => {
      // Arrange: Preparar tenants y mock
      const tenants = [
        Tenant.reconstitute(1n, 'Juan López', '+34 600 111 111', '11111111A', '1990-01-01'),
        Tenant.reconstitute(2n, 'María García', '+34 600 222 222', '22222222B', '1991-02-02'),
        Tenant.reconstitute(3n, 'Pedro Martínez', '+34 600 333 333', '33333333C', '1992-03-03')
      ]

      mockRepository.findAll.mockResolvedValueOnce(tenants)
      mockRepository.count.mockResolvedValueOnce(3)

      const query = new FindAllTenantsQuery(1, 10)

      // Act: Ejecutar query
      const result = await handler.execute(query)

      // Assert: Verificar estructura paginada
      expect(result).toBeDefined()
      expect(result.data).toHaveLength(3)
      expect(result.data[0].name).toBe('Juan López')
      expect(result.data[1].name).toBe('María García')
      expect(result.data[2].name).toBe('Pedro Martínez')
      expect(mockRepository.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 })
      expect(mockRepository.count).toHaveBeenCalled()
    })

    it('should return empty list when no tenants exist', async () => {
      mockRepository.findAll.mockResolvedValueOnce([])
      mockRepository.count.mockResolvedValueOnce(0)

      const query = new FindAllTenantsQuery(1, 10)

      const result = await handler.execute(query)

      expect(result.data).toHaveLength(0)
      expect(result.total).toBe(0)
    })

    it('should respect pagination parameters', async () => {
      const tenants = [
        Tenant.reconstitute(11n, 'Tenant 11', '+34 600 111 111', '11111111A', '1990-01-01'),
        Tenant.reconstitute(12n, 'Tenant 12', '+34 600 222 222', '22222222B', '1991-02-02')
      ]

      mockRepository.findAll.mockResolvedValueOnce(tenants)
      mockRepository.count.mockResolvedValueOnce(50)

      const query = new FindAllTenantsQuery(3, 20)

      const result = await handler.execute(query)

      // Verificar que se llama con los parámetros correctos
      expect(mockRepository.findAll).toHaveBeenCalledWith({ page: 3, limit: 20 })
      expect(result.data).toHaveLength(2)
    })

    it('should handle tenants with optional fields', async () => {
      const tenants = [
        Tenant.reconstitute(
          1n,
          'Juan López',
          '+34 600 111 111',
          '11111111A',
          '1990-01-01',
          'Cliente VIP'
        )
      ]

      mockRepository.findAll.mockResolvedValueOnce(tenants)
      mockRepository.count.mockResolvedValueOnce(1)

      const query = new FindAllTenantsQuery(1, 10)

      const result = await handler.execute(query)

      expect(result.data[0].observations).toBe('Cliente VIP')
    })

    it('should convert bigint to string in DTO', async () => {
      const tenants = [
        Tenant.reconstitute(999n, 'Test', '+34 600 000 000', '00000000A', '1990-01-01', undefined, 777n)
      ]

      mockRepository.findAll.mockResolvedValueOnce(tenants)
      mockRepository.count.mockResolvedValueOnce(1)

      const query = new FindAllTenantsQuery(1, 10)

      const result = await handler.execute(query)

      // Los bigint deben convertirse a string en el DTO
      expect(result.data[0].id).toBe('999')
      expect(result.data[0].userId).toBe('777')
      expect(typeof result.data[0].id).toBe('string')
    })

    it('should throw error if repository fails', async () => {
      mockRepository.findAll.mockRejectedValueOnce(new Error('Database connection failed'))

      const query = new FindAllTenantsQuery(1, 10)

      await expect(handler.execute(query)).rejects.toThrow('Database connection failed')
    })

    it('should fetch total count and data in parallel', async () => {
      const tenants = [
        Tenant.reconstitute(1n, 'Juan López', '+34 600 111 111', '11111111A', '1990-01-01')
      ]

      mockRepository.findAll.mockResolvedValueOnce(tenants)
      mockRepository.count.mockResolvedValueOnce(100)

      const query = new FindAllTenantsQuery(1, 10)

      await handler.execute(query)

      // Ambos métodos deben ser llamados (idealmente en paralelo)
      expect(mockRepository.findAll).toHaveBeenCalled()
      expect(mockRepository.count).toHaveBeenCalled()
    })

    it('should handle large pagination results', async () => {
      const tenants = Array.from({ length: 100 }, (_, i) => 
        Tenant.reconstitute(
          BigInt(i + 1),
          `Tenant ${i + 1}`,
          `+34 600 ${i.toString().padStart(6, '0')}`,
          `${i.toString().padStart(8, '0')}A`,
          '1990-01-01'
        )
      )

      mockRepository.findAll.mockResolvedValueOnce(tenants)
      mockRepository.count.mockResolvedValueOnce(1000)

      const query = new FindAllTenantsQuery(5, 100)

      const result = await handler.execute(query)

      expect(result.data).toHaveLength(100)
      expect(result.total).toBe(1000)
    })
  })
})
