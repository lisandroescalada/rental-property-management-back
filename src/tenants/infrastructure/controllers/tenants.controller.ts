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
import { ApiTags } from '@nestjs/swagger'
import { CommandBus, QueryBus } from '@nestjs/cqrs'

// DTOs
import { CreateTenantDto } from '../dto/create-tenant.dto'
import { UpdateTenantDto } from '../dto/update-tenant.dto'
import { TenantResponseDto } from '../dto/tenant-response.dto'
import { PaginationQueryDto } from '../dto/pagination-query.dto'
import { PaginatedResponseDto } from '../dto/paginated-response.dto'

// Docs
import { CreateTenantDocs } from '../docs/create-tenant.docs'
import { UpdateTenantDocs } from '../docs/update-tenant.docs'
import { DeleteTenantDocs } from '../docs/delete-tenant.docs'
import { FindAllTenantDocs } from '../docs/find-all-tenant.docs'
import { FindByIdTenantDocs } from '../docs/find-by-id-tenant.docs'

// Commands
import { CreateTenantCommand } from 'src/tenants/application/commands/create-tenant/create-tenant.command'
import { UpdateTenantCommand } from 'src/tenants/application/commands/update-tenant/update-tenant.command'
import { DeleteTenantCommand } from 'src/tenants/application/commands/delete-tenant/delete-tenant.command'

// Queries
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
    @FindAllTenantDocs()
    findAll(@Query() pagination: PaginationQueryDto): Promise<PaginatedResponseDto<TenantResponseDto>> {
        return this.queryBus.execute(
            new FindAllTenantsQuery(pagination.page, pagination.limit)
        )
    }

    // ─── GET /tenants/:id ────────────────────────────────────────────────────────
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @FindByIdTenantDocs()
    findById(@Param('id', ParseIntPipe) id: number): Promise<TenantResponseDto> {
        return this.queryBus.execute(
            new FindByIdTenantQuery(BigInt(id))
        )
    }

    // ─── POST /tenants ───────────────────────────────────────────────────────────
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @CreateTenantDocs()
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
    @UpdateTenantDocs()
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateTenantDto
    ): Promise<void> {
        try {
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
        catch (error) {
            // Log the error for debugging purposes
            console.error('Error updating tenant:', error)

            // Rethrow the error to be handled by NestJS's global exception filter
            throw error
        }
    }

    // ─── DELETE /tenants/:id ─────────────────────────────────────────────────────
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @DeleteTenantDocs()
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.commandBus.execute(
            new DeleteTenantCommand(BigInt(id))
        )
    }
}
