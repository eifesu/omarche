import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { serveStatic } from "hono/bun";
import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
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
import imageHandler from "./handlers/image.handler";
import { authMiddleware } from "./middlewares/auth.middleware";
import { Admin, Agent, area_code, Shipper, User } from "@prisma/client";

export type Variables = {
  userId: string;
  areaCode: area_code | null;
}

const app = new OpenAPIHono<{Variables: Variables}>();

app.doc('/docs', {
  openapi: '3.0.0',
  info: {
    title: 'Omarche API Documentation',
    version: '1.0.0',
  },
});
app.get('/swagger', swaggerUI({ url: '/docs' }));

app.use(cors());
app.use(logger());
app.use("/uploads/*", serveStatic({ root: "./" }));
app.onError(errorHandler);
export const server = Bun.serve({
  fetch: app.fetch,
  port: 3000,
  // @ts-ignore
  websocket: setupWebSocket(app),
});

app.route("/auth/", authHandler);
app.use(authMiddleware)
app.route("/markets/", marketHandler);
app.route("/products/", productHandler);
app.route("/orders/", orderHandler);
app.route("/users/", userHandler);
app.route("/sellers/", sellerHandler);
app.route("/agents/", agentHandler);
app.route("/shippers/", shipperHandler);
app.route("/giftcards/", giftcardHandler);
app.route("/promocodes/", promocodeHandler);
app.route("/images/", imageHandler);

console.log(" Server is running on port 3000");

startJobs();
