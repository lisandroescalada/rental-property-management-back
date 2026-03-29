import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FindByIdUserQuery } from 'src/users/application/queries/find-by-id-user/find-by-id.user.query'
import { FindAllUsersQuery } from 'src/users/application/queries/find-all-users/find-all.users.query'
import { CreateUserCommand } from 'src/users/application/commands/create-user/create-user.command'
import { UpdateUserCommand } from 'src/users/application/commands/update-user/update-user.command'
import { DeleteUserCommand } from 'src/users/application/commands/delete-user/delete-user.command'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { PaginationQueryDto } from '../dto/pagination-query.dto'
import { UserResponseDto } from '../dto/user-response.dto'
import { PaginatedResponseDto } from '../dto/paginated-response.dto'

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    // ─── GET /users ────────────────────────────────────────────────────────────
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'List all users (paginated)' })
    @ApiResponse({ status: 200, description: 'List of users', type: PaginatedResponseDto })
    findAll(@Query() pagination: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>> {
        return this.queryBus.execute(
            new FindAllUsersQuery(pagination.page, pagination.limit),
        )
    }

    // ─── GET /users/:id ────────────────────────────────────────────────────────
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get a user by ID' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'User found', type: UserResponseDto })
    @ApiResponse({ status: 400, description: 'Invalid ID (must be a positive integer)' })
    @ApiResponse({ status: 404, description: 'User not found' })
    findById(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
        return this.queryBus.execute(
            new FindByIdUserQuery(BigInt(id)),
        )
    }

    // ─── POST /users ───────────────────────────────────────────────────────────
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 409, description: 'Email already registered' })
    create(@Body() dto: CreateUserDto): Promise<void> {
        return this.commandBus.execute(
            new CreateUserCommand(
                dto.name,
                dto.email,
                dto.password,
                dto.provider,
                dto.receive_notifications,
            ),
        )
    }

    // ─── PATCH /users/:id ──────────────────────────────────────────────────────
    @Patch(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Partially update a user' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 204, description: 'User updated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 404, description: 'User not found' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateUserDto,
    ): Promise<void> {
        return this.commandBus.execute(
            new UpdateUserCommand(BigInt(id), dto.name, dto.email, dto.receive_notifications),
        )
    }

    // ─── DELETE /users/:id ─────────────────────────────────────────────────────
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a user' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 204, description: 'User deleted successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.commandBus.execute(
            new DeleteUserCommand(BigInt(id)),
        )
    }
}
