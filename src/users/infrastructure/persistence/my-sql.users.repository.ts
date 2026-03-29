import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from 'src/users/domain/entities/user.entity'
import { UserRepository } from 'src/users/domain/repositories/user.repository'
import { UserOrmEntity } from './user.orm-entity'
import { UserMapper } from './user.mapper'


@Injectable()
export class MySqlUsersRepository implements UserRepository {
    constructor(
        @InjectRepository(UserOrmEntity)
        private readonly ormRepository: Repository<UserOrmEntity>
    ) {}

    async findAll(pagination: { page: number; limit: number }): Promise<User[]> {
        const { page, limit } = pagination
        const ormEntities = await this.ormRepository.find({
            skip: (page - 1) * limit,
            take: limit,
        })
        return ormEntities.map(UserMapper.toDomain)
    }

    async count(): Promise<number> {
        return this.ormRepository.count()
    }

    async findById(id: bigint): Promise<User | null> {
        const ormEntity = await this.ormRepository.findOneBy({ id })
        return ormEntity ? UserMapper.toDomain(ormEntity) : null
    }

    async findByEmail(email: string): Promise<User | null> {
        const ormEntity = await this.ormRepository.findOneBy({ email })
        return ormEntity ? UserMapper.toDomain(ormEntity) : null
    }

    async save(user: User): Promise<void> {
        const ormEntity = this.ormRepository.create(UserMapper.toPersistence(user))
        await this.ormRepository.save(ormEntity)
    }

    async update(id: bigint, user: User): Promise<void> {
        await this.ormRepository.update(Number(id), UserMapper.toPersistence(user))
    }

    async delete(id: bigint): Promise<void> {
        await this.ormRepository.delete(Number(id))
    }
}
