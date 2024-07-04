import express from "express";
import mongoose from 'mongoose';
import cors from 'cors';
import {PORT , mongoDBURL} from "./config.js";
import diaryRoutes from './routes/diaryRoutes.js';
import chatRoutes from "./routes/chatRoutes.js";

const app = express();
app.use(express.json());

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET','POST','PUT','DELETE'],
        allowedHeaders: ['Content-Type']
    })
)

app.get('/', (request,response) => {
    return response.status(234)
})

app.use('/diary', diaryRoutes);
app.use('/chat', chatRoutes);

mongoose.connect(mongoDBURL)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`App is listening to : ${PORT}`)
        });
    })
    .catch((err) => {
        console.log(err)
    })