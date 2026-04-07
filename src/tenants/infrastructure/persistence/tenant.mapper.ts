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
            name: tenant.name.value,
            phone: tenant.phone.value,
            dni: tenant.dni.value,
            birthdate: tenant.birthdate.value,
            observations: tenant.observations?.value ?? null,
            userId: tenant.userId ?? null
        }
    }
}
