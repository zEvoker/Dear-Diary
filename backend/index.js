import express from "express";
import {PORT , mongoDBURL} from "./config.js";
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

app.get('/', (request,response) => {
    console.log(request)
    return response.status(234)
})

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET','POST','PUT','DELETE'],
        allowedHeaders: ['Content-Type']
    })
)

mongoose.connect(mongoDBURL)
    .then(() => {
        console.log('app to db')
        app.listen(PORT, () => {
            console.log(`App is listening to : ${PORT}`)
        });
    })
    .catch((err) => {
        console.log(err)
    })