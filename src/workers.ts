import { Worker } from "bullmq";
import { addDays, format, isBefore, subDays } from "date-fns";
import { carregarDia } from "./carregar_dia";
import { database } from "./database";
import { connection } from "./redis";

const workerLoadDays = new Worker<number, any, string>('loadDays', async job => {
    job.updateProgress({state: 'obtendo subalineas'})
    const subalineas = (await database.table('codigos')
        .groupBy('subalinea')
        .select('subalinea'))
        .map(c => c.subalinea)

    job.updateProgress({state: 'obtendo codigos'})
    const codigos = (await database.table('codigos'))
        .map(c => c.codigo)


    const lastDay = new Date()
    let currentDay = subDays(new Date(), job.data)

    job.updateProgress({state: 'iniciando o processo'})
    while (isBefore(currentDay, lastDay)) {
        currentDay = addDays(currentDay, 1)

        const formated = format(currentDay, 'y-MM-dd')

        for await (let subalinea of subalineas) {

            job.updateProgress({state: `${formated}:${subalinea}`})
            const data = await carregarDia(formated, subalinea);

            if (data.length > 0) {
                await database.table('recolhimento')
                    .insert(data.filter(d => codigos.includes(d.codigo)))
                    .onConflict()
                    .merge()
            }

            
        }
    }

    job.updateProgress({state: 'concluido'})

    return true;
}, { connection, autorun: false })

workerLoadDays.on('error', () => {
    console.log('ocorreu um erro')
})

workerLoadDays.on('progress', (job, progress) => {
    console.log(job.name, progress)
})

export { workerLoadDays };
