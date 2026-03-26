
export class User {
    constructor(
        public id: bigint,
        public name: string,
        public email: string,
        public password: string,
        public email_verified_at?: Date,
        public settings?: object,
        public provider?: string,
        public receive_notifications?: number,
        public password_change_required_at?: Date,
        public remember_token?: string,
        public created_at?: Date,
        public updated_at?: Date
    ) {}
}
