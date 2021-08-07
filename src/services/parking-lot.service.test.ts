import 'reflect-metadata';
import 'jest';
import { IParkingLotService, ParkingLotService } from './parking-lot.service';
import { IParkingLotRepository, ParkingLotRepository } from '../repositories/parking-lot.repository';

describe('Parking Lot service', () => {
    let parkingLotService: IParkingLotService;
    let parkingLotRepository: IParkingLotRepository;

    beforeAll(async () => {
        parkingLotRepository = new ParkingLotRepository();
        parkingLotService = new ParkingLotService(parkingLotRepository);
    });

    it("Should test getProducts return content on success", async () => {
        const mockSpy = jest.spyOn(parkingLotRepository, "createParkingLot");
        mockSpy.mockImplementation((data: any) => {
            return Promise.resolve(data);
        });
        Date.now = jest.fn(() => 1628261234376)
        const response = await parkingLotService.parkCar({
            body: {
                code: "A21",
                size: "small",
                plateNumber: ""
            }
        } as any);
        expect(mockSpy).toBeCalledWith({
            code: "A21",
            size: "small",
            plateNumber: "",
            updateAt: 1628261234376
        });
    });
});
