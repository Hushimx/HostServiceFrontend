const API_BASE_URL = "http://127.0.0.1:3333"; // Replace with your API base URL

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: Record<string, any>;
  headers?: Record<string, string>;
}

export const fetchFromNest = async (endpoint: string, options: FetchOptions = {}) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoicml5YWRoLWFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwiaWF0IjoxNzM0MzU4MzE0LCJleHAiOjE3MzQ0NDExMTR9.f8Lm5FsaLmxJeDbd2U1nzI9RQIWVToMSwJIYv_KiaR0" // Securely retrieve the token

  if (!token) {
    throw new Error("Unauthorized: No token found.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      // Handle specific status codes
      switch (response.status) {
        case 403:
          throw new Error("Forbidden: You don't have access to this route.");
        case 404:
          throw new Error("Not Found: The requested resource could not be found.");
        case 500:
          throw new Error("Server Error: Please try again later.");
        default:
          const errorData = await response.json();
          throw new Error(errorData.message || "Something went wrong.");
      }
    }

    // Return parsed JSON response
    return response.json();
  } catch (error: any) {
    throw new Error(error.message || "Network Error: Please check your connection.");
  }
};
