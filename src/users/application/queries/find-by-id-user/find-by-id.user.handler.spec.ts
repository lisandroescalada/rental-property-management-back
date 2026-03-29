import { FindByIdUserHandler } from './find-by-id.user.handler'
import { FindByIdUserQuery } from './find-by-id.user.query'
import { InMemoryUsersRepository } from 'src/users/infrastructure/persistence/in-memory.users.repository'
import { UserNotFoundError } from 'src/users/domain/errors/user-not-found.error'
import { User } from 'src/users/domain/entities/user.entity'
import { UserResponseDto } from 'src/users/infrastructure/dto/user-response.dto'

describe('FindByIdUserHandler', () => {
    let handler: FindByIdUserHandler
    let repository: InMemoryUsersRepository

    beforeEach(() => {
        repository = new InMemoryUsersRepository()
        handler = new FindByIdUserHandler(repository)
    })

    afterEach(() => {
        repository.clear()
    })

    it('returns a UserResponseDto when the user exists', async () => {
        // Arrange
        const userToSave = User.create({
            name: 'Adrian García',
            email: 'adrian@example.com',
            hashedPassword: 'hashed_pass',
        })
        await repository.save(userToSave)

        // Act
        const result = await handler.execute(new FindByIdUserQuery(1n))

        // Assert
        expect(result).toBeInstanceOf(UserResponseDto)
        expect(result.id).toBe('1')
        expect(result.email).toBe('adrian@example.com')
    })

    it('does not expose sensitive fields (password, remember_token)', async () => {
        // Arrange
        await repository.save(User.create({ name: 'Test', email: 't@test.com', hashedPassword: 'secret' }))

        // Act
        const result = await handler.execute(new FindByIdUserQuery(1n))

        // Assert
        expect((result as any).password).toBeUndefined()
        expect((result as any).remember_token).toBeUndefined()
    })

    it('throws UserNotFoundError when the user does not exist', async () => {
        await expect(
            handler.execute(new FindByIdUserQuery(999n))
        ).rejects.toThrow(UserNotFoundError)
    })

    it('includes the user id in the error message', async () => {
        await expect(
            handler.execute(new FindByIdUserQuery(42n))
        ).rejects.toThrow("User with id '42' not found")
    })

    it('returns different users for different ids', async () => {
        // Arrange
        await repository.save(User.create({ name: 'User One', email: 'one@test.com', hashedPassword: 'p' }))
        await repository.save(User.create({ name: 'User Two', email: 'two@test.com', hashedPassword: 'p' }))

        // Act
        const user1 = await handler.execute(new FindByIdUserQuery(1n))
        const user2 = await handler.execute(new FindByIdUserQuery(2n))

        // Assert
        expect(user1.email).toBe('one@test.com')
        expect(user2.email).toBe('two@test.com')
    })
})
