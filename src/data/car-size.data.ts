import { ICarSize } from "../db/models/car-size.model";

export interface CarSizeData {
    id: ICarSize['_id'];
    size: ICarSize['size'];
}