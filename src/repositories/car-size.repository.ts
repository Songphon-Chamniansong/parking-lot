import { injectable } from 'inversify';
import { Error } from 'mongoose';
import CarSize, { ICarSize } from '../db/models/car-size.model';
import { CarSizeData } from '../data/car-size.data';

export interface ICarSizeRepository {
    getAllCarSize(): Promise<CarSizeData[]>;
    getCarSize(size: string): Promise<CarSizeData>;
    createCarSize(product: CarSizeData): Promise<CarSizeData>;
    deleteCarSize(id: string): Promise<boolean>;
}

@injectable()
export class CarSizeRepository implements ICarSizeRepository {
    public async getAllCarSize(): Promise<CarSizeData[]> {
        const data = await CarSize.find();
        if (data && data.length > 0) {
            return data.map((x: ICarSize) => {
                return {
                    id: x.id,
                    size: x.size,
                }
            });
        } else {
            return [];
        }
    }
    public async getCarSize(size: string): Promise<CarSizeData> {
        const data = await CarSize.findOne({ size });
        if (data) {
            return {
                id: data._id,
                size: data.size
            };
        } else {
            return null;
        }
    }

    public async createCarSize(carSizeData: CarSizeData): Promise<CarSizeData> {
        const data = await CarSize.create(carSizeData);
        if (data) {
            return {
                id: data.id,
                size: data.size
            };
        } else {
            return null;
        }
    }

    public async deleteCarSize(id: string): Promise<boolean> {
        return CarSize.findOneAndDelete({ _id: id })
            .then(() => {
                return true;
            })
            .catch((error: Error) => {
                throw error;
            });
    }
}
