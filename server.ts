import './cron';
import app from './src/app';
import "./src/routes";

app.listen({
    port: 3333,
    host: '0.0.0.0'
})