import { Test, TestingModule } from '@nestjs/testing'
import { TenantsController } from './tenants.controller'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { CreateTenantCommand } from '../../application/commands/create-tenant/create-tenant.command'
import { UpdateTenantCommand } from '../../application/commands/update-tenant/update-tenant.command'
import { DeleteTenantCommand } from '../../application/commands/delete-tenant/delete-tenant.command'
import { FindAllTenantsQuery } from '../../application/queries/find-all-tenant/find-all.tenants.query'
import { FindByIdTenantQuery } from '../../application/queries/find-by-id-tenant/find-by-id.tenant.query'
import { CreateTenantDto } from '../dto/create-tenant.dto'
import { UpdateTenantDto } from '../dto/update-tenant.dto'
import { TenantResponseDto } from '../dto/tenant-response.dto'
import { PaginatedResponseDto } from '../dto/paginated-response.dto'

/**
 * TESTS UNITARIOS PARA TENANTS CONTROLLER
 * 
 * El Controller:
 * - Recibe solicitudes HTTP
 * - Transforma DTOs a Comandos/Queries
 * - Delega al CommandBus/QueryBus
 * - Retorna respuestas HTTP
 * - NO contiene lógica de negocio
 */
describe('TenantsController', () => {
  
  let controller: TenantsController
  let commandBus: jest.Mocked<CommandBus>
  let queryBus: jest.Mocked<QueryBus>

  beforeEach(async () => {
    // Arrange: Preparar mocks de CommandBus y QueryBus
    const mockCommandBus = {
      execute: jest.fn()
    }

    const mockQueryBus = {
      execute: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantsController],
      providers: [
        {
          provide: CommandBus,
          useValue: mockCommandBus
        },
        {
          provide: QueryBus,
          useValue: mockQueryBus
        }
      ]
    }).compile()

    controller = module.get<TenantsController>(TenantsController)
    commandBus = module.get(CommandBus) as jest.Mocked<CommandBus>
    queryBus = module.get(QueryBus) as jest.Mocked<QueryBus>
  })

  // ─── CREATE ENDPOINT ──────────────────────────────────────────────────────────
  describe('POST /tenants - create()', () => {
    
    it('should create a new tenant', async () => {
      // Arrange: Preparar DTO
      const createTenantDto: CreateTenantDto = {
        name: 'Juan López',
        phone: '+34 600 123 456',
        dni: '12345678A',
        birthdate: '1990-01-15',
        observations: 'Cliente VIP'
      }

      commandBus.execute.mockResolvedValueOnce(undefined)

      // Act: Llamar al controller
      await controller.create(createTenantDto)

      // Assert: Verificar que se envió el comando correcto
      expect(commandBus.execute).toHaveBeenCalledTimes(1)
      const executedCommand = commandBus.execute.mock.calls[0][0] as CreateTenantCommand
      expect(executedCommand).toBeInstanceOf(CreateTenantCommand)
      expect(executedCommand.name).toBe(createTenantDto.name)
      expect(executedCommand.phone).toBe(createTenantDto.phone)
      expect(executedCommand.dni).toBe(createTenantDto.dni)
      expect(executedCommand.birthdate).toBe(createTenantDto.birthdate)
      expect(executedCommand.observations).toBe(createTenantDto.observations)
    })

    it('should handle create without optional fields', async () => {
      const createTenantDto: CreateTenantDto = {
        name: 'María García',
        phone: '+34 600 987 654',
        dni: '87654321B',
        birthdate: '1985-05-20'
      }

      commandBus.execute.mockResolvedValueOnce(undefined)

      await controller.create(createTenantDto)

      const executedCommand = commandBus.execute.mock.calls[0][0] as CreateTenantCommand
      expect(executedCommand.observations).toBeUndefined()
    })

    it('should propagate command execution errors', async () => {
      const createTenantDto: CreateTenantDto = {
        name: 'Juan López',
        phone: '+34 600 123 456',
        dni: '12345678A',
        birthdate: '1990-01-15'
      }

      commandBus.execute.mockRejectedValueOnce(new Error('Validation failed'))

      await expect(controller.create(createTenantDto)).rejects.toThrow('Validation failed')
    })
  })

  // ─── FIND ALL ENDPOINT ────────────────────────────────────────────────────────
  describe('GET /tenants - findAll()', () => {
    
    it('should find all tenants with default pagination', async () => {
      // Arrange: Preparar respuesta
      const responseDto: PaginatedResponseDto<TenantResponseDto> = {
        data: [
          {
            id: '1',
            name: 'Juan López',
            phone: '+34 600 123 456',
            dni: '12345678A',
            birthdate: '1990-01-15',
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      }

      queryBus.execute.mockResolvedValueOnce(responseDto)

      const pagination = { page: 1, limit: 10 }

      // Act: Llamar al controller
      const result = await controller.findAll(pagination)

      // Assert: Verificar resultado
      expect(result).toEqual(responseDto)
      expect(queryBus.execute).toHaveBeenCalledTimes(1)
      const executedQuery = queryBus.execute.mock.calls[0][0] as FindAllTenantsQuery
      expect(executedQuery).toBeInstanceOf(FindAllTenantsQuery)
      expect(executedQuery.page).toBe(1)
      expect(executedQuery.limit).toBe(10)
    })

    it('should find all tenants with custom pagination', async () => {
      const responseDto: PaginatedResponseDto<TenantResponseDto> = {
        data: [],
        total: 0,
        page: 3,
        limit: 20,
        totalPages: 0
      }

      queryBus.execute.mockResolvedValueOnce(responseDto)

      const pagination = { page: 3, limit: 20 }

      await controller.findAll(pagination)

      const executedQuery = queryBus.execute.mock.calls[0][0] as FindAllTenantsQuery
      expect(executedQuery.page).toBe(3)
      expect(executedQuery.limit).toBe(20)
    })

    it('should return empty list when no tenants exist', async () => {
      const responseDto: PaginatedResponseDto<TenantResponseDto> = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      }

      queryBus.execute.mockResolvedValueOnce(responseDto)

      const result = await controller.findAll({ page: 1, limit: 10 })

      expect(result.data).toHaveLength(0)
      expect(result.total).toBe(0)
    })

    it('should propagate query execution errors', async () => {
      queryBus.execute.mockRejectedValueOnce(new Error('Database error'))

      await expect(controller.findAll({ page: 1, limit: 10 })).rejects.toThrow('Database error')
    })
  })

  // ─── FIND BY ID ENDPOINT ──────────────────────────────────────────────────────
  describe('GET /tenants/:id - findById()', () => {
    
    it('should find tenant by id', async () => {
      // Arrange: Preparar respuesta
      const responseDto: TenantResponseDto = {
        id: '1',
        name: 'Juan López',
        phone: '+34 600 123 456',
        dni: '12345678A',
        birthdate: '1990-01-15',
        observations: 'VIP',
        userId: '1',
        created_at: new Date(),
        updated_at: new Date()
      }

      queryBus.execute.mockResolvedValueOnce(responseDto)

      // Act: Llamar al controller (ParseIntPipe convierte string 1 a number)
      const result = await controller.findById(1 as any)

      // Assert: Verificar resultado
      expect(result).toEqual(responseDto)
      expect(queryBus.execute).toHaveBeenCalledTimes(1)
      const executedQuery = queryBus.execute.mock.calls[0][0] as FindByIdTenantQuery
      expect(executedQuery).toBeInstanceOf(FindByIdTenantQuery)
      expect(executedQuery.tenantId).toBe(1n)
    })

    it('should convert number id to bigint', async () => {
      const responseDto: TenantResponseDto = {
        id: '999',
        name: 'Test',
        phone: '+34 600 000 000',
        dni: '00000000A',
        birthdate: '1990-01-01',
        created_at: new Date(),
        updated_at: new Date()
      }

      queryBus.execute.mockResolvedValueOnce(responseDto)

      await controller.findById(999)

      const executedQuery = queryBus.execute.mock.calls[0][0] as FindByIdTenantQuery
      expect(executedQuery.tenantId).toBe(999n)
    })

    it('should propagate query execution errors (tenant not found)', async () => {
      queryBus.execute.mockRejectedValueOnce(new Error('Tenant not found'))

      await expect(controller.findById(999)).rejects.toThrow('Tenant not found')
    })

    it('should handle large tenant ids', async () => {
      const largeId = Number.MAX_SAFE_INTEGER

      const responseDto: TenantResponseDto = {
        id: largeId.toString(),
        name: 'Test',
        phone: '+34 600 000 000',
        dni: '00000000A',
        birthdate: '1990-01-01',
        created_at: new Date(),
        updated_at: new Date()
      }

      queryBus.execute.mockResolvedValueOnce(responseDto)

      await controller.findById(largeId)

      const executedQuery = queryBus.execute.mock.calls[0][0] as FindByIdTenantQuery
      expect(executedQuery.tenantId).toBe(BigInt(largeId))
    })
  })

  // ─── UPDATE ENDPOINT ──────────────────────────────────────────────────────────
  describe('PATCH /tenants/:id - update()', () => {
    
    it('should update a tenant', async () => {
      // Arrange: Preparar DTO
      const updateTenantDto: UpdateTenantDto = {
        name: 'Juan García',
        phone: '+34 600 222 222'
      }

      commandBus.execute.mockResolvedValueOnce(undefined)

      // Act: Llamar al controller
      await controller.update(1, updateTenantDto)

      // Assert: Verificar comando
      expect(commandBus.execute).toHaveBeenCalledTimes(1)
      const executedCommand = commandBus.execute.mock.calls[0][0] as UpdateTenantCommand
      expect(executedCommand).toBeInstanceOf(UpdateTenantCommand)
      expect(executedCommand.id).toBe(1n)
      expect(executedCommand.name).toBe(updateTenantDto.name)
      expect(executedCommand.phone).toBe(updateTenantDto.phone)
    })

    it('should handle partial update', async () => {
      const updateTenantDto: UpdateTenantDto = {
        name: 'Updated Name'
      }

      commandBus.execute.mockResolvedValueOnce(undefined)

      await controller.update(1, updateTenantDto)

      const executedCommand = commandBus.execute.mock.calls[0][0] as UpdateTenantCommand
      expect(executedCommand.name).toBe('Updated Name')
      expect(executedCommand.phone).toBeUndefined()
      expect(executedCommand.dni).toBeUndefined()
    })

    it('should convert number id to bigint', async () => {
      const updateTenantDto: UpdateTenantDto = {}

      commandBus.execute.mockResolvedValueOnce(undefined)

      await controller.update(999, updateTenantDto)

      const executedCommand = commandBus.execute.mock.calls[0][0] as UpdateTenantCommand
      expect(executedCommand.id).toBe(999n)
    })

    it('should propagate command execution errors', async () => {
      const updateTenantDto: UpdateTenantDto = {
        name: 'Updated'
      }

      commandBus.execute.mockRejectedValueOnce(new Error('Tenant not found'))

      await expect(controller.update(1, updateTenantDto)).rejects.toThrow('Tenant not found')
    })

    it('should log error and rethrow', async () => {
      const updateTenantDto: UpdateTenantDto = {}
      const error = new Error('Update failed')

      commandBus.execute.mockRejectedValueOnce(error)

      await expect(controller.update(1, updateTenantDto)).rejects.toThrow('Update failed')
    })
  })

  // ─── DELETE ENDPOINT ──────────────────────────────────────────────────────────
  describe('DELETE /tenants/:id - remove()', () => {
    
    it('should delete a tenant', async () => {
      // Arrange
      commandBus.execute.mockResolvedValueOnce(undefined)

      // Act: Llamar al controller
      await controller.remove(1)

      // Assert: Verificar comando
      expect(commandBus.execute).toHaveBeenCalledTimes(1)
      const executedCommand = commandBus.execute.mock.calls[0][0] as DeleteTenantCommand
      expect(executedCommand).toBeInstanceOf(DeleteTenantCommand)
      expect(executedCommand.id).toBe(1n)
    })

    it('should convert number id to bigint', async () => {
      commandBus.execute.mockResolvedValueOnce(undefined)

      await controller.remove(999)

      const executedCommand = commandBus.execute.mock.calls[0][0] as DeleteTenantCommand
      expect(executedCommand.id).toBe(999n)
    })

    it('should propagate command execution errors', async () => {
      commandBus.execute.mockRejectedValueOnce(new Error('Tenant not found'))

      await expect(controller.remove(999)).rejects.toThrow('Tenant not found')
    })

    it('should delete with correct id', async () => {
      commandBus.execute.mockResolvedValueOnce(undefined)

      await controller.remove(123)

      const executedCommand = commandBus.execute.mock.calls[0][0] as DeleteTenantCommand
      expect(executedCommand.id).toBe(123n)
    })
  })

  // ─── ERROR HANDLING ───────────────────────────────────────────────────────────
  describe('Error handling', () => {
    
    it('should use correct bus for commands', async () => {
      const dto: CreateTenantDto = {
        name: 'Test',
        phone: '+34 600 000 000',
        dni: '00000000A',
        birthdate: '1990-01-01'
      }

      commandBus.execute.mockResolvedValueOnce(undefined)

      await controller.create(dto)

      expect(commandBus.execute).toHaveBeenCalled()
      expect(queryBus.execute).not.toHaveBeenCalled()
    })

    it('should use correct bus for queries', async () => {
      const responseDto: PaginatedResponseDto<TenantResponseDto> = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      }

      queryBus.execute.mockResolvedValueOnce(responseDto)

      await controller.findAll({ page: 1, limit: 10 })

      expect(queryBus.execute).toHaveBeenCalled()
      expect(commandBus.execute).not.toHaveBeenCalled()
    })
  })
})
