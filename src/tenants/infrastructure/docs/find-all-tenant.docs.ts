import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';

export function FindAllTenantDocs() {
    return applyDecorators(
        ApiOperation({
            summary: 'List all tenants (paginated)'
        }),
        ApiResponse({
            status: 200,
            description: 'List of tenants',
            type: PaginatedResponseDto
        })
    )
}
