import { addDays, format, isBefore, } from "date-fns"
import { database } from "./src/database"
import { carregarDia } from "./src/carregar_dia"

const codigos = (await database.table('codigos').select('codigo'))
    .map(c => c.codigo)

let currentDay = new Date("2024-01-02")
const lastDay = new Date()

while(isBefore(currentDay, lastDay)) {
    currentDay = addDays(currentDay,1)

    const formated = format(currentDay, 'y-MM-dd')
    
    for await (let codigo of codigos) {
        const data = await carregarDia(formated, codigo);

        if(data != null) {
            await database.table('recolhimento')
                .insert(data)
                .onConflict()
                .merge()
        }

    }
    console.log(formated)
}

