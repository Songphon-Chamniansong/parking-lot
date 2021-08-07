import 'reflect-metadata';
import 'jest';
import { IParkingLotService, ParkingLotService } from './parking-lot.service';
import { IParkingLotRepository, ParkingLotRepository } from '../repositories/parking-lot.repository';

describe('Parking Lot service', () => {
    const parkingLotRepository: IParkingLotRepository = new ParkingLotRepository();
    const parkingLotService: IParkingLotService = new ParkingLotService(parkingLotRepository);

    describe('createParkingLot', () => {
        const mockCreateParkingLot = jest.spyOn(parkingLotRepository, "createParkingLot");
        mockCreateParkingLot.mockImplementation((data: any) => {
            return Promise.resolve(data);
        });
        const mockGetParkingLotByCode = jest.spyOn(parkingLotRepository, "getParkingLotByCode");
        mockGetParkingLotByCode.mockImplementation((data: any) => {
            return Promise.resolve(data);
        });
        it("Should call createParkingLot with current time", async () => {
            Date.now = jest.fn(() => 1628261234376)
            const response = await parkingLotService.createParkingLot({
                body: {
                    code: "A21",
                    size: "small",
                    plateNumber: ""
                }
            } as any);
            expect(mockCreateParkingLot).toBeCalledWith({
                code: "A21",
                size: "small",
                plateNumber: "",
                updateAt: 1628261234376
            });
        });
        it("Should return error, car size is not support", async () => {
            Date.now = jest.fn(() => 1628261234376)
            const response = await parkingLotService.createParkingLot({
                body: {
                    code: "A21",
                    size: "xxx",
                    plateNumber: ""
                }
            } as any);
            expect(response).toEqual(
                {
                    result: false,
                    message: 'Car size is not support'
                }
            );
        });
        it("Should return error, code is already exists", async () => {
            Date.now = jest.fn(() => 1628261234376)
            const response = await parkingLotService.createParkingLot({
                body: {
                    code: "A00",
                    size: "small",
                    plateNumber: ""
                }
            } as any);
            expect(response).toEqual(
                {
                    result: false,
                    message: 'Code is already exists'
                }
            );
        });
    });

    describe('parkCar', () => {
        it("Should return false, car size is not match", async () => {
            const result = await parkingLotService.parkCar({ body: { code: 'A21', size: 'big' } } as any);
            expect(result).toEqual(
                {
                    result: false,
                    message: 'Car size is not match'
                }
            );
        });

        it("Should return false, parking lot is not available", async () => {
            const result = await parkingLotService.parkCar({ body: { code: 'A22', size: 'small' } } as any);
            expect(result).toEqual(
                {
                    result: false,
                    message: 'Parking lot is not available'
                }
            );
        });

        it("Should return true", async () => {
            const result = await parkingLotService.parkCar({ body: { code: 'A21', size: 'small' } } as any);
            expect(result).toEqual(
                {
                    result: true,
                    message: ''
                }
            );
        });
    });

    describe('freeSlot', () => {
        it("Should return true", async () => {
            const result = await parkingLotService.freeSlot({ query: { code: 'A21', plateNumber: 'AB-1234' } } as any);
            expect(result).toEqual(
                {
                    result: false,
                    message: ''
                }
            );
        });
    });

    describe('getParkingStatus', () => {
        it("Should return parking slot data", async () => {
            const result = await parkingLotService.freeSlot({ query: { code: 'A21' }} as any);
            expect(result).toEqual(
                {
                    result: true,
                    message: '',
                    value: {
                        code: 'A21',
                        size: 'small',
                        isFree: true,
                        updateAt: 777777
                    }
                }
            );
        });
    });

    describe('getRegisteration', () => {
        it("Should return all plant number in parking lot by car size", async () => {
            const result = await parkingLotService.getRegisteration({ query: { size: 'small' }} as any);
            expect(result).toEqual(
                {
                    result: true,
                    message: '',
                    value: [
                        'A21', 'A22', 'A23', 'A24'
                    ]
                }
            );
        });
    });

    describe('getAllocatedSlot', () => {
        it("Should return all allocated slot in parking lot by car size", async () => {
            const result = await parkingLotService.getRegisteration({ query: { size: 'small' }} as any);
            expect(result).toEqual(
                {
                    result: true,
                    message: '',
                    value: [
                        {
                            code: 'A21',
                            size: 'small',
                            isFree: true,
                            updateAt: 777777
                        },
                        {
                            code: 'A22',
                            size: 'big',
                            isFree: true,
                            updateAt: 777777
                        }
                    ]
                }
            );
        });
    });
});
