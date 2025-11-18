import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { FastifyAdapter } from '@bull-board/fastify';
import cors from '@fastify/cors';
import fastify from "fastify";
import { queueLoadDay } from './workers/workerLoadDay';
import { queueLoadDays } from './workers/workerLoadDays';

const app = fastify()

const bullServerAdapter = new FastifyAdapter();
bullServerAdapter.setBasePath('/queues')

createBullBoard({
    queues: [
        new BullMQAdapter(queueLoadDay),
        new BullMQAdapter(queueLoadDays),
    ],
    serverAdapter: bullServerAdapter
})

app.register(cors)
app.register(bullServerAdapter.registerPlugin(), { prefix: '/queues'})

export default app;