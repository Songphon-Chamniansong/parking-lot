import mongoose, { Document, Schema } from 'mongoose';

export interface IParkingLot extends Document {
    code: string;
    size: string;
    plateNumber: string;
    updateAt: number;
}

const ParkingLotSchema: Schema = new Schema({
    code: { type: String, required: false },
    size: { type: String, required: true },
    plateNumber: { type: String },
    updateAt: { type: Number },
});

export default mongoose.model<IParkingLot>('ParkingLots', ParkingLotSchema);
