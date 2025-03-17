import { notifyOrderCreated } from "@/utils/mail";
import { Prisma } from "@prisma/client";

const onOrderCreated: Prisma.Middleware = async (params, next) => {
  if (params.action === "create" && params.model === "Order") {
    notifyOrderCreated();
  }
  return next(params);
};

export { onOrderCreated };
