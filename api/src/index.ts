import marketHandler from "./handlers/market.handler";
import authHandler from "./handlers/auth.handler";
import productHandler from "./handlers/product.handler";
import orderHandler from "./handlers/order.handler";
import sellerHandler from "./handlers/seller.handler";
import { Hono } from "hono";
import { logger } from "hono/logger";
import userHandler from "./handlers/user.handler";
import { startJobs } from "./jobs";
import { setupWebSocket } from "./websocket";

const app = new Hono();
app.use(logger());

export const server = Bun.serve({
	fetch: app.fetch,
	port: 3000,
	// @ts-ignore
	websocket: setupWebSocket(app),
});

app.route("/", authHandler);
app.route("/markets/", marketHandler);
app.route("/products/", productHandler);
app.route("/orders/", orderHandler);
app.route("/users/", userHandler);
app.route("/sellers/", sellerHandler);

startJobs();
