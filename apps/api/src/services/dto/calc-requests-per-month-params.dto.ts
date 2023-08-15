import { IsDateString } from 'class-validator';

export class CalcServiceRequestsPerMonthParamsDto {
  @IsDateString()
  year: string;
}

export default CalcServiceRequestsPerMonthParamsDto;
