process.env.TZ = "UTC";
import args from 'args'
import { carregarMes } from './src/carregar_mes'
import { database } from './src/database';

const defaults = {
    ano: new Date().getFullYear(),
    mes: new Date().getMonth()+1
}

const flags = args
    .option('mes', 'Mes da receita')
    .option('ano', 'Ano corrente')
    .parse(Bun.argv)


const {mes, ano} = Object.assign(defaults, flags)
    
console.log(`lendo dados`)
const receitas = await carregarMes(ano, mes);

console.log(`salvando no banco de dados`)
await database.table('receitas').insert(receitas)
    .onConflict('id').merge()

console.log('concluido')

process.exit(0)