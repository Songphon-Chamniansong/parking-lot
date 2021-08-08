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
       return CarSize.find()
            .then((data: ICarSize[]) => {
                const result = data.map((x: ICarSize) => {
                    return {
                        id: x.id,
                        size: x.size,
                    }
                });
                return result;
            })
            .catch((error: Error) => {
                throw error;
            });
    }
    public async getCarSize(size: string): Promise<CarSizeData> {
        return CarSize.findOne({ size })
            .then((data: ICarSize) => {
                return {
                    id: data._id,
                    size: data.size
                };
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async createCarSize(carSizeData: CarSizeData): Promise<CarSizeData> {
        return CarSize.create(carSizeData)
            .then((data: ICarSize) => {
                return {
                    id: data.id,
                    size: data.size
                };
            })
            .catch((error: Error) => {
                throw error;
            });
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
