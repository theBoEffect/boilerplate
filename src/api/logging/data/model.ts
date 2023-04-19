import { Schema, model, Document } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { DataObject } from './type';

// update this for your collection name
const COLLECTION_NAME = 'logs';

// actual parameters need to be updated for you data model
const modelSchema = new Schema<DataObject>({
    thrown: {
        type: Date,
        default: Date.now,
        expires: '30d'
    },
    code: {
        type: String,
        default: 'LOG',
        enum: ['ERROR', 'NOTIFY', 'SUCCESS', 'LOG', 'HTTP']
    },
    message: {
        type: String,
        required: true
    },
    details: {
        type: Object,
        required: false
    },
    _id: {
        type: String,
        default: uuid
    }
},{
    _id: false
});

modelSchema.pre('save', done => done());

modelSchema.virtual('id').get(function(){
    return String(this._id);
});

modelSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: Document, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

// Export the Mongoose model
export default model<DataObject>(COLLECTION_NAME, modelSchema);