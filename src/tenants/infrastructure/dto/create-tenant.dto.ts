import { Transform } from "class-transformer"
import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateTenantDto {
    @IsString()
    @IsNotEmpty()
    name!: string

    @IsString()
    @IsNotEmpty()
    phone!: string

    @IsString()
    @IsNotEmpty()
    dni!: string

    @IsDateString()
    birthdate!: string

    @IsOptional()
    @IsString()
    observations?: string

    // user_id: se valida en T-2 cuando se conecte con UserRepository
    @IsOptional()
    @Transform(({ value }) => BigInt(value))
    userId?: bigint
}
