import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import userRouter from './routes/userRoutes.js';
import cors from 'cors';
import productRoute from './routes/productRoute.js';

dotenv.config();
const app  = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cors())


app.use('/api/v1/auth', userRouter)
app.use('/api/v1/products', productRoute)



const PORT =7788

app.listen(PORT, ()=>{
    console.log('Server is running on port 7788');
})

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log('DB connected'))
.catch(err => console.log(err))