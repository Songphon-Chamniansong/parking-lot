import mongoose, { Document, Schema } from 'mongoose';
import { ICarSize } from './car-size.model';

export interface IParkingLot extends Document {
    code: string;
    carSizeId: ICarSize['_id'];
    isFree: boolean;
    plateNumber: string;
    range: number;
    updateAt: number;
}

const ParkingLotSchema: Schema = new Schema({
    code: { type: String, required: false },
    carSizeId: { type: Schema.Types.ObjectId, required: true },
    isFree: { type: Boolean, default: false },
    plateNumber: { type: String, default: '' },
    range: { type: Number },
    updateAt: { type: Number },
});

export default mongoose.model<IParkingLot>('ParkingLots', ParkingLotSchema);
