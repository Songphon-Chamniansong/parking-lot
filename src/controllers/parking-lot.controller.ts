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

    @httpPost('/park')
    public async parkCar(req: Request, res: Response, next: NextFunction): Promise<JsonResult> {
        const content = await this.parkingLotService.parkACar(req);
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpPost('/leave')
    public async leave(req: Request, res: Response, next: NextFunction): Promise<JsonResult> {
        const content = await this.parkingLotService.freeSlot(req);
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpGet('/status/:code')
    public async status(req: Request, res: Response, next: NextFunction): Promise<JsonResult> {
        const content = await this.parkingLotService.getParkingLotStatus(req);
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpGet('/reg/:size')
    public async registerationPlate(req: Request, res: Response, next: NextFunction): Promise<JsonResult> {
        const content = await this.parkingLotService.getRegisterationPlate(req);
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpGet('/allocated/:size')
    public async allocated(req: Request, res: Response, next: NextFunction): Promise<JsonResult> {
        const content = await this.parkingLotService.getAllocatedSlot(req);
        const statusCode = 200;
        return this.json(content, statusCode);
    }
}
