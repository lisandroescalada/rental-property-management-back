import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { TenantResponseDto } from '../dto/tenant-response.dto';

export function FindByIdTenantDocs() {
    return applyDecorators(
        ApiOperation({
            summary: 'Get a tenant by ID'
        }),
        ApiParam({
            name: 'id',
            type: Number,
            example: 1
        }),
        ApiResponse({
            status: 200,
            description: 'Tenant found',
            type: TenantResponseDto
        }),
        ApiResponse({
            status: 400,
            description: 'Invalid ID (must be a positive integer)'
        }),
        ApiResponse({
            status: 404,
            description: 'Tenant not found'
        })
    );
}
