// import './cron';
import app from './src/app';
import "./src/routes";


app.listen({
    port: 3333,
    host: '0.0.0.0'
})

app.server.on('listening', async (...args: any[]) => {

    console.log(`Server listening on PORT ${args[2]}`)


    // await queueLoadDays.upsertJobScheduler('cron', {
    //     pattern: process.env.CRON!,
        
    // }, {
    //     data: 10
    // })

    

})
