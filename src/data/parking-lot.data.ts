import { IParkingLot } from '../db/models/parking-lot.model';

export interface ParkingLotData {
    id?: IParkingLot['_id'];
    carSizeId: IParkingLot['carSizeId'];
    code: IParkingLot['code'];
    isFree: IParkingLot['isFree'];
    plateNumber: IParkingLot['plateNumber'];
    range: IParkingLot['range'];
    updateAt: IParkingLot['updateAt'];
}

export interface UpdateParkingLotData {
    code: IParkingLot['code'];
    isFree: IParkingLot['isFree'];
    plateNumber: IParkingLot['plateNumber'];
    updateAt: IParkingLot['updateAt'];
}

export interface CreateParkingLot {
    code: string;
    size: string;
}