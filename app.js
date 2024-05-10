import morgan from "morgan";
import contactsRouter from "./routes/contactsRouter.js";
import usersRouter from "./routes/usersRouter.js";
import express from "express";
import cors from "cors";
import { mongoose } from "mongoose";
import { config } from "dotenv";

config();

mongoose.promise = global.promise;

const app = express();

app.use(cors());
app.use(express.json());

app.use(morgan("tiny"));

app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);

app.use((_, res, __) => {
  res.status(404).json({
    message: "Use api on routes: /api/contacts",
  });
});

app.use((err, __, res, ___) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({
    message,
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
  .catch((err) =>
    console.log(`Server not connection. Error message: ${err.message}`)
  );
