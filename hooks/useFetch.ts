import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: Record<string, any> | FormData | null;
  headers?: Record<string, string>;
  token?: string;
}

class FetchError extends Error {
  code: number;
  details?: any;

  constructor(code: number, message: string, details?: any) {
    super(message);
    this.code = code;
    this.details = details;

    // Ensure the prototype chain is maintained
    Object.setPrototypeOf(this, FetchError.prototype);
  }
}

export const fetchFromNest = async (
  endpoint: string,
  options: FetchOptions = {}
): Promise<any> => {
  try {
    const token = localStorage.getItem("accessToken"); // Retrieve token from storage
    const isFormData = options.body instanceof FormData; // Check if the body is FormData

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: options.method || "GET",
      headers: {
        ...(isFormData
          ? {} // If FormData, let the browser set the Content-Type
          : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      credentials: "include",
      body: isFormData ? options.body : options.body ? JSON.stringify(options.body) : undefined, // Handle JSON or FormData
    });

    // Handle non-OK responses
    if (!response.ok) {
      let errorMessage = "An error occurred";
      let errorDetails = null;

      try {
        errorDetails = await response.json(); // Attempt to parse error details
        errorMessage = errorDetails.message || errorMessage;
      } catch {
        // Fallback if JSON parsing fails
        errorDetails = null;
      }

      // Handle specific status codes
      switch (response.status) {
        case 401:
          toast.error("Unauthorized access. | دخول غير مصرح");
          await new Promise((resolve) => setTimeout(resolve, 1500));
          window.location.href = "/"; // Redirect to login page
          break;
        case 400:
          throw new FetchError(400, "Bad Request: Invalid data sent to the server.", errorDetails);
        case 403:
          throw new FetchError(403, "Forbidden: You don't have access to this route.", errorDetails);
        case 404:
          throw new FetchError(404, "Not Found: The requested resource does not exist.", errorDetails);
        case 500:
          throw new FetchError(500, "Server Error: Please try again later.", errorDetails);
        default:
          throw new FetchError(response.status, errorMessage, errorDetails);
      }
    }

    return await response.json();
  } catch (error: any) {
    // Ensure all errors thrown are instances of FetchError
    if (!(error instanceof FetchError)) {
      throw new FetchError(0, error.message || "Network Error: Please check your connection.", null);
    }
    throw error;
  }
};
