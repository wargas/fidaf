// import './cron';
import app from './src/app';
import "./src/routes";
import { workerLoadDays } from './src/workers';

app.listen({
    port: 3333,
    host: '0.0.0.0'
})

app.server.on('listening', async (...args:any[]) => {

    console.log(`Server listening on PORT ${args[2]}`)
    workerLoadDays.run()
    
})
