import { Schema, model, Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

const logSchema = new Schema<any>({
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

logSchema.pre('save', done => done());

logSchema.virtual('id').get(function(){
    return String(this._id);
});

logSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: Document, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

// Export the Mongoose model
export default model<any>('Log', logSchema);