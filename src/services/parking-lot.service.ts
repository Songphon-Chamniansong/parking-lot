import { injectable, inject, TargetTypeEnum } from 'inversify';
import TYPES from '../constants/types';
import { IParkingLotRepository } from '../repositories/parking-lot.repository';
import { Request } from 'express';
import { ParkingLotData } from '../data/parking-lot.data';
import { ICarSizeRepository } from '../repositories/car-size.repository';
import { JResult, JResultList } from '../data/result.data';

export interface IParkingLotService {
    createParkingLot(request: Request): Promise<JResult<boolean>>;
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
    public async createParkingLot(request: Request): Promise<JResult<boolean>> {
        const { code, size } = request.body;
        const oldCode = await this.parkingLotRepository.getParkingLot(code);
        if (oldCode) {
            return {
                result: false,
                errorMessage: 'Code is already used, Please use the new one',
                errorCode: 'E01'
            };
        }
        const sizeData = await this.carSizeRepository.getCarSize(size);
        if(!sizeData) {
            return {
                result: false,
                errorMessage: 'Car size is not support',
                errorCode: 'E02'
            };
        }

        const parkingLotData: ParkingLotData = {
            carSizeId: sizeData.id,
            code,
            isFree: true,
            plateNumber: '',
            updateAt: Date.now(),
        };
        const result = await this.parkingLotRepository.createParkingLot(parkingLotData);
        return {
            result,
            errorMessage: '',
            errorCode: ''
        };
    }

    public async parkACar(request: Request): Promise<JResult<ParkingLotData>> {
        const { plateNumber, size, updateAt, code } = request.body;
        if (code) {
            const parkingLot = await this.parkingLotRepository.getParkingLot(code);
            if (!parkingLot.isFree) {
                return {
                    result: false,
                    errorMessage: 'Parking Lot is not available to park.',
                    errorCode: 'E03'
                };
            }
            if (parkingLot.updateAt !== updateAt) {
                return {
                    result: false,
                    errorMessage: 'Your information is not up to date',
                    errorCode: 'E04'
                };
            }
            const updateParkingLot = {
                code,
                plateNumber,
                isFree: false,
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
            const sizeData = await this.carSizeRepository.getCarSize(size);
            const freeParkingLot = await this.parkingLotRepository.getParkingLotByCarSize(sizeData.id);
            if (!freeParkingLot || freeParkingLot.filter(x => x.isFree).length <= 0) {
                return {
                    result: false,
                    errorMessage: `Parking Lot is full for ${size} car`,
                    errorCode: 'E05',
                };
            } else {
                const updateParkingLot = {
                    code: freeParkingLot[0].code,
                    plateNumber,
                    isFree: false,
                    updateAt: Date.now()
                };
                const result = await this.parkingLotRepository.updateParkingLot(freeParkingLot[0].code, updateParkingLot);
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
        const { code, plateNumber } = request.body;
        const parkingLot = await this.parkingLotRepository.getParkingLot(code);
        if (plateNumber !== parkingLot.plateNumber) {
            return {
                result: false,
                errorMessage: 'plate number is not match for parking lot code',
                errorCode: 'E06',
            };
        }
        const updateParkingLot = {
            code,
            plateNumber,
            isFree: true,
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
                errorMessage: 'Code is not match for Parking Lot',
                errorCode: 'E07',
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
        const carSize: string = request.params.size;
        const sizeData = await this.carSizeRepository.getCarSize(carSize);
        if(!sizeData) {
            return {
                result: false,
                errorMessage: 'Car size is not support',
                errorCode: 'E02'
            };
        }
        const parkingLots = await this.parkingLotRepository.getParkingLotByCarSize(sizeData.id);
        const result = parkingLots.map( x => x.plateNumber);
        return {
            result: true,
            errorMessage: '',
            errorCode: '',
            value: result
        }
    }

    public async getAllocatedSlot(request: Request): Promise<JResultList<string>> {
        const carSize: string = request.params.size;
        const sizeData = await this.carSizeRepository.getCarSize(carSize);
        if(!sizeData) {
            return {
                result: false,
                errorMessage: 'Car size is not support',
                errorCode: 'E02'
            };
        }
        const parkingLots = await this.parkingLotRepository.getParkingLotByCarSize(sizeData.id);
        const result = parkingLots.filter(x => x.isFree).map(x => x.code);
        return {
            result: true,
            errorMessage: '',
            errorCode: '',
            value: result
        }
    }
}
