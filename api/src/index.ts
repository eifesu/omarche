import marketHandler from "./handlers/market.handler";
import authHandler from "./handlers/auth.handler";
import productHandler from "./handlers/product.handler";
import orderHandler from "./handlers/order.handler";
import sellerHandler from "./handlers/seller.handler";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import userHandler from "./handlers/user.handler";
import { startJobs } from "./jobs";
import { setupWebSocket } from "./websocket";
import shipperHandler from "./handlers/shipper.handler";
import agentHandler from "./handlers/agent.handler";

const app = new Hono();
app.use(cors());
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
app.route("/agents/", agentHandler);
app.route("/shippers/", shipperHandler);

startJobs();
