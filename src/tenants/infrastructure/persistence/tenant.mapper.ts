import { TenantOrmEntity } from './tenant.orm-entity'
import { Tenant } from 'src/tenants/domain/entities/tenant.entity'

export class TenantMapper {
    static toDomain(ormEntity: TenantOrmEntity): Tenant {
        return Tenant.reconstitute(
            ormEntity.id,
            ormEntity.name,
            ormEntity.phone,
            ormEntity.dni,
            ormEntity.birthdate,
            ormEntity.observations ?? undefined,
            ormEntity.userId ?? undefined,
            ormEntity.created_at,
            ormEntity.updated_at
        )
    }

    static toPersistence(tenant: Tenant): Partial<TenantOrmEntity> {
        return {
            id: tenant.id,
            name: tenant.name,
            phone: tenant.phone,
            dni: tenant.dni,
            birthdate: tenant.birthdate,
            observations: tenant.observations ?? null,
            userId: tenant.userId ?? null
        }
    }
}
