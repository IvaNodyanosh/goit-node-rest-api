import morgan from "morgan";
import contactsRouter from "./routes/contactsRouter.js";
import express from "express";
import cors from "cors";
import { mongoose } from "mongoose";
import { config } from "dotenv";

config()

mongoose.promise = global.promise;

const app = express();

app.use(cors());
app.use(express.json());

app.use(morgan("tiny"));

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Use api on routes: /api/tasks",
    data: "Not found",
  });
});

app.use((err, __, res, ___) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({
    status: "fail",
    code: 500,
    message: message,
    data: "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3000;
const uriDb = process.env.DB_HOST;

const connection = mongoose.connect(uriDb);
connection
.then(() => {
app.listen(PORT, () => {
console.log("Database connection successful");
});
})
.catch(err =>
console.log(`Server not connection. Error message: ${err.message}`),
);