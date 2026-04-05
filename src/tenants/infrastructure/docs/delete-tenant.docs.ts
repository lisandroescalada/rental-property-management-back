import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function DeleteTenantDocs() {
    return applyDecorators(
        ApiOperation({ 
            summary: 'Delete a tenant'
        }),
        ApiParam({
            name: 'id',
            type: Number, example: 1
        }),
        ApiResponse({
            status: 204,
            description: 'tenant deleted successfully'
        }),
        ApiResponse({
            status: 404,
            description: 'tenant not found'
        })
    )
}