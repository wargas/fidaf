import _, { range, uniqBy } from "lodash";
import { carregarDia } from "./src/carregar_dia";
import { database } from "./src/database";
import { formatDate, subDays } from "date-fns";


const dias = range(1, 11).map(d => subDays(new Date(), d)).map(d => formatDate(d, 'y-MM-dd'))

const subalineas = await database.table('codigos')
    .groupBy('subalinea')
    .select('subalinea')


const data = dias.flatMap(dia => subalineas.map(({ subalinea }) => ({ dia, subalinea })))

const codigos = (await database.table('codigos'))
    .map(c => String(c.codigo));

console.time('s')

for await (const items of _.chunk(data, 20)) {
    const result = await Promise.all(
        items.map(async ({ dia, subalinea }) => {
            let attemps = 0
            while (true) {
                try {
                    const data = await carregarDia(dia, subalinea)

                    const items = data.filter(d => codigos.includes(d.codigo!));

                    if (items.length > 0) {
                        await database.table('recolhimento')
                            .insert(items)
                            .onConflict()
                            .merge()

                        return data;
                    }

                    console.log(dia, subalinea)

                    break;
                } catch (error) {
                    attemps++

                    if (attemps > 3) {
                        console.log("erro em", dia, subalinea)
                        break;
                    }
                }
            }

            return true;
        })
    )

    console.log(uniqBy(items, 'dia').map(d => d.dia).join(","))
}

console.timeEnd('s')

process.exit(0)