import express from "express";
import HttpStatus from "http-status";
import dotenv from "dotenv";
import cors from "cors";
import dbConnection from "./config/config";
import userRoutes from "./routes/userRouter";
import propertyRoutes from "./routes/propertyRoute";
import reportRoutes from "./routes/reportRoute";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../swagger";

dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());
app.use(cors());

dbConnection();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/properties", propertyRoutes);
app.use("/api/v1/reports", reportRoutes)

app.use("/", (req, res) => {
  res.json({
    message: "Welcome to the Nest estate API",
    status: HttpStatus.OK,
  });
});

const PORT = process.env.PORT | 5000;

app.listen(PORT, console.log(`Server Started on Port ${PORT}`));

export default app;
