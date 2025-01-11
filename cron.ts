import { CronJob } from 'cron';
import { format, subMonths } from 'date-fns';
import { carregarMes } from './src/carregar_mes';
import { database } from './src/database';

console.log(`Starting...`)

const job = new CronJob(process.env.CRON || '', async () => {
    const mesCurrent = new Date();

    const mesAnterior = subMonths(mesCurrent, 1)

    for await (let current of [mesCurrent, mesAnterior]) {
        const ano = format(current, 'yyyy')
        const mes = format(current, 'MM')

        console.log(`carregando... ${ano}/${mes}`)

        const data = await carregarMes(parseInt(ano), parseInt(mes));

        
        if(data.length > 0) {
            console.log(`atualizando... ${ano}/${mes}`)

            await database.table('receitas').insert(data)
            .onConflict('id').merge()
        }

        

    }
})

job.start()


// process.exit(0)
// const mesCurrent = new Date();

// const mesAnterior = subMonths(mesCurrent, 1)

// for await (let current of [mesCurrent, mesAnterior]) {
//     const ano = format(current, 'yyyy')
//     const mes = format(current, 'MM')

//     console.log(`carregando... ${ano}/${mes}`)

//     const data = await carregarMes(parseInt(ano), parseInt(mes));

//     console.log(`atualizando... ${ano}/${mes}`)

//     await database.table('receitas').insert(data)
//         .onConflict('id').merge()

// }
