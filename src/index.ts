import express, { Request, Response } from 'express';
import cors from 'cors';
import config from '@config/config';
import { errorHandler } from '@middlewares/errorHandler.middleware';
import uploadRouter from '@routes/installer.route';
import connectDB from 'db/connect';

const app = express();
app.use(cors())
app.use(express.json({ limit: "160kb" }));
app.use(express.urlencoded({ extended: true, limit: "160kb" }));
app.use(express.static("public"));

app.get('/', (_: Request, res: Response) => {
  res.send('server runnning');
});

app.use("/api/v1/installer", uploadRouter);

app.use(errorHandler);

const start = async (): Promise<void> => {
  try {
    await connectDB(config.db_url)
    app.listen(config.port, (): void => {
      console.log(`Connected to database visit http://localhost:${config.port}`);
    });
  } catch (error) {
    console.log("can not run the server: ", error)
  }

};

start();
