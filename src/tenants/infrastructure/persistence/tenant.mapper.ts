import { TenantOrmEntity } from "./tenant.orm-entity"
import { Tenant } from "src/tenants/domain/entities/tenant.entity"

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

    static toPersistence(user: Tenant): Partial<TenantOrmEntity> {
        return {
            id: user.id,
            name: user.name,
            phone: user.phone,
            dni: user.dni,
            birthdate: user.birthdate,
            observations: user.observations ?? null,
            userId: user.userId ?? null
        }
    }
}
