import { IsDateString } from 'class-validator';

export class CalcFormEntriesPerMonthParamsDto {
  @IsDateString()
  year: string;
}

export default CalcFormEntriesPerMonthParamsDto;
