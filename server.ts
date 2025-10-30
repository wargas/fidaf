// import './cron';
import { CronJob } from 'cron';
import app from './src/app';
import "./src/routes";
import { TaskRecolhimentos } from './src/tasks/task-recolhimentos';
import { TaskServidores } from './src/tasks/task-servidores';

const job = CronJob.from({
    cronTime: process.env.CRON||"",
    start: true,
    onTick: async () => {
        console.log("Iniciando tasks")
        await TaskServidores();
        await TaskRecolhimentos();
        console.log("Finalizando tasks")
    }
})


app.listen({
    port: 3333,
    host: '0.0.0.0'
})

app.server.on('listening', async (...args: any[]) => {

    console.log(`Server listening on PORT ${args[2]}`)


    // job.start()

    console.log("Próxima execução:", job.nextDate());

})
