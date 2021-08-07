import { injectable, inject } from 'inversify';
import TYPES from '../constants/types';
import { IParkingLotRepository } from '../repositories/parking-lot.repository';
import { Request } from 'express';
import { IParkingLot } from '../db/models/parking-lot.model';

export interface IParkingLotService {
    parkCar(request: Request): Promise<IParkingLot>
}

@injectable()
export class ParkingLotService implements IParkingLotService {
    constructor(@inject(TYPES.IParkingLotRepository) private parkingLotRepository: IParkingLotRepository) {}
    public async parkCar(request: Request): Promise<IParkingLot> {
        const body = request.body
        const result = await this.parkingLotRepository.createParkingLot({
            code: body.code,
            size: body.size,
            plateNumber: body.plateNumber,
            updateAt: Date.now()
        });
        return result;
    }
}
