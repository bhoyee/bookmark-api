import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class createBookmarkDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsOptional()
    decription?: string

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    link: string

}