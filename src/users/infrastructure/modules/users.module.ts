import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '../controllers/users.controller';
import { MySqlUsersRepository } from '../persistence/my-sql.users.repository';
import { UserOrmEntity } from '../persistence/user.orm-entity';
import { USER_REPOSITORY_TOKEN } from 'src/users/domain/repositories/user.repository.token';
// Queries
import { FindByIdUserHandler } from 'src/users/application/queries/find-by-id-user/find-by-id.user.handler';
import { FindAllUsersHandler } from 'src/users/application/queries/find-all-users/find-all.users.handler';
// Commands
import { CreateUserHandler } from 'src/users/application/commands/create-user/create-user.handler';
import { UpdateUserHandler } from 'src/users/application/commands/update-user/update-user.handler';
import { DeleteUserHandler } from 'src/users/application/commands/delete-user/delete-user.handler';

const QueryHandlers   = [FindByIdUserHandler, FindAllUsersHandler]
const CommandHandlers = [CreateUserHandler, UpdateUserHandler, DeleteUserHandler]

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([UserOrmEntity]),
    ],
    controllers: [UsersController],
    providers: [
        ...QueryHandlers,
        ...CommandHandlers,
        {
            provide: USER_REPOSITORY_TOKEN,
            useClass: MySqlUsersRepository,
        },
    ],
})
export class UsersModule {}
