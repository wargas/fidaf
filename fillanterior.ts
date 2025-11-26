// import { addDays, format, isBefore, } from "date-fns"
import { addDays, format, isBefore } from "date-fns"
import { carregarDia } from "./src/carregar_dia"
import { database } from "./src/database"

// const data = await carregarDia('2024-12-31', '9811145110')


const subalineas = (await database.table('codigos')
    .groupBy('subalinea')
    .select('subalinea'))
    .map(c => c.subalinea)

const codigos = (await database.table('codigos'))
    .map(c => c.codigo)


let currentDay = new Date("2024-01-01")
const lastDay = new Date()

while(isBefore(currentDay, lastDay)) {
    currentDay = addDays(currentDay,1)

    const formated = format(currentDay, 'y-MM-dd')
    
    for await (let subalinea of subalineas) {
        const data = await carregarDia(formated, subalinea);

        if(data.length > 0) {
            await database.table('recolhimento')
                .insert(data.filter(d => codigos.includes(d.codigo)))
                .onConflict()
                .merge()
        }

    }
    console.log(formated)
}

