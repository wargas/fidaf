import { cron } from "../cron";
import app from "./app";
import { database } from "./database";

app.get('/cron', (_, res) => {
    res.send({nextDate: cron.nextDate()})
})

app.get('/resumo', async(_, res) => {
    const data = await database.table('resumo')

    return data;
})