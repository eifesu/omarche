import { PrismaClient } from "@prisma/client";
import { onOrderCreated } from "./middleware";

const prisma = new PrismaClient();

prisma.$use(onOrderCreated);

export default prisma;
