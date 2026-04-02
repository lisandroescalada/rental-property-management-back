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
        if (!params.name.trim()) throw new Error('Tenant name cannot be empty')
        if (!params.phone.trim()) throw new Error('Tenant phone cannot be empty')
        if (!params.dni.trim()) throw new Error('Tenant DNI cannot be empty')
        if (!params.birthdate.trim()) throw new Error('Tenant birthdate cannot be empty')

        const now = new Date()

        return new Tenant(
            0n,
            params.name,
            params.phone,
            params.dni,
            params.birthdate, 
            params.observations, 
            params.userId, 
            now, 
            now
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
            id, name, phone, dni, birthdate,
            observations, userId, createdAt, updatedAt
        )
    }

    updateProfile(params: {
        name?: string
        phone?: string
        dni?: string
        birthdate?: string
        observations?: string | undefined
    }): Tenant {
        const newName = params.name !== undefined ? params.name.trim() : this.name
        const newPhone = params.phone !== undefined ? params.phone.trim() : this.phone
        const newDni = params.dni !== undefined ? params.dni.trim() : this.dni
        const newBirthdate = params.birthdate !== undefined ? params.birthdate.trim() : this.birthdate
        const newObservations = params.observations !== undefined ? params.observations.trim() : this.observations

        if (newName.length === 0) {
            throw new Error('Tenant name cannot be empty')
        }
        if (newPhone.length === 0) {
            throw new Error('Tenant phone cannot be empty')
        }

        if (newPhone.length === 0) {
            throw new Error('Tenant phone cannot be empty')
        }

        if (newDni.length === 0) {
            throw new Error('Tenant DNI cannot be empty')
        }

        if (newBirthdate.length === 0) {
            throw new Error('Tenant birthdate cannot be empty')
        }

        if (newObservations !== undefined && newObservations.length === 0) {
            throw new Error('Tenant observations cannot be empty if provided')
        }

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
