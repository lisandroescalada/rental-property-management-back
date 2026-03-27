import { CreateUserHandler } from './create-user.handler'
import { CreateUserCommand } from './create-user.command'
import { InMemoryUsersRepository } from 'src/users/infrastructure/persistence/in-memory.users.repository'
import { UserAlreadyExistsError } from 'src/users/domain/errors/user-already-exists.error'
import { User } from 'src/users/domain/entities/user.entity'

describe('CreateUserHandler', () => {
    let handler: CreateUserHandler
    let repository: InMemoryUsersRepository

    beforeEach(() => {
        repository = new InMemoryUsersRepository()
        handler = new CreateUserHandler(repository)
    })

    afterEach(() => repository.clear())

    it('creates a new user successfully', async () => {
        await handler.execute(
            new CreateUserCommand('Adrian García', 'adrian@test.com', 'hashed_pass'),
        )

        const saved = await repository.findByEmail('adrian@test.com')
        expect(saved).not.toBeNull()
        expect(saved).toBeInstanceOf(User)
        expect(saved!.name).toBe('Adrian García')
    })

    it('throws UserAlreadyExistsError if the email is already registered', async () => {
        await handler.execute(
            new CreateUserCommand('Adrian', 'dup@test.com', 'hash'),
        )

        await expect(
            handler.execute(new CreateUserCommand('Other', 'dup@test.com', 'hash')),
        ).rejects.toThrow(UserAlreadyExistsError)
    })

    it('throws an error if the email is invalid', async () => {
        await expect(
            handler.execute(new CreateUserCommand('Test', 'not-an-email', 'hash')),
        ).rejects.toThrow('User email is invalid')
    })

    it('throws an error if the name is empty', async () => {
        await expect(
            handler.execute(new CreateUserCommand('', 'a@b.com', 'hash')),
        ).rejects.toThrow('User name cannot be empty')
    })
})
