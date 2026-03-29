export class UserNotFoundError extends Error {
    constructor(id: bigint) {
        super(`User with id '${id}' not found`)
        this.name = 'UserNotFoundError'
    }
}
