import mongoose, { Document, Schema } from 'mongoose';

export interface ICarSize extends Document {
    size: string;
}

const CarSizeSchema: Schema = new Schema({
    size: { type: String, required: true, unique: true },
});

export default mongoose.model<ICarSize>('Carsizes', CarSizeSchema);
