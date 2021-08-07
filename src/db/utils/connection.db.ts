import mongoose from 'mongoose';

export class DbConnection {
    public static async initConnection(dbUri: string) {
        await DbConnection.connect(dbUri);
    }

    public static async connect(connStr: string) {
       return mongoose.connect(connStr,
            { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true },
            ).then(() => {
                console.log(`Successfully connected`);
            }).catch((error) => {
                console.error('Error connecting to database: ', error);
                return process.exit(1);
            });
    }

    public static setAutoReconnect(connStr: string) {
        mongoose.connection.on('disconnected', () => DbConnection.connect(connStr));
    }

    public static async disconnect() {
       await mongoose.connection.close();
    }
}