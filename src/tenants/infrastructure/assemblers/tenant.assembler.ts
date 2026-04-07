import { TenantResponseDto } from '../dto/tenant-response.dto'
import { Tenant } from 'src/tenants/domain/entities/tenant.entity'
import { PaginatedResponseDto } from '../dto/paginated-response.dto'

export class TenantAssembler {
    static toDto(tenant: Tenant): TenantResponseDto {
        const dto = new TenantResponseDto()

        dto.name = tenant.name.value
        dto.id = tenant.id.toString()
        dto.phone = tenant.phone.value
        dto.dni = tenant.dni.value
        dto.birthdate = tenant.birthdate.value
        dto.observations = tenant.observations?.value ?? undefined
        dto.userId = tenant.userId?.toString() ?? undefined
        dto.created_at = tenant.created_at
        dto.updated_at= tenant.updated_at

        return dto
    }

    static toPaginatedDto(
        tenants: Tenant[],
        total: number,
        page: number,
        limit: number
    ): PaginatedResponseDto<TenantResponseDto> {
        const dto = new PaginatedResponseDto<TenantResponseDto>()

        dto.data = tenants.map(TenantAssembler.toDto)
        dto.total = total
        dto.page = page
        dto.limit = limit
        dto.totalPages = Math.ceil(total / limit)
        
        return dto
    }
}
