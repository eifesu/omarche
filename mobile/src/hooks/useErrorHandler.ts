// src/hooks/useErrorHandler.ts
import { useDispatch } from "react-redux";
import { showToast } from "@/redux/slices/toast.slice";

interface AppErrorResponse {
    data: {
        statusCode: number;
        message: string;
        isOperational: boolean;
        error: {
            message: string;
            stack?: string;
        };
    };
}

export const useErrorHandler = () => {
    const dispatch = useDispatch();

    const handleError = (error: any) => {
        let errorMessage = "Une erreur est survenue";
        let errorType: "success" | "warning" | "info" = "warning";

        // Handle AppError response
        if (error?.data?.statusCode && error?.data?.message) {
            const appError = error as AppErrorResponse;
            errorMessage = appError.data.message;
            
            // Map status codes to toast types
            switch (Math.floor(appError.data.statusCode / 100)) {
                case 4:
                    errorType = "warning"; // Client errors (400-499)
                    break;
                case 5:
                    errorType = "warning"; // Server errors (500-599)
                    break;
                default:
                    errorType = "info";
            }
        }
        // Handle string error messages
        else if (typeof error === "string") {
            errorMessage = error;
            errorType = "warning";
        }
        // Handle error objects with data.message
        else if (error?.data?.message) {
            errorMessage = error.data.message;
            errorType = "warning";
        }
        // Handle error objects with error property
        else if (error?.error) {
            errorMessage = error.error;
            errorType = "warning";
        }

        // Log error details in development
        if (__DEV__) {
            console.error("Error:", error);
        }

        dispatch(showToast({ message: errorMessage, type: errorType }));
    };

    return handleError;
};
