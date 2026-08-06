import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class CompleteExerciseDto {
  @ApiPropertyOptional({
    example: 12,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  actualRepetitions?: number;

  @ApiPropertyOptional({
    example: 60,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  actualDurationSeconds?: number;
}
