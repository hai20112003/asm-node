import mongoose from "mongoose";
import express  from "express";
import productRouter from "./routers/product";
import categoryRouter from "./routers/category";

import authRouter from "./routers/auth"
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', productRouter)

app.use('/api', categoryRouter)

app.use('/api', authRouter)


mongoose.connect("mongodb://127.0.0.1:27017/asm");

export const viteNodeApp = app;