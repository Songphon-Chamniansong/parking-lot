import { HomeService } from '../services/home.service';
import { Container } from 'inversify';
import { IParkingLotRepository, ParkingLotRepository } from '../repositories/parking-lot.repository';
import { ICarSizeRepository, CarSizeRepository } from '../repositories/car-size.repository';
import { IParkingLotService, ParkingLotService } from '../services/parking-lot.service';
import TYPES from './types';

export class ContainerConfigLoader {
    /**
     * register type and interface
     * @returns Container
     */
    public static Load(): Container {
        const container = new Container();
        // example data
        // container.bind<Interface>(TYPES.Interface).to(Class);

        // binding services
        container.bind<HomeService>(TYPES.HomeService).to(HomeService);
        container.bind<IParkingLotService>(TYPES.IParkingLotService).to(ParkingLotService);

        // binding repositories
        container.bind<IParkingLotRepository>(TYPES.IParkingLotRepository).to(ParkingLotRepository);
        container.bind<ICarSizeRepository>(TYPES.ICarSizeRepository).to(CarSizeRepository);
        return container;
    }
}
