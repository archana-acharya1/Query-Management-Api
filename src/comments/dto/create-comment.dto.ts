import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  query_id: string;
}
