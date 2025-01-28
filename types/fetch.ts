export interface ApiResponse<T> {
    data: T[];
    meta: {
      total: number;
      lastPage: number;
      currentPage: number;
      perPage: number;
    };
  }
  
  export interface FetchParams {
    page?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: Record<string, string | number>;
  }