'use client'

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { TableContainer, FetchParams, ApiResponse } from "./reusable-datatable";
import { CellAction } from './fromActions';
import PageContainer from '@/components/layout/page-container';

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
    accessorKey: "first_name",
    header: "NAME",
    enableSorting: true,
    cell: ({ row }) => row.getValue("first_name")
  },
  {
    accessorKey: "email",
    header: "EMAIL",
    enableSorting: true,
  },
  {
    accessorKey: "role",
    header: "ROLE",
    enableSorting: true,
  },
  {
    accessorKey: "country.name",
    header: "country",
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
    return <CellAction data={row.original}  />
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
    const response = await fetch(`http://127.0.0.1:3333/admin/admins?${queryParams}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoicml5YWRoLWFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwiaWF0IjoxNzM0Mjc1NDk5LCJleHAiOjE3MzQzNTgyOTl9.s7heWgtXOFjuEH9vu1-SrW0Z4ptwzMq-OA2AsDAANT8`,
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