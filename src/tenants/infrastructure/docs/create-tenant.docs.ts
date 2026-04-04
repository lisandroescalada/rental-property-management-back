import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function CreateTenantDocs() {
    return applyDecorators(
        ApiOperation({
            summary: 'Create a new tenant'
        }),
        ApiResponse({
            status: 201,
            description: 'tenant created successfully'
        }),
        ApiResponse({
            status: 400,
            description: 'Invalid input data'
        }),
        ApiResponse({
            status: 409,
            description: 'DNI already registered'
        })
    )
}
