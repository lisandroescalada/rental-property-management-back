import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Server health check' })
  @ApiOkResponse({ description: 'The server is working correctly.' })
  checkHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Rental Property Management Backend is running',
    };
  }
}

