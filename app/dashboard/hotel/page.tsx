'use client'

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { TableContainer, FetchParams, ApiResponse } from "./datatable";
import CellAction  from './formActions';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import Link from 'next/dist/client/link';

// User interface
interface User {
  id: number;
  first_name: string;
  email: string;
  role: string;
}

// Column definitions
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableSorting: true,
  },
  {
    accessorKey: "name",
    header: "name",
    enableSorting: true,

  },
  {
    accessorKey: "city.name",
    header: "City",
    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    enableSorting: true,
  },
  {
    id: 'buttons',
    cell: ({ row }) => {
        return (
            <Link href={`/dashboard/room/${row.original.id}`}>
            <Button className="bg-primary corsor-pointer text-white">Manage rooms</Button>
            </Link>
        )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
    return <CellAction data={row.original} />
}
  }
];

// Fetch users from backend
async function fetchUsers(params: FetchParams): Promise<ApiResponse<User>> {
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
    const response = await fetch(`http://127.0.0.1:3333/admin/hotels?${queryParams}`, {
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
  return (
    <PageContainer>
      <div className="space-y-4">
      <TableContainer 
        columns={columns} 
        fetchData={fetchUsers}
        filterColumns={[
          {
            id: "name", // This will be a text input
          },

        ]}
      />
      </div>
    </PageContainer>
  );
}