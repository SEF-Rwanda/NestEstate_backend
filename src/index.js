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
import paymentRoutes from "./routes/paymentRoute";

dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());
app.use(cors());

dbConnection();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/properties", propertyRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/payments", paymentRoutes);

app.all("*", (req, res) => {
  res.json({
    message: "Route not found",
    status: HttpStatus.NOT_FOUND,
  });
});

const PORT = process.env.PORT | 5000;

app.listen(PORT, console.log(`Server Started on Port ${PORT}`));

export default app;
