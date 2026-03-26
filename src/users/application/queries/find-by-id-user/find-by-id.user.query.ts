import { Query } from "@nestjs/cqrs";
import { User } from "src/users/domain/entities/user.entity";

export class FindByIdUserQuery extends Query<{
    actionId: User | null
}> {
    constructor(
        public readonly userId: bigint
    ) {
        super()
    }
}
