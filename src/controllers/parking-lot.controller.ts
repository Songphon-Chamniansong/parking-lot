import { Request, Response, NextFunction } from 'express';
import { inject } from 'inversify';
import { BaseHttpController, controller, httpGet, httpPost } from 'inversify-express-utils';
import { JsonResult } from 'inversify-express-utils/dts/results';
import TYPES from '../constants/types';
import { IParkingLotService } from '../services/parking-lot.service';

@controller('/parking-lot')
export class ParkingLotController extends BaseHttpController {
    constructor(@inject(TYPES.IParkingLotService) private parkingLotService: IParkingLotService) {
        super();
    }

    @httpGet('/')
    public get(): string {
        return 'Parking Lot';
    }

    @httpPost('/')
    public async createParkingLot(req: Request, res: Response, next: NextFunction): Promise<JsonResult> {
        const content = await this.parkingLotService.createParkingLot(req);
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpPost('/parkcar')
    public async parkCar(req: Request, res: Response, next: NextFunction): Promise<JsonResult> {
        const content = await this.parkingLotService.parkCar(req);
        const statusCode = 200;
        return this.json(content, statusCode);
    }
}
