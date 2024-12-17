'use client'

import { ColumnDef } from '@tanstack/react-table';
import TableContainer from "./_compontes/DatatableContainer";
import { FetchParams } from '@/types/api';
import { columns } from './_compontes/columns';

// User interface
interface User {
  id: number;
  first_name: string;
  email: string;
  role: string;
}


// Fetch users from backend
async function fetchUsers(params: FetchParams): Promise<FetchParams> {
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
    const response = await fetch(`http://127.0.0.1:3333/admin/vendors${queryParams}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoicml5YWRoLWFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwiaWF0IjoxNzM0MTkxOTMzLCJleHAiOjE3MzQyNzQ3MzN9.JC7uWqTeZQN07Dk8mz68IAOyDF5Z0zoajie0a6zepvs`,
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

export default function RoomsPage({hotelId}: {hotelId: number}) {
  return (
    <div className="container mx-auto py-10">
      <TableContainer 
        hotelId={hotelId}
        columns={columns} 
        fetchData={fetchUsers}
        filterColumns={[
          {
            id: "name", // This will be a text input
          },
        ]}
      />
    </div>
  );
}