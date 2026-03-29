import { Query } from "@nestjs/cqrs"
import { UserResponseDto } from "src/users/infrastructure/dto/user-response.dto"

export class FindByIdUserQuery extends Query<UserResponseDto> {
    constructor(
        public readonly userId: bigint
    ) {
        super()
    }
}
