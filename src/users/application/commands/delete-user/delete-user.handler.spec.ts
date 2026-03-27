import { DeleteUserHandler } from './delete-user.handler'
import { DeleteUserCommand } from './delete-user.command'
import { InMemoryUsersRepository } from 'src/users/infrastructure/persistence/in-memory.users.repository'
import { UserNotFoundError } from 'src/users/domain/errors/user-not-found.error'
import { User } from 'src/users/domain/entities/user.entity'

describe('DeleteUserHandler', () => {
    let handler: DeleteUserHandler
    let repository: InMemoryUsersRepository

    beforeEach(() => {
        repository = new InMemoryUsersRepository()
        handler = new DeleteUserHandler(repository)
    })

    afterEach(() => repository.clear())

    it('deletes the existing user', async () => {
        await repository.save(User.create({ name: 'Adrian', email: 'a@test.com', hashedPassword: 'h' }))

        await handler.execute(new DeleteUserCommand(1n))

        const deleted = await repository.findById(1n)
        expect(deleted).toBeNull()
    })

    it('throws UserNotFoundError if the user does not exist', async () => {
        await expect(
            handler.execute(new DeleteUserCommand(999n)),
        ).rejects.toThrow(UserNotFoundError)
    })

    it('does not affect other users when one is deleted', async () => {
        await repository.save(User.create({ name: 'User 1', email: 'u1@test.com', hashedPassword: 'h' }))
        await repository.save(User.create({ name: 'User 2', email: 'u2@test.com', hashedPassword: 'h' }))

        await handler.execute(new DeleteUserCommand(1n))

        const remaining = await repository.findAll({ page: 1, limit: 10 })
        expect(remaining).toHaveLength(1)
        expect(remaining[0].email).toBe('u2@test.com')
    })
})
