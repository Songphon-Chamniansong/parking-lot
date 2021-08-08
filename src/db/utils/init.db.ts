import CarSize from '../../db/models/car-size.model';
import ParkingLot from '../../db/models/parking-lot.model';

export class InitDataBase {
    static readonly CarSizeData = [
        {
            _id: '610f909450975571267199c8',
            size: 'small'
        },
        {
            _id: '610f909450975571267199c9',
            size: 'medium'
        },
        {
            _id: '610f909450975571267199ca',
            size: 'large'
        }
    ]
    static readonly ParkingLotData = [
        {
            code: 'A01',
            carSizeId: '610f909450975571267199c8',
            isFree: true,
            plateNumber: '',
            range: 5,
            updateAt: Date.now()
        },
        {
            code: 'A02',
            carSizeId: '610f909450975571267199c8',
            isFree: true,
            plateNumber: '',
            range: 3,
            updateAt: Date.now()
        },
        {
            code: 'A03',
            carSizeId: '610f909450975571267199c8',
            isFree: true,
            plateNumber: '',
            range: 4,
            updateAt: Date.now()
        },
        {
            code: 'B01',
            carSizeId: '610f909450975571267199c9',
            isFree: true,
            plateNumber: '',
            updateAt: Date.now()
        },
        {
            code: 'B02',
            carSizeId: '610f909450975571267199c9',
            isFree: true,
            plateNumber: '',
            range: 5,
            updateAt: Date.now()
        },
        {
            code: 'B03',
            carSizeId: '610f909450975571267199c9',
            isFree: true,
            plateNumber: '',
            range: 4,
            updateAt: Date.now()
        },
        {
            code: 'C01',
            carSizeId: '610f909450975571267199ca',
            isFree: true,
            plateNumber: '',
            range: 3,
            updateAt: Date.now()
        },
        {
            code: 'C02',
            carSizeId: '610f909450975571267199ca',
            isFree: true,
            plateNumber: '',
            range: 4,
            updateAt: Date.now()
        },
        {
            code: 'C03',
            carSizeId: '610f909450975571267199ca',
            isFree: true,
            plateNumber: '',
            range: 5,
            updateAt: Date.now()
        }
    ]
    /**
     * init data for first run
     */
    public static async init() {
        const carsize = await CarSize.find();
        if(!carsize || carsize.length <= 0) {
            // init data when CarSize have no data in database
            CarSize.insertMany(InitDataBase.CarSizeData);
        }
        const parkingLot = await ParkingLot.find();
        if (!parkingLot || parkingLot.length <= 0) {
            // init data when ParkingLot have no data in database
            ParkingLot.insertMany(InitDataBase.ParkingLotData);
        }
    }
}
