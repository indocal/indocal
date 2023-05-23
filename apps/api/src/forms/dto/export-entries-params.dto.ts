import { IsDateString } from 'class-validator';

export class ExportFormEntriesParamsDto {
  @IsDateString()
  year: string;
}

export default ExportFormEntriesParamsDto;
