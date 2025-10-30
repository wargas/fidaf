import { addDays, format, isBefore, subDays } from "date-fns"
import { carregarDia } from "../carregar_dia"
import { database } from "../database"

export async function TaskRecolhimentos() {
    console.log('obtendo subalineas')
    const subalineas = (await database.table('codigos')
        .groupBy('subalinea')
        .select('subalinea'))
        .map(c => c.subalinea)

    console.log('obtendo codigos')
    const codigos = (await database.table('codigos'))
        .map(c => c.codigo)


    const lastDay = new Date()
    let currentDay = subDays(new Date(), 10)

    console.log('iniciando o processo')
    while (isBefore(currentDay, lastDay)) {
        currentDay = addDays(currentDay, 1)

        const formated = format(currentDay, 'y-MM-dd')

        for await (let subalinea of subalineas) {

            console.log(`${formated}:${subalinea}`)

            await updateRecolhimento(formated, subalinea, codigos);

        }
    }

    console.log('concluido')

    return true;
}

export async function updateRecolhimento(data: string, subalinea: string, codigos: string[]) {
    const dados = await carregarDia(data, subalinea);

    const insertData = dados.filter(d => codigos.includes(d.codigo||''))

    if (insertData.length > 0) {
        await database.table('recolhimento')
            .insert(insertData)
            .onConflict()
            .merge()
    }

    return true
}