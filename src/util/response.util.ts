export interface ApiError {
  status?: number;
  title?: string;
  message: string;
  originalError?: any;
}

export interface ApiSucess<T = any> {
  status: number;
  title: string;
  message: string;
  data: T;
  // rawResponse?: any;
}

export const handleApiError = (err: unknown): ApiError => {
  // Check for direct status property (backend error with status)
  if (err && typeof err === "object" && "status" in err) {
    const error = err as any;
    const status = error.status;
    const title = error.response.data.title || "An error occurred";
    const message = error.response.data.message || "Server error occurred";

    if (status === 500) {
      return {
        status,
        title,
        message: "Internal server error. Please try again later.",
        originalError: err,
      };
    }

    return {
      status,
      title,
      message: typeof message === "string" ? message : "Server error occurred",
      originalError: err,
    };
  }

  // Network error (request made but no response)
  if (err && typeof err === "object" && "request" in err) {
    return {
      title: "Network Error",
      message: "Network error. Please check your connection.",
      originalError: err,
    };
  }

  // Other errors
  const message = err && typeof err === "object" && "message" in err ? (err as Error).message : "An unexpected error occurred.";

  return {
    title: "An Error Occurred",
    message: typeof message === "string" ? message : "An unexpected error occurred.",
    originalError: err,
  };
};

export const handleApiResponse = (response: unknown): ApiSucess => {
  if (response && typeof response === "object" && "data" in response && typeof (response as any).data === "object") {
    const res = response as any;

    return {
      status: res.status ?? 200,
      title: res.data.title ?? "Success",
      message: res.data.message ?? "Request succeeded",
      data: res.data.data ?? null,
      // rawResponse: response,
    };
  }

  return {
    status: 200,
    title: "Success",
    message: "Request completed successfully",
    data: null,
    // rawResponse: response,
  };
};
