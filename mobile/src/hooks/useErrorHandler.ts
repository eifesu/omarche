// src/hooks/useErrorHandler.ts
import { useDispatch } from "react-redux";
import { showToast } from "@/redux/slices/toast.slice";

export const useErrorHandler = () => {
	const dispatch = useDispatch();

	const handleError = (error: any) => {
		let errorMessage = "Une erreur est survenue";

		if (typeof error === "string") {
			errorMessage = error;
		} else if (error.data && error.data.message) {
			errorMessage = error.data.message;
		} else if (error.error) {
			errorMessage = error.error;
		}

		console.error("Error:", error);
		dispatch(showToast({ message: errorMessage, type: "warning" }));
	};

	return handleError;
};
