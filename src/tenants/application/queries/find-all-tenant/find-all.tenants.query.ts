import { Query } from '@nestjs/cqrs'
import { TenantResponseDto } from 'src/tenants/infrastructure/dto/tenant-response.dto'
import { PaginatedResponseDto } from 'src/users/infrastructure/dto/paginated-response.dto'

export class FindAllTenantsQuery extends Query<PaginatedResponseDto<TenantResponseDto>> {
    constructor(
        public readonly page: number,
        public readonly limit: number,
    ) {
        super()
    }
}
