import { startOfYear } from 'date-fns';

import { FormEntryEntity } from '../../submodules/entries/entities';

import { FormEntriesPerMonth } from '../../types';

export function calcFormEntriesPerMonth(
  records: FormEntryEntity[]
): FormEntriesPerMonth[] {
  const entriesPerMonth: FormEntriesPerMonth[] = [];

  for (let i = 0; i < 12; i++) {
    const year = startOfYear(new Date());

    year.setMonth(i);

    const month = year.getMonth();

    const entries = records.filter(
      (record) => record.createdAt.getMonth() === month
    );

    entriesPerMonth.push({
      month: year.toLocaleString('es-do', { month: 'short' }),
      count: entries.length,
    });
  }

  return entriesPerMonth;
}

export default calcFormEntriesPerMonth;
