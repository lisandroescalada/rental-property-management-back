import { IsEmpty, Min } from "class-validator";

export class FindByIdUserDto {
    @IsEmpty({ message: 'User ID is empty' })
    @Min(1)
    userId!: number
}
