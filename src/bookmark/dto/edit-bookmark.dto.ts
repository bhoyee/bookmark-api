import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class EditBookmarkDto {
    @IsString()
    @IsNotEmpty()
    title?: string

    @IsString()
    @IsOptional()
    decription?: string

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    link?: string

}