import { cron } from "../cron";
import app from "./app";
import { database } from "./database";

app.get('/cron', (_, res) => {
   
    res.send({nextDate: cron.nextDate()})
})

app.get('/resumo', async(_, res) => {
    const data = await database.table('resumo')
        .orderBy('mes', 'desc')

    return data;
})

app.get('/correcao', async(_, res) => {
    const data = await database.table('correcao')
        .orderBy('mes', 'desc')

    return data;
})

app.get('/receitas', async(_, res) => {
    const data = await database.table('receitas')
        .orderBy('mes', 'desc')

    return data;
})

app.get('/ipca', async(_, res) => {
    const data = await database.table('ipca')
        .orderBy('mes', 'desc')

    return data;
})