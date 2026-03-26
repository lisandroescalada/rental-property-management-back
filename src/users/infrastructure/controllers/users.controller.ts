import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { FindByIdUserDto } from '../dto/find-by-id.user.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindByIdUserQuery } from 'src/users/application/queries/find-by-id-user/find-by-id.user.query';
import { ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
    constructor(
        private commandBud: CommandBus,
        private queryBus: QueryBus
    ) {}

    @Get()
    @ApiOperation({ summary: 'Server users check' })
    checkHealth() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            message: 'Users endpoint test',
        }
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findById(@Param() findByIdDto: FindByIdUserDto) {
        return this.queryBus.execute(
            new FindByIdUserQuery(BigInt(findByIdDto.userId))
        )
    }
}
