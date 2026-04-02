import {
    Get,
    Post,
    Body,
    Query,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
    Controller,
    ParseIntPipe
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { CreateTenantDto } from '../dto/create-tenant.dto'
import { UpdateTenantDto } from '../dto/update-tenant.dto'
import { TenantResponseDto } from '../dto/tenant-response.dto'
import { PaginationQueryDto } from '../dto/pagination-query.dto'
import { PaginatedResponseDto } from '../dto/paginated-response.dto'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateTenantCommand } from 'src/tenants/application/commands/create-tenant/create-tenant.command'
import { UpdateTenantCommand } from 'src/tenants/application/commands/update-tenant/update-tenant.command'
import { DeleteTenantCommand } from 'src/tenants/application/commands/delete-tenant/delete-tenant.command'
import { FindAllTenantsQuery } from 'src/tenants/application/queries/find-all-tenant/find-all.tenants.query'
import { FindByIdTenantQuery } from 'src/tenants/application/queries/find-by-id-tenant/find-by-id.tenant.query'

@ApiTags('Tenants')
@Controller('tenants')
export class TenantsController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus
    ) {}

    // ─── GET /tenants ────────────────────────────────────────────────────────────
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'List all tenants (paginated)'
    })
    @ApiResponse({
        status: 200,
        description: 'List of tenants',
        type: PaginatedResponseDto
    })
    findAll(@Query() pagination: PaginationQueryDto): Promise<PaginatedResponseDto<TenantResponseDto>> {
        return this.queryBus.execute(
            new FindAllTenantsQuery(pagination.page, pagination.limit)
        )
    }

    // ─── GET /tenants/:id ────────────────────────────────────────────────────────
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get a tenant by ID'
    })
    @ApiParam({
        name: 'id',
        type: Number, example: 1
    })
    @ApiResponse({
        status: 200,
        description: 'Tenant found',
        type: TenantResponseDto
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid ID (must be a positive integer)'
    })
    @ApiResponse({
        status: 404,
        description: 'Tenant not found'
    })
    findById(@Param('id', ParseIntPipe) id: number): Promise<TenantResponseDto> {
        return this.queryBus.execute(
            new FindByIdTenantQuery(BigInt(id))
        )
    }

    // ─── POST /tenants ───────────────────────────────────────────────────────────
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create a new tenant'
    })
    @ApiResponse({
        status: 201,
        description: 'tenant created successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid input data'
    })
    @ApiResponse({
        status: 409,
        description: 'DNI already registered'
    })
    create(@Body() dto: CreateTenantDto): Promise<void> {
        return this.commandBus.execute(
            new CreateTenantCommand(
                dto.name,
                dto.phone,
                dto.dni,
                dto.birthdate ,
                dto.observations ?? undefined,
                dto.userId ?? undefined
            )
        )
    }

    // ─── PATCH /tenants/:id ──────────────────────────────────────────────────────
    @Patch(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Partially update a tenant'
    })
    @ApiParam({
        name: 'id',
        type: Number, example: 1
    })
    @ApiResponse({
        status: 204,
        description: 'Tenant updated successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid input data'
    })
    @ApiResponse({
        status: 404,
        description: 'Tenant not found'
    })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateTenantDto
    ): Promise<void> {
        return this.commandBus.execute(
            new UpdateTenantCommand(
                BigInt(id),
                dto.name,
                dto.phone,
                dto.dni,
                dto.birthdate,
                dto.observations
            )
        )
    }

    // ─── DELETE /tenants/:id ─────────────────────────────────────────────────────
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ 
        summary: 'Delete a tenant'
    })
    @ApiParam({
        name: 'id',
        type: Number, example: 1
    })
    @ApiResponse({
        status: 204,
        description: 'tenant deleted successfully'
    })
    @ApiResponse({
        status: 404,
        description: 'tenant not found'
    })
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.commandBus.execute(
            new DeleteTenantCommand(BigInt(id))
        )
    }
}
