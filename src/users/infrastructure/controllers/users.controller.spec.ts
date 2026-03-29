import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { User } from 'src/users/domain/entities/user.entity';

describe('UsersController', () => {
    let controller: UsersController;
    let queryBus: jest.Mocked<QueryBus>;
    let commandBus: jest.Mocked<CommandBus>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                { provide: CommandBus, useValue: { execute: jest.fn() } },
                { provide: QueryBus,   useValue: { execute: jest.fn() } },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        queryBus   = module.get(QueryBus);
        commandBus = module.get(CommandBus);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll()', () => {
        it('dispatches FindAllUsersQuery with the provided page and limit', async () => {
            queryBus.execute.mockResolvedValue([]);
            await controller.findAll({ page: 1, limit: 10 });
            const query = queryBus.execute.mock.calls[0][0] as { page: number; limit: number };
            expect(query.page).toBe(1);
            expect(query.limit).toBe(10);
        });
    });

    describe('findById()', () => {
        it('dispatches FindByIdUserQuery with the id converted to BigInt', async () => {
            const mockUser = User.reconstitute(1n, 'Adrian', 'a@b.com', 'hash');
            queryBus.execute.mockResolvedValue(mockUser);
            const result = await controller.findById(1);
            const query = queryBus.execute.mock.calls[0][0] as { userId: bigint };
            expect(query.userId).toBe(1n);
            expect(result).toBe(mockUser);
        });
    });

    describe('create()', () => {
        it('dispatches CreateUserCommand with the DTO data', async () => {
            commandBus.execute.mockResolvedValue(undefined);
            await controller.create({ name: 'Adrian', email: 'a@b.com', password: 'pass1234' });
            const cmd = commandBus.execute.mock.calls[0][0] as {
                name: string; email: string; password: string
            };
            expect(cmd.name).toBe('Adrian');
            expect(cmd.email).toBe('a@b.com');
        });
    });

    describe('update()', () => {
        it('dispatches UpdateUserCommand with the id as BigInt', async () => {
            commandBus.execute.mockResolvedValue(undefined);
            await controller.update(5, { name: 'New Name' });
            const cmd = commandBus.execute.mock.calls[0][0] as { id: bigint; name: string };
            expect(cmd.id).toBe(5n);
            expect(cmd.name).toBe('New Name');
        });
    });

    describe('remove()', () => {
        it('dispatches DeleteUserCommand with the id as BigInt', async () => {
            commandBus.execute.mockResolvedValue(undefined);
            await controller.remove(3);
            const cmd = commandBus.execute.mock.calls[0][0] as { id: bigint };
            expect(cmd.id).toBe(3n);
        });
    });
});
