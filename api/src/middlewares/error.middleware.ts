import { Context } from "hono";
import AppError from "../utils/AppError";
import { StatusCode } from "hono/utils/http-status";

const errorHandler = (err: any, c: Context) => {
	if (err instanceof AppError) {
		if (err.statusCode == 500) console.error("AppError:", err);
		return c.json(
			{
				status: "error",
				message: err.message,
				code: err.statusCode,
			},
			err.statusCode as StatusCode
		);
	}

	// For unhandled errors, return a generic 500 error
	console.error("Unhandled error:", err);
	return c.json(
		{
			status: "error",
			message: "An unexpected error occurred",
			code: 500,
		},
		500
	);
};

export default errorHandler;
