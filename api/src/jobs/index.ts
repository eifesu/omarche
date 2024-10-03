import { CronJob } from "cron";
import { assignOrdersToShippers, sendCurrentOrderToShipper } from "./order.job";

export function startJobs() {
	const runJobs = async () => {
		try {
			await assignOrdersToShippers();
			await sendCurrentOrderToShipper();
		} catch (error) {
			console.error("Error running jobs:", error);
		}
	};

	const job = new CronJob("*/10 * * * * *", runJobs);
	job.start();
}
