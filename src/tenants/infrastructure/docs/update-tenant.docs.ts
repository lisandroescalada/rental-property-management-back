import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'

export function UpdateTenantDocs() {
    return applyDecorators(
        ApiOperation({ summary: 'Partially update a tenant' }),
        ApiParam({ name: 'id', type: Number, example: 1 }),
        ApiResponse({ status: 204, description: 'Tenant updated successfully' }),
        ApiResponse({ status: 400, description: 'Invalid input data' }),
        ApiResponse({ status: 404, description: 'Tenant not found' })
    )
}
