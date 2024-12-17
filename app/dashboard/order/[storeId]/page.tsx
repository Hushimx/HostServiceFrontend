'use client'

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { TableContainer, FetchParams, ApiResponse } from "./reusable-datatable";
import { CellAction } from './fromActions';
import PageContainer from '@/components/layout/page-container';
import { useParams } from 'next/navigation';

// User interface
interface Order {
  id: number;
}

// Column definitions
const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableSorting: true,
  },
  {
    accessorKey: "storeSlug",
    header: "store",
    enableSorting: true,
  },

  {
    accessorKey: "client.name",
    header: "NAME",
    enableSorting: true,
  },
  {
    accessorKey: "client.phoneNumber",
    header: "NAME",
    enableSorting: true,
  },
  {
    accessorKey: "city.name",
    header: "EMAIL",
    enableSorting: true,
  },
  {
    accessorKey: "hotelName",
    header: "Hotel name",
    enableSorting: true,
  },
  {
    accessorKey: "roomNumber",
    header: "Room number",
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
  },
  {
    accessorKey: "total",
    header: "Status",
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
    return <CellAction data={row.original} row={row}  />
}
  }
];

// Fetch users from backend
async function fetchUsers(params: FetchParams,storeId : number): Promise<ApiResponse<User>> {
  // Construct query parameters
  const queryParams = new URLSearchParams();
  
  // Add pagination
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  
  // Add sorting
  if (params.sortField) queryParams.append('sortField', params.sortField);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  
  // Add filters
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      queryParams.append(key, value.toString());
    });
  }

  try {
    const response = await fetch(`http://127.0.0.1:3333/admin/orders/store/${storeId}?${queryParams}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoicml5YWRoLWFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwiaWF0IjoxNzM0MzU4MzE0LCJleHAiOjE3MzQ0NDExMTR9.f8Lm5FsaLmxJeDbd2U1nzI9RQIWVToMSwJIYv_KiaR0`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export default function UsersPage() {
  const {storeId} = useParams();

  return (
    <PageContainer>
      <div className="space-y-4">
      <TableContainer 
        storeId={storeId}
        columns={columns} 
        fetchData={fetchUsers}
        filterColumns={[
          {
            id: "email", // This will be a text input
          },
          {
            id: "role", // This will be a dropdown (Select)
            options: [
              { label: "Super Admin", value: "SUPER_ADMIN" },
              { label: "Regional Admin", value: "REGIONAL_ADMIN" },
            ],
          },
        ]}
      />
      </div>
    </PageContainer>
  );
}