import "dotenv/config"
import express from 'express'
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import authRoutes from "./routes/auth.routes.js"
const app = express();
app.use(express.json());
app.use(loggerMiddleware);

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{console.log(`SERVER RUNNING IN PORT ${PORT}`)});
