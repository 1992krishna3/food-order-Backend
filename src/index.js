import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import serverConfig from "./config/serverConfig.js";
import dbConnect from "./config/dbConfig.js";
import orderRouter from "./routes/v1/orderRoutes.js";
import userRouter from "./routes/v1/userRoutes.js";
import foodRoutes from "./routes/v1/foodRoutes.js"
import paymentRoutes from "./routes/v1/paymentRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import bodyParser from "body-parser";
import adminRouter from "./routes/v1/adminRoutes.js";



dotenv.config();

const app = express();

//Middleware to parse json bodies
app.use(bodyParser.json());


app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

//Define Routes
app.use('/api/v1/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/v1/foods', foodRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/cart',cartRouter);
app.use('/api/admin',adminRouter);



// Sample route
app.get('/', (req, res) => {
  res.send('Welcome to the Food Order App')
});

app.listen(serverConfig.Port, () => {
  console.log(`Example app listening on port ${serverConfig.Port}`);
  dbConnect();
  console.log("Db connected");
});