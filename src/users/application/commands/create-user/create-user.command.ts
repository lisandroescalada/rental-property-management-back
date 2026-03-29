export class CreateUserCommand {
    constructor(
        public readonly name: string,
        public readonly email: string,
        public readonly password: string,
        public readonly provider?: string,
        public readonly receive_notifications?: number,
    ) {}
}

