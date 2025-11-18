import { Queue, Worker } from "bullmq";
import { addDays, format, isBefore, subDays } from "date-fns";
import { database } from "../database";
import { connection } from "../redis";
import { queueLoadDay } from "./workerLoadDay";

const queueName = "load-days"

export const queueLoadDays = new Queue(queueName, {
    connection: connection
})

export const wokerLoadDays = new Worker(queueName, async job => {
    job.log('iniciou')
    // job.updateProgress({ state: 'obtendo subalineas' })
    const subalineas = (await database.table('codigos')
        .groupBy('subalinea')
        .select('subalinea'))
        .map(c => c.subalinea)

    // job.updateProgress({ state: 'obtendo codigos' })
    const codigos = (await database.table('codigos'))
        .map(c => c.codigo)
    job.log(codigos.length.toString())

    const lastDay = new Date()
    let currentDay = subDays(new Date(), job.data)

    job.updateProgress({ state: 'iniciando o processo' })
    while (isBefore(currentDay, lastDay)) {
        currentDay = addDays(currentDay, 1)

        const formated = format(currentDay, 'y-MM-dd');

        
        for await (let subalinea of subalineas) {
            job.log(`${formated}:${subalinea}`)

            job.updateProgress({ state: `${formated}:${subalinea}` })

            await queueLoadDay.add('default', { day: formated, subalinea, codigos }, {
                jobId: `${formated}:${subalinea}`,
                removeOnComplete: true
            })
        }
    }

    job.updateProgress({ state: 'concluido' })

    return true;
}, { connection, autorun: false })