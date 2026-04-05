import { InvalidObservationsException } from '../excepcions/invalid-observations.exception'

export class Observations {
    private constructor(public readonly value: string) {}

    static create(observations: string): Observations {
        if (!observations.trim()) throw new InvalidObservationsException()
        return new Observations(observations)
    }
}
