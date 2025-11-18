import { Queue, Worker } from "bullmq";
import { carregarDia } from "../carregar_dia";
import { database } from "../database";
import { connection } from "../redis";

const queueName = "load-day"

export type QueueInput = {
    day: string, subalinea: string, codigos: string[]
}

export const queueLoadDay = new Queue<QueueInput>(queueName, {
    connection: connection
})

export const wokerLoadDay = new Worker<QueueInput>(queueName, async job => {
    const codigos = (await database.table('codigos'))
        .map(c => c.codigo)

    const data = await carregarDia(job.data.day, job.data.subalinea);

    if (data.length > 0) {
        await database.table('recolhimento')
            .insert(data.filter(d => codigos.includes(d.codigo)))
            .onConflict()
            .merge()
    }

    console.log(job.data.day, job.data.subalinea)
}, {connection, autorun: false})