import cors from '@fastify/cors';
import fastify from "fastify";

const app = fastify()

// const bullServerAdapter = new FastifyAdapter();
// bullServerAdapter.setBasePath('/queues')

// createBullBoard({
//     queues: [
//         new BullMQAdapter(queueLoadDay),
//         new BullMQAdapter(queueLoadDays),
//     ],
//     serverAdapter: bullServerAdapter
// })

app.register(cors)
// app.register(bullServersAdapter.registerPlugin(), { prefix: '/queues'})

export default app;