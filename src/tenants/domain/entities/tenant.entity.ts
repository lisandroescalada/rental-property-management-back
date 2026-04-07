import { Birthdate } from '../value-object/birthdate.vo'
import { Dni } from '../value-object/dni.vo'
import { Name } from '../value-object/name.vo'
import { Observations } from '../value-object/observations.vo'
import { Phone } from '../value-object/phone.vo'
import { TenantId } from '../value-object/tenant-id.vo'

export class Tenant {
    private constructor(
        public readonly id: TenantId,
        public readonly name: Name,
        public readonly phone: Phone,
        public readonly dni: Dni,
        public readonly birthdate: Birthdate,
        public readonly observations?: Observations,
        public readonly userId?: bigint | undefined,
        public readonly created_at?: Date,
        public readonly updated_at?: Date
    ) {}

    static create(params: {
        name: string,
        phone: string,
        dni: string
        birthdate: string,
        observations?: string | undefined,
        userId?: bigint | undefined
    }): Tenant {
        return new Tenant(
            TenantId.generate(),
            Name.create(params.name),
            Phone.create(params.phone),
            Dni.create(params.dni),
            Birthdate.create(params.birthdate),
            params.observations !== undefined ? Observations.create(params.observations) : undefined,
            params.userId,
            new Date(),
            new Date()
        )
    }

    static reconstitute(
        id: TenantId | bigint,
        name: string,
        phone: string,
        dni: string,
        birthdate: string,
        observations?: string | undefined,
        userId?: bigint | undefined,
        createdAt?: Date,
        updatedAt?: Date
    ): Tenant {
        const tenantId = typeof id === 'bigint' ? TenantId.fromDatabase(id) : id
        return new Tenant(
            tenantId,
            Name.create(name),
            Phone.create(phone),
            Dni.create(dni),
            Birthdate.create(birthdate),
            observations !== undefined ? Observations.create(observations) : undefined,
            userId,
            createdAt,
            updatedAt
        )
    }

    updateProfile(params: {
        name?: string
        phone?: string
        dni?: string
        birthdate?: string
        observations?: string
    }): Tenant {
        return Tenant.reconstitute(
            this.id,
            Name.create(params.name ?? this.name.value).value,
            Phone.create(params.phone ?? this.phone.value).value,
            Dni.create(params.dni ?? this.dni.value).value,
            Birthdate.create(params.birthdate ?? this.birthdate.value).value,
            params.observations !== undefined ? Observations.create(params.observations).value : this.observations?.value,
            this.userId,
            this.created_at,
            new Date()
        )
    }
}
