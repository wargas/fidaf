import { wokerLoadDay } from "./src/workers/workerLoadDay";
import { wokerLoadDays } from "./src/workers/workerLoadDays";

console.log('iniciando workers')

await Promise.all([
    wokerLoadDays.run(),
    wokerLoadDay.run(),
])