export class CreateTenantCommand {
    constructor(
        public readonly name: string,
        public readonly phone: string,
        public readonly dni: string,
        public readonly birthdate: string,
        public readonly observations: string | undefined,
        public readonly userId: bigint | undefined,
    ) {}
}
