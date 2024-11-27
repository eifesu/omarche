import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import errorHandler from "./middlewares/error.middleware";
import marketHandler from "./handlers/market.handler";
import authHandler from "./handlers/auth.handler";
import productHandler from "./handlers/product.handler";
import orderHandler from "./handlers/order.handler";
import sellerHandler from "./handlers/seller.handler";
import userHandler from "./handlers/user.handler";
import shipperHandler from "./handlers/shipper.handler";
import agentHandler from "./handlers/agent.handler";
import { startJobs } from "./jobs";
import { setupWebSocket } from "./websocket";
import promocodeHandler from "./handlers/promocode.handler";
import giftcardHandler from "./handlers/giftcard.handler";

const app = new Hono();
app.use(cors());
app.use(logger());
app.onError(errorHandler);
export const server = Bun.serve({
	fetch: app.fetch,
	port: 3000,
	// @ts-ignore
	websocket: setupWebSocket(app),
});

app.route("/auth/", authHandler);
app.route("/markets/", marketHandler);
app.route("/products/", productHandler);
app.route("/orders/", orderHandler);
app.route("/users/", userHandler);
app.route("/sellers/", sellerHandler);
app.route("/agents/", agentHandler);
app.route("/shippers/", shipperHandler);
app.route("/giftcards/", giftcardHandler);
app.route("/promocodes/", promocodeHandler);

console.log("🚀 Server is running on port 3000");

startJobs();
