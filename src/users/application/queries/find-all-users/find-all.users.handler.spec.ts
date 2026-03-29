import { FindAllUsersHandler } from './find-all.users.handler'
import { FindAllUsersQuery } from './find-all.users.query'
import { InMemoryUsersRepository } from 'src/users/infrastructure/persistence/in-memory.users.repository'
import { User } from 'src/users/domain/entities/user.entity'
import { PaginatedResponseDto } from 'src/users/infrastructure/dto/paginated-response.dto'
import { UserResponseDto } from 'src/users/infrastructure/dto/user-response.dto'

describe('FindAllUsersHandler', () => {
    let handler: FindAllUsersHandler
    let repository: InMemoryUsersRepository

    beforeEach(() => {
        repository = new InMemoryUsersRepository()
        handler = new FindAllUsersHandler(repository)
    })

    afterEach(() => repository.clear())

    it('returns an empty paginated result when there are no users', async () => {
        const result = await handler.execute(new FindAllUsersQuery(1, 10))

        expect(result).toBeInstanceOf(PaginatedResponseDto)
        expect(result.data).toHaveLength(0)
        expect(result.total).toBe(0)
        expect(result.totalPages).toBe(0)
    })

    it('returns paginated UserResponseDto items', async () => {
        await repository.save(User.create({ name: 'Ana', email: 'ana@test.com', hashedPassword: 'p' }))
        await repository.save(User.create({ name: 'Luis', email: 'luis@test.com', hashedPassword: 'p' }))

        const result = await handler.execute(new FindAllUsersQuery(1, 10))

        expect(result.data).toHaveLength(2)
        expect(result.total).toBe(2)
        expect(result.totalPages).toBe(1)
        expect(result.data.every(u => u instanceof UserResponseDto)).toBe(true)
    })

    it('does not expose sensitive fields in any item', async () => {
        await repository.save(User.create({ name: 'Ana', email: 'ana@test.com', hashedPassword: 'secret' }))

        const result = await handler.execute(new FindAllUsersQuery(1, 10))

        expect((result.data[0] as any).password).toBeUndefined()
        expect((result.data[0] as any).remember_token).toBeUndefined()
    })

    it('applies pagination correctly', async () => {
        for (let i = 1; i <= 5; i++) {
            await repository.save(User.create({ name: `User ${i}`, email: `u${i}@test.com`, hashedPassword: 'p' }))
        }

        const page1 = await handler.execute(new FindAllUsersQuery(1, 2))
        const page2 = await handler.execute(new FindAllUsersQuery(2, 2))
        const page3 = await handler.execute(new FindAllUsersQuery(3, 2))

        expect(page1.data).toHaveLength(2)
        expect(page1.total).toBe(5)
        expect(page1.totalPages).toBe(3)

        expect(page2.data).toHaveLength(2)
        expect(page3.data).toHaveLength(1)
    })
})
