export class UpdateTenantCommand {
    constructor(
        public readonly id: bigint,
        public readonly name?: string,
        public readonly phone?: string,
        public readonly dni?: string,
        public readonly birthdate?: string,
        public readonly observations?: string
    ) {}
}
