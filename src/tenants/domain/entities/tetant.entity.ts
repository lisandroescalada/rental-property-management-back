export class Tenant {
    private constructor(
        public readonly id: bigint,
        public readonly name: string,
        public readonly phone: string,
        public readonly dni: string,
        public readonly birthdate: string,
        public readonly observations?: string | null,
        public readonly userId?: bigint | null,
        public readonly created_at?: Date,
        public readonly updated_at?: Date
    ) {}

    static create(params: {
        name: string,
        phone: string,
        dni: string
        birthdate: string,
        userId: bigint | null
    }): Tenant {
        if (!params.name.trim()) throw new Error('Tenant name cannot be empty')
        if (!params.dni.trim()) throw new Error('Tenant DNI cannot be empty')

        const now = new Date()

        return new Tenant(0n, params.name, params.phone, params.dni,
            params.birthdate, null, params.userId, now, now)
    }

    static reconstitute(
        id: bigint,
        name: string,
        phone: string,
        dni: string, 
        birthdate: string,
        observations?: string | null,
        userId?: bigint | null,
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
        birthdate?: string
    }): Tenant {
        const newName = params.name !== undefined ? params.name.trim() : this.name
        const newPhone = params.phone !== undefined ? params.phone.trim() : this.phone

        if (newName.length === 0) {
            throw new Error('User name cannot be empty')
        }
        if (newPhone.length === 0) {
            throw new Error('User phone cannot be empty')
        }

        return Tenant.reconstitute(
            this.id,
            newName,
            newPhone,
            this.dni,
            params.birthdate ?? this.birthdate,
            this.observations,
            this.userId,
            this.created_at,
            new Date(),
        )
    }
}
