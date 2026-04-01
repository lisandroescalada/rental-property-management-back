import { Inject } from "@nestjs/common"
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindByIdTenantQuery } from "./find-by-id.tenant.query"
import { TenantResponseDto } from "src/tenants/infrastructure/dto/tenant-response.dto"
import { TenantAssembler } from "src/tenants/infrastructure/assemblers/tenant.assembler"
import { TenantNotFoundError } from "src/tenants/domain/excepcions/tenant-not-found.exception"
import { TENANT_REPOSITORY_TOKEN, TenantRepository } from "src/tenants/domain/repositories/tenant.repository"

@QueryHandler(FindByIdTenantQuery)
export class FindByIdTenantHandler implements IQueryHandler<FindByIdTenantQuery, TenantResponseDto> {
    constructor(
        @Inject(TENANT_REPOSITORY_TOKEN)
        private readonly tenantRepository: TenantRepository
    ) {}

    async execute(query: FindByIdTenantQuery): Promise<TenantResponseDto> {
        const tenant = await this.tenantRepository.findById(query.tenantId)
        if (!tenant) throw new TenantNotFoundError(query.tenantId)
        return TenantAssembler.toDto(tenant)
    }
}
