import { injectable } from 'inversify';
import { Error } from 'mongoose';
import ParkingLot, { IParkingLot } from '../db/models/parking-lot.model';
import { CreateParkingLot } from '../data/parking-lot.data';

export interface IParkingLotRepository {
    getAllParkingLot(): Promise<IParkingLot[]>;
    getParkingLot(id: string): Promise<IParkingLot[]>;
    createParkingLot(product: CreateParkingLot): Promise<IParkingLot>;
    updateParkingLot(id: string, product: CreateParkingLot): Promise<IParkingLot>;
    deleteParkingLot(id: string): Promise<boolean>;
}

@injectable()
export class ParkingLotRepository implements IParkingLotRepository {
    public async getAllParkingLot(): Promise<IParkingLot[]> {
       return ParkingLot.find()
            .then((data: IParkingLot[]) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getParkingLot(id: string): Promise<IParkingLot[]> {
        return ParkingLot.find({_id: id})
            .then((data: IParkingLot[]) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async createParkingLot(product: CreateParkingLot): Promise<IParkingLot> {
        return ParkingLot.create(product)
            .then((data: IParkingLot) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async updateParkingLot(id: string, product: CreateParkingLot): Promise<IParkingLot> {
        return ParkingLot.findOneAndUpdate({_id: id}, product, {new: true})
            .then((data: IParkingLot) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async deleteParkingLot(id: string): Promise<boolean> {
        return ParkingLot.findOneAndDelete({_id: id})
            .then(() => {
                return true;
            })
            .catch((error: Error) => {
                throw error;
            });
    }
}
