import { addDays, format, isBefore, subDays } from "date-fns"
import { carregarDia } from "./src/carregar_dia"
import { database } from "./src/database"

const loadDays = async (dias:number) => {
    console.log('iniciou')
    // job.updateProgress({ state: 'obtendo subalineas' })
    const subalineas = (await database.table('codigos')
        .groupBy('subalinea')
        .select('subalinea'))
        .map(c => c.subalinea)

    // job.updateProgress({ state: 'obtendo codigos' })
    const codigos = (await database.table('codigos'))
        .map(c => c.codigo)
    console.log(codigos.length.toString())

    const lastDay = new Date()
    let currentDay = subDays(new Date(), dias)

    console.log('iniciando o processo')
    while (isBefore(currentDay, lastDay)) {
        currentDay = addDays(currentDay, 1)

        const formated = format(currentDay, 'y-MM-dd');


        for await (let subalinea of subalineas) {
            console.log(`${formated}:${subalinea}`)

            await loadDay(subalinea, formated, codigos)
        }
    }

    console.log('concluido')

    return true;
}

const loadDay = async (subalinea:string, day:string, codigos: string[]) => {
    
    try {
        console.log('carregando dia')
        const data = await carregarDia(day, subalinea);

        console.log('atualizando data')
        console.log(day, subalinea)
        if (data.length > 0) {
            await database.table('recolhimento')
                .insert(data.filter(d => codigos.includes(d.codigo!)))
                .onConflict()
                .merge()

            return data;
        }

    } catch (error) {
        throw new Error("Erro ao obter dados")
    }

    return [];
}


while (true) {
    await loadDays(10);
    console.log('aguardar 5 min')
    await Bun.sleep(300 * 1000)
}
// await Promise.all(workers.map(w => w.run()))