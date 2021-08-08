import { Request, Response, NextFunction } from 'express';
import { inject } from 'inversify';
import { BaseHttpController, controller, httpGet, httpPost } from 'inversify-express-utils';
import { JsonResult } from 'inversify-express-utils/dts/results';
import TYPES from '../config/types';
import { IParkingLotService } from '../services/parking-lot.service';

@controller('/parking-lot')
export class ParkingLotController extends BaseHttpController {
    constructor(@inject(TYPES.IParkingLotService) private parkingLotService: IParkingLotService) {
        super();
    }

    /**
     * Defalut Parking Lot API
     * @returns string
     */
    @httpGet('/')
    public get(): string {
        return 'Parking Lot';
    }

    /**
     * create new parking lot
     * @param req Request { code: string, size: string, range: number }
     * @param res Reponse
     * @param next NextFunction
     * @returns JsonResult
     */
    @httpPost('/')
    public async createParkingLot(req: Request, res: Response, next: NextFunction): Promise<JsonResult> {
        const content = await this.parkingLotService.createParkingLot(req);
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    /**
     * park the car
     * @param req Request { plateNumber: string, size: string, updateAt?: number, code: string }
     * @param res Response
     * @param next NextFunction
     * @returns JsonResult
     */
    @httpPost('/park')
    public async parkCar(req: Request, res: Response, next: NextFunction): Promise<JsonResult> {
        const content = await this.parkingLotService.parkACar(req);
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    /**
     * leave the slot
     * @param req Request { code: string }
     * @param res Response
     * @param next NextFunction
     * @returns JsonResult
     */
    @httpPost('/leave')
    public async leave(req: Request, res: Response, next: NextFunction): Promise<JsonResult> {
        const content = await this.parkingLotService.freeSlot(req);
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    /**
     * get status of parking lot
     * @param req Request { code }
     * @param res Response
     * @param next NextFunction
     * @returns JsonResult
     */
    @httpGet('/status/:code')
    public async status(req: Request, res: Response, next: NextFunction): Promise<JsonResult> {
        const content = await this.parkingLotService.getParkingLotStatus(req);
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    /**
     * get registration plate number list by car size
     * @param req Request { size }
     * @param res Response
     * @param next NextFunction
     * @returns JsonResult
     */
    @httpGet('/reg/:size')
    public async registerationPlate(req: Request, res: Response, next: NextFunction): Promise<JsonResult> {
        const content = await this.parkingLotService.getRegisterationPlate(req);
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    /**
     * get registration allocated slot number list by car size
     * @param req Request { size }
     * @param res Response
     * @param next NextFunction
     * @returns JsonResult
     */
    @httpGet('/allocated/:size')
    public async allocated(req: Request, res: Response, next: NextFunction): Promise<JsonResult> {
        const content = await this.parkingLotService.getAllocatedSlot(req);
        const statusCode = 200;
        return this.json(content, statusCode);
    }
}
