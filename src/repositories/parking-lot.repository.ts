import { injectable } from 'inversify';
import { Error } from 'mongoose';
import ParkingLot, { IParkingLot } from '../db/models/parking-lot.model';
import { UpdateParkingLotData, ParkingLotData } from '../data/parking-lot.data';

export interface IParkingLotRepository {
    getAllParkingLot(): Promise<ParkingLotData[]>;
    getParkingLotByCarSize(carSizeId: string): Promise<ParkingLotData[]>;
    getParkingLot(code: string): Promise<ParkingLotData>;
    createParkingLot(parkingLot: ParkingLotData): Promise<boolean>;
    updateParkingLot(code: string, parkingLot: UpdateParkingLotData): Promise<ParkingLotData>;
    deleteParkingLot(id: string): Promise<boolean>;
}

@injectable()
export class ParkingLotRepository implements IParkingLotRepository {
    public async getAllParkingLot(): Promise<ParkingLotData[]> {
        return ParkingLot.find()
            .then((data: IParkingLot[]) => {
                const result = data.map((x: IParkingLot) => {
                    return {
                        id: x.id,
                        carSizeId: x.carSizeId,
                        code: x.code,
                        isFree: x.isFree,
                        plateNumber: x.plateNumber,
                        updateAt: x.updateAt,
                    }
                });
                return result;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getParkingLotByCarSize(carSizeId: string): Promise<ParkingLotData[]> {
        return ParkingLot.find({ carSizeId })
            .then((data: IParkingLot[]) => {
                return data.map((x: IParkingLot) => {
                    return {
                        id: x.id,
                        carSizeId: x.carSizeId,
                        code: x.code,
                        isFree: x.isFree,
                        plateNumber: x.plateNumber,
                        updateAt: x.updateAt,
                    }
                })
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getParkingLot(code: string): Promise<ParkingLotData> {
        return ParkingLot.findOne({ code })
            .then((data: IParkingLot) => {
                return {
                    id: data.id,
                    carSizeId: data.carSizeId,
                    code: data.code,
                    isFree: data.isFree,
                    plateNumber: data.plateNumber,
                    updateAt: data.updateAt,
                };
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async createParkingLot(parkingLot: ParkingLotData): Promise<boolean> {
        return ParkingLot.create(parkingLot)
            .then((data: IParkingLot) => {
                return true;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async updateParkingLot(code: string, parkingLot: UpdateParkingLotData): Promise<ParkingLotData> {
        return ParkingLot.findOneAndUpdate({ code }, parkingLot, { new: true })
            .then((data: IParkingLot) => {
                return {
                    id: data._id,
                    carSizeId: data.carSizeId,
                    code: data.code,
                    isFree: data.isFree,
                    plateNumber: data.plateNumber,
                    updateAt: data.updateAt
                };
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async deleteParkingLot(id: string): Promise<boolean> {
        return ParkingLot.findOneAndDelete({ _id: id })
            .then(() => {
                return true;
            })
            .catch((error: Error) => {
                throw error;
            });
    }
}
