import { Middleware } from "@reduxjs/toolkit";
import { showToast } from "../slices/toast.slice";

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

const errorToastMiddleware: Middleware =
    ({ dispatch }) =>
    (next) =>
    // @ts-ignore
    (action: AnyAction) => {
        try {
            if (action.type.endsWith("/rejected")) {
                dispatch(showToast({ message: "Une erreur est survenue", type: "warning" }));
                let errorMessage = "Une erreur est survenue";
                let errorType: "success" | "warning" | "info" = "warning";

                if (action.payload) {
                    if (action.payload.data?.statusCode && action.payload.data?.message) {
                        const errorResponse = action.payload as AppErrorResponse;
                        errorMessage = errorResponse.data.message;
                        
                        switch (Math.floor(errorResponse.data.statusCode / 100)) {
                            case 4:
                                errorType = "warning";
                                break;
                            case 5:
                                errorType = "warning";
                                break;
                            default:
                                errorType = "info";
                        }
                    } 
                    else if (typeof action.payload === "string") {
                        errorMessage = action.payload;
                        errorType = "warning";
                    }
                    else if (action.payload.error) {
                        errorMessage = action.payload.error;
                        errorType = "warning";
                    }
                } else if (action.error) {
                    errorMessage = action.error.message || "Une erreur est survenue";
                    errorType = "warning";
                }

                if (__DEV__) {
                    console.log(
                        "Error details:",
                        JSON.stringify(action.payload || action.error, null, 2)
                    );
                }

                dispatch(showToast({ message: errorMessage, type: errorType }));
            }
        } catch (error) {
            console.error("Error in errorToastMiddleware:", error);
        }
        return next(action);
    };

export default errorToastMiddleware;
