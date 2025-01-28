'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { Employee } from '@/constants/data';
import { columns } from './columns';
import {
  GENDER_OPTIONS,
  useEmployeeTableFilters
} from './use-employee-table-filters';
import { Pagination } from '@/components/pagination';
import { CountrySelect } from '@/components/ui/countrySelector';
import { CitySelect } from '@/components/ui/citySelector';

export default function EmployeeTable({
  data,
  totalData
}: {
  data: Employee[];
  totalData: number;
}) {

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}
