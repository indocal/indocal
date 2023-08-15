import { startOfYear } from 'date-fns';

import { ServiceRequestEntity } from '../../submodules/requests/entities';

import { ServiceRequestsPerMonth } from '../../types';

export function calcServiceRequestsPerMonth(
  records: ServiceRequestEntity[]
): ServiceRequestsPerMonth[] {
  const requestsPerMonth: ServiceRequestsPerMonth[] = [];

  for (let i = 0; i < 12; i++) {
    const year = startOfYear(new Date());

    year.setMonth(i);

    const month = year.getMonth();

    const requests = records.filter(
      (record) => record.createdAt.getMonth() === month
    );

    requestsPerMonth.push({
      month: year.toLocaleString('es-do', { month: 'short' }),
      count: requests.length,
    });
  }

  return requestsPerMonth;
}

export default calcServiceRequestsPerMonth;
