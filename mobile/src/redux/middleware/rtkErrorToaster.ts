import { AnyAction, Middleware } from "@reduxjs/toolkit";
import { showToast } from "../slices/toast.slice";

const errorToastMiddleware: Middleware =
	({ dispatch }) =>
	(next) =>
	// @ts-ignore
	(action: AnyAction) => {
		if (action.type.endsWith("/rejected")) {
			let errorMessage = "Une erreur est survenue";

			if (action.payload) {
				if (typeof action.payload === "string") {
					errorMessage = action.payload;
				} else if (action.payload.data && action.payload.data.message) {
					errorMessage = action.payload.data.message;
				} else if (action.payload.error) {
					errorMessage = action.payload.error;
				}
			} else if (action.error) {
				errorMessage =
					action.error.message || "Une erreur est survenue";
			}

			console.log(
				"Error details:",
				JSON.stringify(action.payload || action.error, null, 2)
			);
			dispatch(showToast({ message: errorMessage, type: "warning" }));
		}
		return next(action);
	};

export default errorToastMiddleware;
