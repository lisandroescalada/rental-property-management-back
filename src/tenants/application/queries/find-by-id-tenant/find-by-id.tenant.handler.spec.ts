import { FindByIdTenantQuery } from './find-by-id.tenant.query'
import { FindByIdTenantHandler } from './find-by-id.tenant.handler'
import { Tenant } from '../../../domain/entities/tenant.entity'
import { TenantRepository } from '../../../domain/repositories/tenant.repository'
import { TenantNotFoundexception } from '../../../domain/excepcions/tenant-not-found.exception'
import { TenantAssembler } from '../../../infrastructure/assemblers/tenant.assembler'

/**
 * TESTS UNITARIOS PARA FIND BY ID TENANT QUERY
 */
describe('FindByIdTenantHandler', () => {
  
  let handler: FindByIdTenantHandler
  let mockRepository: jest.Mocked<TenantRepository>

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    } as any

    handler = new FindByIdTenantHandler(mockRepository)
  })

  describe('execute()', () => {
    
    it('should return tenant by id', async () => {
      // Arrange: Preparar tenant y mock
      const tenant = Tenant.reconstitute(
        1n,
        'Juan López',
        '+34 600 123 456',
        '12345678A',
        '1990-01-15',
        'Cliente VIP',
        1n
      )

      mockRepository.findById.mockResolvedValueOnce(tenant)

      const query = new FindByIdTenantQuery(1n)

      // Act: Ejecutar query
      const result = await handler.execute(query)

      // Assert: Verificar resultado
      expect(mockRepository.findById).toHaveBeenCalledWith(1n)
      expect(result).toBeDefined()
      expect(result.id).toBe('1')
      expect(result.name).toBe('Juan López')
      expect(result.phone).toBe('+34 600 123 456')
      expect(result.dni).toBe('12345678A')
      expect(result.birthdate).toBe('1990-01-15')
      expect(result.observations).toBe('Cliente VIP')
      expect(result.userId).toBe('1')
    })

    it('should throw TenantNotFoundexception when tenant does not exist', async () => {
      mockRepository.findById.mockResolvedValueOnce(null)

      const query = new FindByIdTenantQuery(999n)

      await expect(handler.execute(query)).rejects.toThrow(TenantNotFoundexception)
    })

    it('should convert bigint ids to string in DTO', async () => {
      const tenant = Tenant.reconstitute(
        123n,
        'Test Tenant',
        '+34 600 000 000',
        '00000000A',
        '1990-01-01',
        undefined,
        456n
      )

      mockRepository.findById.mockResolvedValueOnce(tenant)

      const query = new FindByIdTenantQuery(123n)

      const result = await handler.execute(query)

      expect(result.id).toBe('123')
      expect(result.userId).toBe('456')
      expect(typeof result.id).toBe('string')
      expect(typeof result.userId).toBe('string')
    })

    it('should handle tenant without optional fields', async () => {
      const tenant = Tenant.reconstitute(
        1n,
        'Juan López',
        '+34 600 123 456',
        '12345678A',
        '1990-01-15'
      )

      mockRepository.findById.mockResolvedValueOnce(tenant)

      const query = new FindByIdTenantQuery(1n)

      const result = await handler.execute(query)

      expect(result.observations).toBeUndefined()
      expect(result.userId).toBeUndefined()
    })

    it('should handle tenant with timestamps', async () => {
      const createdAt = new Date('2024-01-01T10:00:00Z')
      const updatedAt = new Date('2024-02-15T15:30:00Z')

      const tenant = Tenant.reconstitute(
        1n,
        'Juan López',
        '+34 600 123 456',
        '12345678A',
        '1990-01-15',
        undefined,
        undefined,
        createdAt,
        updatedAt
      )

      mockRepository.findById.mockResolvedValueOnce(tenant)

      const query = new FindByIdTenantQuery(1n)

      const result = await handler.execute(query)

      expect(result.created_at).toBe(createdAt)
      expect(result.updated_at).toBe(updatedAt)
    })

    it('should call repository with exact tenant id', async () => {
      const tenant = Tenant.reconstitute(
        999n,
        'Test',
        '+34 600 000 000',
        '00000000A',
        '1990-01-01'
      )

      mockRepository.findById.mockResolvedValueOnce(tenant)

      const query = new FindByIdTenantQuery(999n)

      await handler.execute(query)

      expect(mockRepository.findById).toHaveBeenCalledWith(999n)
      expect(mockRepository.findById).toHaveBeenCalledTimes(1)
    })

    it('should throw error if repository fails', async () => {
      mockRepository.findById.mockRejectedValueOnce(new Error('Database connection failed'))

      const query = new FindByIdTenantQuery(1n)

      await expect(handler.execute(query)).rejects.toThrow('Database connection failed')
    })

    it('should assemble tenant to DTO correctly', async () => {
      const tenant = Tenant.reconstitute(
        1n,
        'Juan López',
        '+34 600 123 456',
        '12345678A',
        '1990-01-15',
        'VIP Client',
        2n
      )

      mockRepository.findById.mockResolvedValueOnce(tenant)

      const query = new FindByIdTenantQuery(1n)
      const result = await handler.execute(query)

      // Verificar que el assembler transformó correctamente
      const expectedDto = TenantAssembler.toDto(tenant)
      expect(result).toEqual(expectedDto)
    })

    it('should handle very large tenant ids', async () => {
      const largeId = BigInt('9223372036854775807') // Max int64

      const tenant = Tenant.reconstitute(
        largeId,
        'Test',
        '+34 600 000 000',
        '00000000A',
        '1990-01-01'
      )

      mockRepository.findById.mockResolvedValueOnce(tenant)

      const query = new FindByIdTenantQuery(largeId)

      const result = await handler.execute(query)

      expect(result.id).toBe(largeId.toString())
    })
  })
})
