import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { ProcessConfigLoader } from './config/env';
import './controllers/home.controller';
import './controllers/parking-lot.controller';
import { DbConnection } from './db/utils/connection.db';
import { ContainerConfigLoader } from './config/container';
import express from 'express'

// Load process.env config
ProcessConfigLoader.Load('/dist/.env');

// Create connection string
process.env.DB_CONN_STR = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_DB_NAME}?retryWrites=true&w=majority`;

// load everything needed to the Container
const container = ContainerConfigLoader.Load();

DbConnection.initConnection(process.env.DB_CONN_STR).then(() => {
    DbConnection.setAutoReconnect(process.env.DB_CONN_STR);

    // start the server
    const server = new InversifyExpressServer(container);

    server.setConfig((app) => {
        app.use(express.urlencoded({extended: true}));
        app.use(express.json());
    });

    const serverInstance = server.build();
    serverInstance.listen(process.env.PORT, () => {
        console.log(`Server started on port ${process.env.PORT}`);
    });
});
