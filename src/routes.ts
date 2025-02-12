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

app.get('/recolhimentos', async(req, res) => {

    const { inicio = '', fim = '', orderBy = 'data'} = req.query as any;

    const query = database.table('recolhimento')

    if(String(orderBy).startsWith('-')) {
        query.orderBy(String(orderBy).replace('-', ''), 'DESC')
    } else {
        query.orderBy(String(orderBy).replace('-', ''), 'ASC')
    }

    if(inicio) {
        query.where('data', '>=', inicio)
    }

    if(fim) {
        query.where('data', '<=', fim)
    }

    const data = await query;
        // .orderBy('data', 'desc')

    return data;
})

app.get('/ipca', async(_, res) => {
    const data = await database.table('ipca')
        .orderBy('mes', 'desc')

    return data;
})