import { wokerLoadDay } from "./src/workers/workerLoadDay";
import { wokerLoadDays } from "./src/workers/workerLoadDays";

const workers = [wokerLoadDay, wokerLoadDays]

async function shutdown() {
    await Promise.all(workers.map(w => w?.close()))
    process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)


await Promise.all(workers.map(w => w.run()))