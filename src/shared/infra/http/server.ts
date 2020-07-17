/* eslint-disable no-console */

import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'express-async-errors';

import '@shared/infra/typeorm';
import '@shared/container';
import routes from '@shared/infra/http/routes';
import logRequest from '@shared/infra/http/middlewares/logRequest';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

const app = express();

app.use(cors());
app.use(express.json());
app.use(logRequest);
app.use(routes);
app.use('/files', express.static(uploadConfig.tmpFolder));
app.use(errors());

app.use(
  (error: Error, request: Request, response: Response, _next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        messsage: error.message,
      });
    }

    console.log(error);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error.',
      errorDetail: error.message,
    });
  },
);

app.listen(3333, () => console.log('🚀 Server is running on port:3333!'));
