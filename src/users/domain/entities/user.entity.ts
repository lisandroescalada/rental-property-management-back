
export class User {
    private constructor(
        public readonly id: bigint,
        public readonly name: string,
        public readonly email: string,
        public readonly password: string,
        public readonly email_verified_at?: Date,
        public readonly settings?: object,
        public readonly provider?: string,
        public readonly receive_notifications?: number,
        public readonly password_change_required_at?: Date,
        public readonly remember_token?: string,
        public readonly created_at?: Date,
        public readonly updated_at?: Date,
    ) {}

    static create(params: {
        name: string
        email: string
        hashedPassword: string
        provider?: string
        receive_notifications?: number
    }): User {
        if (!params.name || params.name.trim().length === 0) {
            throw new Error('User name cannot be empty')
        }
        if (!params.email || !params.email.includes('@')) {
            throw new Error('User email is invalid')
        }
        if (!params.hashedPassword) {
            throw new Error('User password cannot be empty')
        }

        return new User(
            0n, // id transitorio; se asigna en persistencia
            params.name.trim(),
            params.email.toLowerCase().trim(),
            params.hashedPassword,
            undefined,
            undefined,
            params.provider,
            params.receive_notifications ?? 1,
        )
    }

    static reconstitute(
        id: bigint,
        name: string,
        email: string,
        password: string,
        email_verified_at?: Date,
        settings?: object,
        provider?: string,
        receive_notifications?: number,
        password_change_required_at?: Date,
        remember_token?: string,
        created_at?: Date,
        updated_at?: Date,
    ): User {
        return new User(
            id, name, email, password,
            email_verified_at, settings, provider,
            receive_notifications, password_change_required_at,
            remember_token, created_at, updated_at,
        )
    }

    get isEmailVerified(): boolean {
        return this.email_verified_at !== undefined && this.email_verified_at !== null
    }

    updateProfile(params: {
        name?: string
        email?: string
        receive_notifications?: number
    }): User {
        const newName = params.name !== undefined ? params.name.trim() : this.name
        const newEmail = params.email !== undefined
            ? params.email.toLowerCase().trim()
            : this.email

        if (newName.length === 0) {
            throw new Error('User name cannot be empty')
        }
        if (!newEmail.includes('@')) {
            throw new Error('User email is invalid')
        }

        return User.reconstitute(
            this.id,
            newName,
            newEmail,
            this.password,
            this.email_verified_at,
            this.settings,
            this.provider,
            params.receive_notifications ?? this.receive_notifications,
            this.password_change_required_at,
            this.remember_token,
            this.created_at,
            new Date(),
        )
    }

    verifyEmail(verifiedAt: Date): User {
        return User.reconstitute(
            this.id, this.name, this.email, this.password,
            verifiedAt, this.settings, this.provider,
            this.receive_notifications, this.password_change_required_at,
            this.remember_token, this.created_at, new Date(),
        )
    }
}
