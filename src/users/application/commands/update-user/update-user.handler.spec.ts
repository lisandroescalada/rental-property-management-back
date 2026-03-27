import { UpdateUserHandler } from './update-user.handler'
import { UpdateUserCommand } from './update-user.command'
import { InMemoryUsersRepository } from 'src/users/infrastructure/persistence/in-memory.users.repository'
import { UserNotFoundError } from 'src/users/domain/errors/user-not-found.error'
import { User } from 'src/users/domain/entities/user.entity'

describe('UpdateUserHandler', () => {
    let handler: UpdateUserHandler
    let repository: InMemoryUsersRepository

    beforeEach(() => {
        repository = new InMemoryUsersRepository()
        handler = new UpdateUserHandler(repository)
    })

    afterEach(() => repository.clear())

    it('updates the user name', async () => {
        await repository.save(User.create({ name: 'Old Name', email: 'u@test.com', hashedPassword: 'h' }))

        await handler.execute(new UpdateUserCommand(1n, 'New Name'))

        const updated = await repository.findById(1n)
        expect(updated!.name).toBe('New Name')
    })

    it('updates the user email', async () => {
        await repository.save(User.create({ name: 'Adrian', email: 'old@test.com', hashedPassword: 'h' }))

        await handler.execute(new UpdateUserCommand(1n, undefined, 'new@test.com'))

        const updated = await repository.findById(1n)
        expect(updated!.email).toBe('new@test.com')
    })

    it('does not modify fields that are not provided (partial update)', async () => {
        await repository.save(User.create({ name: 'Adrian', email: 'a@test.com', hashedPassword: 'h' }))

        await handler.execute(new UpdateUserCommand(1n, 'New Name'))

        const updated = await repository.findById(1n)
        expect(updated!.name).toBe('New Name')
        expect(updated!.email).toBe('a@test.com') // unchanged
    })

    it('throws UserNotFoundError if the user does not exist', async () => {
        await expect(
            handler.execute(new UpdateUserCommand(999n, 'Test')),
        ).rejects.toThrow(UserNotFoundError)
    })
})
