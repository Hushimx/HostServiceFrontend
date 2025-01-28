import { FetchParams } from "@/types/fetch";
import { ApiResponse } from "@/types/fetch";
import { users } from '../constants/data';
import { fetchFromNest } from "@/hooks/useFetch";


//Fetch Datatable with pagiantion and sorting
// With additonal filters
export default async function fetchDataTable(endpoint,params: FetchParams) {
  const queryParams = new URLSearchParams();
    console.log(params)
  // Add pagination
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());

  // Add sorting
  if (params.sortField) queryParams.append("sortField", params.sortField);
  if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

  // Add filters
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
        if(value){
            queryParams.append(key, value.toString());

        }
    });
  }

  const response = await fetchFromNest(`${endpoint}?${queryParams}`, {
    method: "GET",
  });

  return response;
}
