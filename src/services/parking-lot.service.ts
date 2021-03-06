import { injectable, inject } from 'inversify';
import TYPES from '../config/types';
import ERROR from '../config/error'
import { IParkingLotRepository } from '../repositories/parking-lot.repository';
import { Request } from 'express';
import { ParkingLotData } from '../data/parking-lot.data';
import { ICarSizeRepository } from '../repositories/car-size.repository';
import { JResult, JResultList } from '../data/result.data';

export interface IParkingLotService {
    createParkingLot(request: Request): Promise<JResult<ParkingLotData>>;
    parkACar(request: Request): Promise<JResult<ParkingLotData>>;
    freeSlot(request: Request): Promise<JResult<ParkingLotData>>;
    getParkingLotStatus(equest: Request): Promise<JResult<{ isAvailable: boolean }>>;
    getRegisterationPlate(request: Request): Promise<JResultList<string>>;
    getAllocatedSlot(request: Request): Promise<JResultList<string>>;
}

@injectable()
export class ParkingLotService implements IParkingLotService {
    constructor(
        @inject(TYPES.IParkingLotRepository) private parkingLotRepository: IParkingLotRepository,
        @inject(TYPES.ICarSizeRepository) private carSizeRepository: ICarSizeRepository,
    ) {}

    // function to create parking lot
    public async createParkingLot(request: Request): Promise<JResult<ParkingLotData>> {
        const { code, size, range }: { code: string, size: string, range: number } = request.body;
        // check is code used in database
        const oldCode = await this.parkingLotRepository.getParkingLot(code);
        if (oldCode) {
            return {
                result: false,
                errorMessage: ERROR.CodeUsed.message,
                errorCode: ERROR.CodeUsed.code
            };
        }
        // check is size correct
        const sizeData = await this.carSizeRepository.getCarSize(size.toLowerCase());
        if(!sizeData) {
            return {
                result: false,
                errorMessage: ERROR.SizeNotSupport.message,
                errorCode: ERROR.SizeNotSupport.code
            };
        }

        // create new parking lot
        const parkingLotData: ParkingLotData = {
            carSizeId: sizeData.id,
            code,
            isFree: true,
            plateNumber: '',
            range,
            updateAt: Date.now(),
        };
        const result = await this.parkingLotRepository.createParkingLot(parkingLotData);
        return {
            result: true,
            errorMessage: '',
            errorCode: '',
            value: result
        };
    }

    public async parkACar(request: Request): Promise<JResult<ParkingLotData>> {
        const { plateNumber, size, updateAt, code }: { plateNumber: string, size: string, updateAt: number, code: string } = request.body;
        // park specific parking lot
        if (code) {
            // check is parking lot available
            const parkingLot = await this.parkingLotRepository.getParkingLot(code);
            if (!parkingLot.isFree) {
                return {
                    result: false,
                    errorMessage: ERROR.ParkingLotIsFull.message,
                    errorCode: ERROR.ParkingLotIsFull.code
                };
            }
            // check is timestemp up to date
            if (parkingLot.updateAt !== updateAt) {
                return {
                    result: false,
                    errorMessage: ERROR.NotUpToDate.message,
                    errorCode: ERROR.NotUpToDate.code
                };
            }
            // set parking lot isFree to false, update plateNumber and update updateAt
            const updateParkingLot = {
                code,
                plateNumber,
                isFree: false,
                range: parkingLot.range,
                updateAt: Date.now()
            };
            const result = await this.parkingLotRepository.updateParkingLot(code, updateParkingLot);
            return {
                result: true,
                errorMessage: '',
                errorCode: '',
                value: result
            };
        } else {
            // get car size id
            const sizeData = await this.carSizeRepository.getCarSize(size.toLowerCase());
            const freeParkingLot = await this.parkingLotRepository.getParkingLotByCarSize(sizeData.id);
            if (!freeParkingLot || freeParkingLot.filter(x => x.isFree).length <= 0) {
                // parking lot is full
                return {
                    result: false,
                    errorMessage: ERROR.ParkingLotIsFull.message,
                    errorCode: ERROR.ParkingLotIsFull.code,
                };
            } else {
                // sort by range ascending
                const nearestParkingLot = freeParkingLot.sort((x,y) => (x.range > y.range) ? 1 : ((x.range > y.range) ? -1 : 0));
                // update parking lot object
                const updateParkingLot = {
                    code: nearestParkingLot[0].code,
                    plateNumber,
                    isFree: false,
                    range: nearestParkingLot[0].range,
                    updateAt: Date.now()
                };
                const result = await this.parkingLotRepository.updateParkingLot(nearestParkingLot[0].code, updateParkingLot);
                return {
                    result: true,
                    errorMessage: '',
                    errorCode: '',
                    value: result
                };
            }
        }
    }

    public async freeSlot(request: Request): Promise<JResult<ParkingLotData>> {
        const { code } = request.body;
        const parkingLot = await this.parkingLotRepository.getParkingLot(code);
        if (!parkingLot) {
            return {
                result: false,
                errorMessage: ERROR.CodeIsNotMatch.message,
                errorCode: ERROR.CodeIsNotMatch.code,
            };
        }
        // reset parking objecyt to default
        const updateParkingLot = {
            code,
            plateNumber: '',
            isFree: true,
            range: parkingLot.range,
            updateAt: Date.now()
        };
        const result = await this.parkingLotRepository.updateParkingLot(code, updateParkingLot);
        return {
            result: true,
            errorMessage: '',
            errorCode: '',
            value: result
        };
    }

    public async getParkingLotStatus(request: Request): Promise<JResult<{isAvailable: boolean}>> {
        const code: string = request.params.code;
        const parkingLot = await this.parkingLotRepository.getParkingLot(code);
        if (!parkingLot) {
            return {
                result: false,
                errorMessage: ERROR.CodeIsNotMatch.message,
                errorCode: ERROR.CodeIsNotMatch.code,
            };
        }
        return {
            result: true,
            errorMessage: '',
            errorCode: '',
            value: {
                isAvailable: parkingLot.isFree
            }
        };
    }

    public async getRegisterationPlate(request: Request): Promise<JResultList<string>> {
        const size: string = request.params.size || '';
        const sizeData = await this.carSizeRepository.getCarSize(size.toLowerCase());
        if(!sizeData) {
            return {
                result: false,
                errorMessage: ERROR.SizeNotSupport.message,
                errorCode: ERROR.SizeNotSupport.code
            };
        }
        const parkingLots = await this.parkingLotRepository.getParkingLotByCarSize(sizeData.id);
        // filter isFree equal false and return list of plate number
        const result = parkingLots.filter(x => !x.isFree).map(x => x.plateNumber);
        return {
            result: true,
            errorMessage: '',
            errorCode: '',
            value: result
        }
    }

    public async getAllocatedSlot(request: Request): Promise<JResultList<string>> {
        const size: string = request.params.size || '';
        const sizeData = await this.carSizeRepository.getCarSize(size.toLowerCase());
        if(!sizeData) {
            return {
                result: false,
                errorMessage: ERROR.SizeNotSupport.message,
                errorCode: ERROR.SizeNotSupport.code
            };
        }
        const parkingLots = await this.parkingLotRepository.getParkingLotByCarSize(sizeData.id);
        // filter isFree equal true and return list of parking lot code
        const result = parkingLots.filter(x => x.isFree).map(x => x.code);
        return {
            result: true,
            errorMessage: '',
            errorCode: '',
            value: result
        }
    }
}
