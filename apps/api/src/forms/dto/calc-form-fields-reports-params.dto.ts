import { IsDateString } from 'class-validator';

export class CalcFormFieldsReportsParamsDto {
  @IsDateString()
  year: string;
}

export default CalcFormFieldsReportsParamsDto;
