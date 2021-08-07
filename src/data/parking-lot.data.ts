import { IParkingLot } from '../db/models/parking-lot.model';

export interface CreateParkingLot {
    code: IParkingLot['code'];
    size: IParkingLot['size'];
    plateNumber: IParkingLot['plateNumber'];
    updateAt: IParkingLot['updateAt'];
}