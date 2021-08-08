import "reflect-metadata";
import MongoMemoryServer from "mongodb-memory-server-core/lib/MongoMemoryServer";
import "jest";
import { DbMock } from "../tests/utils/dbmock";
import ParkingLot, { IParkingLot } from '../db/models/parking-lot.model';

describe("Parking Lot Repository", () => {
    let mongod: MongoMemoryServer;

    beforeAll(async () => {
        mongod = await DbMock.initDbMock();
    });

    afterAll(async () => {
        setTimeout(() => {
            DbMock.stopDbMock();
        }, 4000)
    });

    // Before each method we need to truncate all products from db
    beforeEach(async () => {
        ParkingLot.deleteMany({}).then();
    });

    it("Should pass", async () => {
        expect(true).toEqual(true);
    });
});
