import MongoMemoryServer from 'mongodb-memory-server-core/lib/MongoMemoryServer';
import { DbConnection } from '../../db/utils/connection.db';

export class DbMock {
    public static mongod: MongoMemoryServer;

    public static async initDbMock() {
        DbMock.mongod = await MongoMemoryServer.create({
            instance: {
                dbName: process.env.DB_DB_NAME,
                ip: process.env.DB_IP,
                port: parseInt(process.env.DB_PORT, 10)
            }
        });

        // ensures MongoMemoryServer is up
        const dbUri = DbMock.mongod.getUri();
        console.log(`DbMock is starting on:  ${dbUri}`)
        await DbConnection.initConnection(dbUri);
        return DbMock.mongod;
    }

    public static async stopDbMock() {
        await DbConnection.disconnect();
        await DbMock.mongod.stop();
    }
}
