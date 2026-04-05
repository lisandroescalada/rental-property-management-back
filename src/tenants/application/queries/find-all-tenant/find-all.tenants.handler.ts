import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { FindAllTenantsQuery } from './find-all.tenants.query'
import { TenantResponseDto } from 'src/tenants/infrastructure/dto/tenant-response.dto'
import { TenantAssembler } from 'src/tenants/infrastructure/assemblers/tenant.assembler'
import { PaginatedResponseDto } from 'src/tenants/infrastructure/dto/paginated-response.dto'
import { TENANT_REPOSITORY_TOKEN, TenantRepository } from 'src/tenants/domain/repositories/tenant.repository'

@QueryHandler(FindAllTenantsQuery)
export class FindAllTenantsHandler implements IQueryHandler<FindAllTenantsQuery, PaginatedResponseDto<TenantResponseDto>> {
    constructor(
        @Inject(TENANT_REPOSITORY_TOKEN)
        private readonly tenantRepository: TenantRepository
    ) {}

    async execute(query: FindAllTenantsQuery): Promise<PaginatedResponseDto<TenantResponseDto>> {
        const [tenants, total] = await Promise.all([
            this.tenantRepository.findAll({ page: query.page, limit: query.limit }),
            this.tenantRepository.count()
        ])
        return TenantAssembler.toPaginatedDto(tenants, total, query.page, query.limit)
    }
}
