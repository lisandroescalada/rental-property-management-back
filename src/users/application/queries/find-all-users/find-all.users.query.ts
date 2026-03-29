import { Query } from '@nestjs/cqrs'
import { User } from 'src/users/domain/entities/user.entity'

export class FindAllUsersQuery extends Query<User[]> {
    constructor(
        public readonly page: number,
        public readonly limit: number,
    ) {
        super()
    }
}

