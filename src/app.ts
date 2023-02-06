// https://github.com/wpcodevo/jwt_authentication_authorization_node
require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import config from 'config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './utils/connectDB';
import RunDbSeeder from './utils/seederDB';
import userRouter from './modules/administration/user/user.route';
import authRouter from './modules/_auth/auth.route';
import tenantRouter from './modules/administration/tenant/tenant.route';
import roleRouter from './modules/administration/role/role.route';
import userRoleRouter from './modules/administration/userrole/userrole.route'
import permissionRouter from './modules/administration/permission/permission.route'
import organizationUnitRouter from './modules/common/organizationunit/organizationunit.route'
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from 'swagger-jsdoc';

const port = config.get<number>('port');

const app = express();

// swagger options
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "REST API for Swagger Documentation",
      version: "1.0.0",
    },
    schemes: ["http", "https"],
    servers: [{ url: `http://localhost:${port}/` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: [
    `${__dirname}/modules/administration/user/user.route.ts`,
    `${__dirname}/modules/administration/tenant/tenant.route.ts`,
    // TODO: diger route siniflari da eklenecek
  ],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware

// 1. Body Parser
app.use(express.json({ limit: '10kb' }));

// 2. Cookie Parser
app.use(cookieParser());

// 3. Logger
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// 4. Cors
app.use(
  cors({
    origin: config.get<string>('origin'),
    credentials: true,
  })
);

// 5. Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/tenant', tenantRouter);
app.use('/api/role', roleRouter);
app.use('/api/userrole', userRoleRouter);
app.use('/api/permission', permissionRouter);
app.use('/api/organizationUnit', organizationUnitRouter);

// Testing
app.get('/healthChecker', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to CodevoWeb😂😂👈👈',
  });
});

// UnKnown Routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  // TODO: Add Log, tercihen rapidmq ile mongo içerisine

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});


app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
  // 👇 call the connectDB function here
  connectDB();
  RunDbSeeder();
});
