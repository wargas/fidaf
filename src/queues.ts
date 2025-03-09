import { Queue } from "bullmq";
import { connection } from "./redis";

export const queueLoadDays = new Queue('loadDays', { connection: connection})