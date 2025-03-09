import { Worker } from "bullmq";
import { addDays, format, isBefore, subDays } from "date-fns";
import { carregarDia } from "./carregar_dia";
import { database } from "./database";
import { connection } from "./redis";

export const workerLoadDays = new Worker<number, any, string>('loadDays', async Job => {
    console.log('Iniciando...')
    const subalineas = (await database.table('codigos')
        .groupBy('subalinea')
        .select('subalinea'))
        .map(c => c.subalinea)

    const codigos = (await database.table('codigos'))
        .map(c => c.codigo)


    const lastDay = new Date()
    let currentDay = subDays(new Date(), Job.data)

    while (isBefore(currentDay, lastDay)) {
        currentDay = addDays(currentDay, 1)

        const formated = format(currentDay, 'y-MM-dd')

        for await (let subalinea of subalineas) {
            const data = await carregarDia(formated, subalinea);

            if (data.length > 0) {
                await database.table('recolhimento')
                    .insert(data.filter(d => codigos.includes(d.codigo)))
                    .onConflict()
                    .merge()
            }

        }
        console.log(formated)
    }

    return true;
}, { connection, autorun: false })