const TYPES = {
    // Service
    HomeService: Symbol.for('HomeService'),
    ProductsService: Symbol.for('ProductsService'),
    IParkingLotService: Symbol.for('IParkingLotService'),

    // Repositories
    IParkingLotRepository: Symbol.for('IParkingLotRepository'),
    ICarSizeRepository: Symbol.for('ICarSizeRepository'),
};

export default TYPES;
