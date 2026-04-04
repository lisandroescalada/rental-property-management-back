import { Birthdate } from "../value-object/birthdate.vo"
import { Dni } from "../value-object/dni.vo"
import { Name } from "../value-object/name.vo"
import { Observations } from "../value-object/observations.vo"
import { Phone } from "../value-object/phone.vo"

export class Tenant {
    private constructor(
        public readonly id: bigint,
        public readonly name: string,
        public readonly phone: string,
        public readonly dni: string,
        public readonly birthdate: string,
        public readonly observations?: string | undefined,
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
        const newName = Name.create(params.name).value
        const newPhone = Phone.create(params.phone).value
        const newDni = Dni.create(params.dni).value
        const newBirthdate = Birthdate.create(params.birthdate).value
        const newObservations = Observations.create(params.observations ?? '').value

        return new Tenant(
            0n,
            newName,
            newPhone,
            newDni,
            newBirthdate,
            newObservations,
            params.userId, 
            new Date(), 
            new Date()
        )
    }

    static reconstitute(
        id: bigint,
        name: string,
        phone: string,
        dni: string, 
        birthdate: string,
        observations?: string | undefined,
        userId?: bigint | undefined,
        createdAt?: Date,
        updatedAt?: Date
    ): Tenant {
        return new Tenant(
            id, name, phone, dni, birthdate, observations, userId, createdAt, updatedAt
        )
    }

    updateProfile(params: {
        name?: string
        phone?: string
        dni?: string
        birthdate?: string
        observations?: string
    }): Tenant {
        const newName = Name.create(params.name ?? this.name).value
        const newPhone = Phone.create(params.phone ?? this.phone).value
        const newDni = Dni.create(params.dni ?? this.dni).value
        const newBirthdate = Birthdate.create(params.birthdate ?? this.birthdate).value
        const newObservations = Observations.create(params.observations ?? this.observations ?? '').value

        return Tenant.reconstitute(
            this.id,
            newName,
            newPhone,
            newDni,
            newBirthdate,
            newObservations,
            this.userId,
            this.created_at,
            new Date(),
        )
    }
}
