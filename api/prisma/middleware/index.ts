import { notifyOrderCreated } from "@/utils/mail";
import { Prisma } from "@prisma/client";

const onOrderCreated: Prisma.Middleware = async (params, next) => {
  if (params.action === "update" && params.model === "Market") {
    notifyOrderCreated();
  }
  return next(params);
};

export { onOrderCreated };
