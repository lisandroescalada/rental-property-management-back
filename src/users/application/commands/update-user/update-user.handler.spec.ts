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

    // ── Normalization ──────────────────────────────────────────────────────────

    it('trims whitespace from the updated name', async () => {
        await repository.save(User.create({ name: 'Old', email: 'a@test.com', hashedPassword: 'h' }))

        await handler.execute(new UpdateUserCommand(1n, '  Trimmed Name  '))

        const updated = await repository.findById(1n)
        expect(updated!.name).toBe('Trimmed Name')
    })

    it('lowercases and trims the updated email', async () => {
        await repository.save(User.create({ name: 'Test', email: 'a@test.com', hashedPassword: 'h' }))

        await handler.execute(new UpdateUserCommand(1n, undefined, '  UPPER@TEST.COM  '))

        const updated = await repository.findById(1n)
        expect(updated!.email).toBe('upper@test.com')
    })

    // ── Invariant enforcement ──────────────────────────────────────────────────

    it('throws an error if the new name is blank', async () => {
        await repository.save(User.create({ name: 'Test', email: 'a@test.com', hashedPassword: 'h' }))

        await expect(
            handler.execute(new UpdateUserCommand(1n, '   ')),
        ).rejects.toThrow('User name cannot be empty')
    })

    it('throws an error if the new email is invalid', async () => {
        await repository.save(User.create({ name: 'Test', email: 'a@test.com', hashedPassword: 'h' }))

        await expect(
            handler.execute(new UpdateUserCommand(1n, undefined, 'not-an-email')),
        ).rejects.toThrow('User email is invalid')
    })

    it('does not persist changes when an invariant is violated', async () => {
        await repository.save(User.create({ name: 'Original', email: 'a@test.com', hashedPassword: 'h' }))

        await expect(
            handler.execute(new UpdateUserCommand(1n, '')),
        ).rejects.toThrow()

        const unchanged = await repository.findById(1n)
        expect(unchanged!.name).toBe('Original') // rollback: nothing was persisted
    })
})
