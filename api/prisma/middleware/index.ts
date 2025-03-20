import { Prisma } from "@prisma/client";
import { handleOrderCreated } from "../handlers/order-handlers";

const onOrderCreated: Prisma.Middleware = async (params, next) => {
  if (params.action === "create" && params.model === "Order") {
    await handleOrderCreated(params.args);
  }
  return next(params);
};

export { onOrderCreated };
