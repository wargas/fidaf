import { CronJob } from 'cron';
import { Worker } from './src/worker';

console.log(`Starting...`)

export const cron = CronJob.from({
    cronTime: process.env.CRON || '',
    runOnInit: true,
    timeZone: 'America/Recife',
    // onTick: async () => {
    //     const mesCurrent = new Date();

    //     const mesAnterior = subMonths(mesCurrent, 1)

    //     for await (let current of [mesCurrent, mesAnterior]) {
    //         const ano = format(current, 'yyyy')
    //         const mes = format(current, 'MM')

    //         console.info(`carregando... ${ano}/${mes}`)

    //         const data = await carregarMes(parseInt(ano), parseInt(mes));


    //         if (data.length > 0) {
    //             console.info(`atualizando... ${ano}/${mes}`)

    //             await database.table('receitas').insert(data)
    //                 .onConflict('id').merge()
    //         }

    //         console.info(`concluído: ${ano}/${mes}`)

    //     }

    //     console.info(`Proxima: ${cron.nextDate().toFormat('dd/MM/yyyy hh:mm:ss')}`)
    // },
    onTick: async() => {
        await Worker(10);
    },
    start: true
})

