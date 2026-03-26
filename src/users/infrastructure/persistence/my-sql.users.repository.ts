import { User } from "src/users/domain/entities/user.entity"
import { UserRepository } from "src/users/domain/repositories/user.repository"
import { Repository } from "typeorm"

export class MySqlUsersRepository implements UserRepository {
    constructor(private readonly UserRepository: Repository<User>) {}

    async findAll(pagination: { page: number, limit: number }): Promise<User[]> {
        return []
    }

    async findById(id: bigint): Promise<User | null> {
        return await this.UserRepository.findOneBy({ id })
    }

    async save(user: User): Promise<void> {
        await this.UserRepository.save(user)
    }

    async update(id: bigint, user: User): Promise<void> {
        await this.UserRepository.update(Number(id), user)
    }

    async delete(id: bigint): Promise<void> {
        await this.UserRepository.delete(Number(id))
    }
}
