import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { TenantMapper } from './tenant.mapper'
import { InjectRepository } from '@nestjs/typeorm'
import { TenantOrmEntity } from './tenant.orm-entity'
import { Tenant } from 'src/tenants/domain/entities/tenant.entity'
import { TenantRepository } from 'src/tenants/domain/repositories/tenant.repository'

@Injectable()
export class MySqlTenantsRepository implements TenantRepository {
    constructor(
        @InjectRepository(TenantOrmEntity)
        private readonly ormRepository: Repository<TenantOrmEntity>
    ) {}

    async findAll(pagination: { page: number, limit: number }): Promise<Tenant[]> {
        const { page, limit } = pagination
        const ormEntities = await this.ormRepository.find({
            skip: (page - 1) * limit,
            take: limit
        })
        return ormEntities.map(TenantMapper.toDomain)
    }

    async count(): Promise<number> {
        return this.ormRepository.count()
    }

    async findById(id: bigint): Promise<Tenant | null> {
        const ormEntity = await this.ormRepository.findOneBy({ id })
        return ormEntity ? TenantMapper.toDomain(ormEntity) : null
    }

    async save(tenant: Tenant): Promise<void> {
        const ormEntity = this.ormRepository.create(TenantMapper.toPersistence(tenant))
        await this.ormRepository.save(ormEntity)
    }

    async update(id: bigint, tenant: Tenant): Promise<void> {
        await this.ormRepository.update(Number(id), TenantMapper.toPersistence(tenant))
    }

    async delete(id: bigint): Promise<void> {
        await this.ormRepository.delete(Number(id))
    }
}
