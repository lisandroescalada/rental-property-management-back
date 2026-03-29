export class UpdateUserCommand {
    constructor(
        public readonly id: bigint,
        public readonly name?: string,
        public readonly email?: string,
        public readonly receive_notifications?: number,
    ) {}
}

