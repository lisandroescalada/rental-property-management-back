import { Query } from '@nestjs/cqrs'
import { TenantResponseDto } from 'src/tenants/infrastructure/dto/tenant-response.dto'

export class FindByIdTenantQuery extends Query<TenantResponseDto> {
    constructor(
        public readonly tenantId: bigint
    ) {
        super()
    }
}
