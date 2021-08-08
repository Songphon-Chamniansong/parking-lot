import { injectable } from 'inversify';
import { Error } from 'mongoose';
import ParkingLot, { IParkingLot } from '../db/models/parking-lot.model';
import { UpdateParkingLotData, ParkingLotData } from '../data/parking-lot.data';

export interface IParkingLotRepository {
    getAllParkingLot(): Promise<ParkingLotData[]>;
    getParkingLotByCarSize(carSizeId: string): Promise<ParkingLotData[]>;
    getParkingLot(code: string): Promise<ParkingLotData>;
    createParkingLot(parkingLot: ParkingLotData): Promise<ParkingLotData>;
    updateParkingLot(code: string, parkingLot: UpdateParkingLotData): Promise<ParkingLotData>;
    deleteParkingLot(id: string): Promise<boolean>;
}

@injectable()
export class ParkingLotRepository implements IParkingLotRepository {
    public async getAllParkingLot(): Promise<ParkingLotData[]> {
        const data = await ParkingLot.find();
        if (data && data.length > 0) {
            return data.map((x: IParkingLot) => {
                return {
                    id: x.id,
                    carSizeId: x.carSizeId,
                    code: x.code,
                    isFree: x.isFree,
                    plateNumber: x.plateNumber,
                    updateAt: x.updateAt,
                }
            });
        } else {
            return [];
        }
    }

    public async getParkingLotByCarSize(carSizeId: string): Promise<ParkingLotData[]> {
        const data = await ParkingLot.find({ carSizeId });
        if (data && data.length > 0) {
            return data.map((x: IParkingLot) => {
                return {
                    id: x.id,
                    carSizeId: x.carSizeId,
                    code: x.code,
                    isFree: x.isFree,
                    plateNumber: x.plateNumber,
                    updateAt: x.updateAt,
                }
            });
        } else {
            return [];
        }
    }

    public async getParkingLot(code: string): Promise<ParkingLotData> {
        const data = await ParkingLot.findOne({ code });
        if (data) {
            return {
                id: data.id,
                carSizeId: data.carSizeId,
                code: data.code,
                isFree: data.isFree,
                plateNumber: data.plateNumber,
                updateAt: data.updateAt,
            }
        } else {
            return null;
        }
    }

    public async createParkingLot(parkingLot: ParkingLotData): Promise<ParkingLotData> {
        const data = await ParkingLot.create(parkingLot);
        if (data) {
            return {
                id: data.id,
                carSizeId: data.carSizeId,
                code: data.code,
                isFree: data.isFree,
                plateNumber: data.plateNumber,
                updateAt: data.updateAt,
            }
        } else {
            return null;
        }
    }

    public async updateParkingLot(code: string, parkingLot: UpdateParkingLotData): Promise<ParkingLotData> {
        const data = await ParkingLot.findOneAndUpdate({ code }, parkingLot, { new: true });
        if (data) {
            return {
                id: data._id,
                carSizeId: data.carSizeId,
                code: data.code,
                isFree: data.isFree,
                plateNumber: data.plateNumber,
                updateAt: data.updateAt
            };
        } else {
            return null;
        }
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
