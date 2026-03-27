import { FindAllUsersHandler } from './find-all.users.handler'
import { FindAllUsersQuery } from './find-all.users.query'
import { InMemoryUsersRepository } from 'src/users/infrastructure/persistence/in-memory.users.repository'
import { User } from 'src/users/domain/entities/user.entity'

describe('FindAllUsersHandler', () => {
    let handler: FindAllUsersHandler
    let repository: InMemoryUsersRepository

    beforeEach(() => {
        repository = new InMemoryUsersRepository()
        handler = new FindAllUsersHandler(repository)
    })

    afterEach(() => repository.clear())

    it('returns an empty list when there are no users', async () => {
        const result = await handler.execute(new FindAllUsersQuery(1, 10))
        expect(result).toEqual([])
    })

    it('returns the existing users', async () => {
        await repository.save(User.create({ name: 'Ana', email: 'ana@test.com', hashedPassword: 'p' }))
        await repository.save(User.create({ name: 'Luis', email: 'luis@test.com', hashedPassword: 'p' }))

        const result = await handler.execute(new FindAllUsersQuery(1, 10))

        expect(result).toHaveLength(2)
        expect(result.every(u => u instanceof User)).toBe(true)
    })

    it('applies pagination correctly', async () => {
        for (let i = 1; i <= 5; i++) {
            await repository.save(User.create({ name: `User ${i}`, email: `u${i}@test.com`, hashedPassword: 'p' }))
        }

        const page1 = await handler.execute(new FindAllUsersQuery(1, 2))
        const page2 = await handler.execute(new FindAllUsersQuery(2, 2))
        const page3 = await handler.execute(new FindAllUsersQuery(3, 2))

        expect(page1).toHaveLength(2)
        expect(page2).toHaveLength(2)
        expect(page3).toHaveLength(1)
    })
})
