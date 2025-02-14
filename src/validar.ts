import { carregarIntervalo } from "./carregar_intervalo";
import { database } from "./database";
import _ from 'lodash';

const subalineas = (await database.table('codigos').groupBy('subalinea').select('subalinea'))
    .map(s => s.subalinea)

for await (const subalinea of subalineas) {

    const data = await carregarIntervalo(subalinea, '2025-01-01', '2025-12-31');

    if(data.length > 0) {

        await database.table('validador')
        .insert(data.map(d => ({ codigo: d.codigo, valor: d.valor })))
        .onConflict('codigo').merge()
        
    }
    console.log(subalinea)
}

process.exit(0)