import cors from '@fastify/cors';
import fastify from "fastify";

const app = fastify()

app.register(cors)

export default app;