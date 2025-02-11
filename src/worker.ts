import { addDays, format, isBefore, subDays } from "date-fns"
import { carregarDia } from "./carregar_dia"
import { database } from "./database"

export async function Worker(days: number) {
    console.time('w')
    const subalineas = (await database.table('codigos')
        .groupBy('subalinea')
        .select('subalinea'))
        .map(c => c.subalinea)

    const codigos = (await database.table('codigos'))
        .map(c => c.codigo)


    const lastDay = new Date()
    let currentDay = subDays(new Date(), days)

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

    console.timeEnd('w')

}