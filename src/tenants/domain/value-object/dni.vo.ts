import { InvalidDniException } from '../excepcions/invalid-dni.exception'

export class Dni {
    private constructor(public readonly value: string) {}

    static create(dni: string): Dni {
        if (!dni.trim()) throw new InvalidDniException()
        return new Dni(dni)
    }
}
