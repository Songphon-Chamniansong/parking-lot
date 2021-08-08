import 'reflect-metadata';
import 'jest';
import { IParkingLotService, ParkingLotService } from './parking-lot.service';
import { IParkingLotRepository, ParkingLotRepository } from '../repositories/parking-lot.repository';
import { ICarSizeRepository, CarSizeRepository } from '../repositories/car-size.repository';

describe('Parking Lot service', () => {
    const carSize: ICarSizeRepository = new CarSizeRepository();
    const parkingLotRepository: IParkingLotRepository = new ParkingLotRepository();
    const parkingLotService: IParkingLotService = new ParkingLotService(parkingLotRepository, carSize);

    const CarSizeData = [
        {
            id: '2f7d15b4-730b-406d-b043-7190b044006c',
            size: 'small'
        },
        {
            id: '48458778-c652-442d-b53d-fd4e0646aa05',
            size: 'medium'
        },
        {
            id: '9405ac4c-45aa-4978-a293-feea329a98a3',
            size: 'large'
        }
    ]

    const ParkingLotData = [
        {
            id: '2699daa9-5169-4509-a95b-489f45cdd37f',
            carSizeId: CarSizeData[0].id,
            code: 'A01',
            isFree: true,
            plateNumber: '',
            range: 5,
            updateAt: 1628261234376
        },
        {
            id: '848a5948-e07a-492b-8ede-d09232ea6483',
            carSizeId: CarSizeData[0].id,
            code: 'A02',
            isFree: false,
            plateNumber: 'A1-1234',
            range: 4,
            updateAt: 1628261234376
        },
        {
            id: '4c3420f0-098f-403b-9467-64f8a7f611c9',
            carSizeId: CarSizeData[1].id,
            code: 'A03',
            isFree: true,
            plateNumber: '',
            range: 5,
            updateAt: 1628261234376
        },
        {
            id: '6ed8f10a-7406-41a8-b86e-9b5c3a553662',
            carSizeId: CarSizeData[1].id,
            code: 'A04',
            isFree: false,
            plateNumber: 'B2-3456',
            range: 4,
            updateAt: 1628261234376
        },
        {
            id: '41439171-d2d8-417e-bf4d-1bae443522fa',
            carSizeId: CarSizeData[2].id,
            code: 'A05',
            isFree: false,
            plateNumber: 'C3-4567',
            range: 5,
            updateAt: 1628261234376
        },
        {
            id: '362b00d9-c59d-42e7-97f6-931ee4e95081',
            carSizeId: CarSizeData[2].id,
            code: 'A06',
            isFree: false,
            plateNumber: 'D4-5678',
            range: 4,
            updateAt: 1628261234376
        }
    ]

    const spyCreateParkingLot = jest.spyOn(parkingLotRepository, "createParkingLot");
    spyCreateParkingLot.mockImplementation((data: any) => {
        return Promise.resolve(data);
    });
    const spyGetParkingLotByCarSize = jest.spyOn(parkingLotRepository, "getParkingLotByCarSize");
    spyGetParkingLotByCarSize.mockImplementation((data: string) => {
        const result = ParkingLotData.filter(x => x.carSizeId === data);
        if (result.length <= 0) {
            return Promise.resolve(null);
        }
        return Promise.resolve(result);
    });
    const spyGetParkingLot = jest.spyOn(parkingLotRepository, "getParkingLot");
    spyGetParkingLot.mockImplementation((code: string): any => {
        const result = ParkingLotData.filter(x => x.code === code);
        if (result.length <= 0) {
            return Promise.resolve(null);
        }
        return Promise.resolve(result[0]);
    });
    const spyUpdateParkingLot = jest.spyOn(parkingLotRepository, "updateParkingLot");
    spyUpdateParkingLot.mockImplementation((code: string, parkingLot: any): any => {
        return Promise.resolve(parkingLot);
    });

    const spyGetCarSize = jest.spyOn(carSize, "getCarSize");
    spyGetCarSize.mockImplementation((size: string) => {
        const data = CarSizeData.filter(x => size === x.size);
        if (data.length <= 0) {
            return Promise.resolve(null)
        }
        return Promise.resolve(data[0])
    })

    describe('createParkingLot', () => {
        it("Should call createParkingLot with current time", async () => {
            Date.now = jest.fn(() => 1628261234377)
            const response = await parkingLotService.createParkingLot({
                body: {
                    code: "A21",
                    size: "small",
                    range: 6,
                }
            } as any);
            expect(spyCreateParkingLot).toBeCalledWith({
                carSizeId: '2f7d15b4-730b-406d-b043-7190b044006c',
                code: "A21",
                isFree: true,
                plateNumber: '',
                range: 6,
                updateAt: Date.now(),
            });
        });
        it("Should return error, car size is not support", async () => {
            const response = await parkingLotService.createParkingLot({
                body: {
                    code: "A21",
                    size: "XXX",
                    range: 6,
                }
            } as any);
            expect(response).toEqual({
                    result: false,
                    errorMessage: 'Car size is not support',
                    errorCode: 'E02'
                }
            );
        });
        it("Should return error, code is already exists", async () => {
            const response = await parkingLotService.createParkingLot({
                body: {
                    code: "A01",
                    size: "small",
                    range: 6,
                }
            } as any);
            expect(response).toEqual(
                {
                    result: false,
                    errorMessage: 'Code is already used, Please use the new one',
                    errorCode: 'E01'
                }
            );
        });
    });

    describe('parkCar', () => {
        Date.now = jest.fn(() => 1628261234377)
        it("Should return true", async () => {
            const result = await parkingLotService.parkACar({ body: { plateNumber: 'B2-1234', size: 'small' } } as any);
            expect(spyUpdateParkingLot).toBeCalledWith('A01',
                {
                    code: 'A01',
                    plateNumber: 'B2-1234',
                    isFree: false,
                    range: 5,
                    updateAt: Date.now()
                }
            );
        });
        it("Should return false, Your information is not up to date", async () => {
            const result = await parkingLotService.parkACar({ body: { plateNumber: 'B2-1234', size: 'XXX', updateAt: 77777, code: 'A01' } } as any);
            expect(result).toEqual(
                {
                    result: false,
                    errorMessage: 'Your information is not up to date',
                    errorCode: 'E04'
                }
            );
        });
        it("Should return false, Parking Lot is full for large car", async () => {
            const result = await parkingLotService.parkACar({ body: { plateNumber: 'B2-1234', size: 'large' } } as any);
            expect(result).toEqual(
                {
                    result: false,
                    errorMessage: 'Parking Lot is full for large car',
                    errorCode: 'E05',
                }
            );
        });
        it("Should return false, Parking Lot is not available to park.", async () => {
            const result = await parkingLotService.parkACar({ body: { code: 'A02', plateNumber: 'B2-1234' } } as any);
            expect(result).toEqual(
                {
                    result: false,
                    errorMessage: 'Parking Lot is not available to park.',
                    errorCode: 'E03'
                }
            );
        });
    });

    describe('freeSlot', () => {
        it("Should call UpdateParkingLot", async () => {
            const result = await parkingLotService.freeSlot({ body: { code: 'A02' } } as any);
            Date.now = jest.fn(() => 1628261234377)
            expect(spyUpdateParkingLot).toBeCalledWith('A02',
                {
                    code: 'A02',
                    plateNumber: '',
                    isFree: true,
                    range: 4,
                    updateAt: Date.now()
                }
            );
        });
        it("Should call false, Parking Lot code is not match", async () => {
            const result = await parkingLotService.freeSlot({ body: { code: 'A44' } } as any);
            expect(result).toEqual(
                {
                    result: false,
                    errorMessage: 'Parking Lot code is not match',
                    errorCode: 'E06',
                }
            );
        });
    });

    describe('getParkingStatus', () => {
        it("Should return parking slot status", async () => {
            const result = await parkingLotService.getParkingLotStatus({ params: { code: 'A01' }} as any);
            expect(result).toEqual(
                {
                    result: true,
                    errorMessage: '',
                    errorCode: '',
                    value: {
                        isAvailable: true
                    }
                }
            );
        });
        it("Should return false, Code is not match for Parking Lot", async () => {
            const result = await parkingLotService.getParkingLotStatus({ params: { code: 'A21' }} as any);
            expect(result).toEqual(
                {
                    result: false,
                    errorMessage: 'Code is not match for Parking Lot',
                    errorCode: 'E07',
                }
            );
        });
    });

    describe('getRegisterationPlate', () => {
        it("Should return all plant number in parking lot by car size", async () => {
            const result = await parkingLotService.getRegisterationPlate({ params: { size: 'large' }} as any);
            expect(result).toEqual(
                {
                    result: true,
                    errorCode: '',
                    errorMessage: '',
                    value: [
                        'C3-4567', 'D4-5678'
                    ]
                }
            );
        });

        it("Should return false, Car size is not support", async () => {
            const result = await parkingLotService.getRegisterationPlate({ params: { size: 'XXX' }} as any);
            expect(result).toEqual(
                {
                    result: false,
                    errorMessage: 'Car size is not support',
                    errorCode: 'E02'
                }
            );
        });
    });

    describe('getAllocatedSlot', () => {
        it("Should return all allocated slot in parking lot by car size", async () => {
            const result = await parkingLotService.getAllocatedSlot({ params: { size: 'small' }} as any);
            expect(result).toEqual(
                {
                    result: true,
                    errorCode: '',
                    errorMessage: '',
                    value: [
                        'A01'
                    ]
                }
            );
        });
        it("Should return false, Car size is not support", async () => {
            const result = await parkingLotService.getAllocatedSlot({ params: { size: 'XXX' }} as any);
            expect(result).toEqual(
                {
                    result: false,
                    errorMessage: 'Car size is not support',
                    errorCode: 'E02'
                }
            );
        });
    });
});
