export class InvalidObservationsException extends Error {
    constructor() {
        super('Tenant observations cannot be empty')
        this.name = 'InvalidObservationsException'
    }
}
