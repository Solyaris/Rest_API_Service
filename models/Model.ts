import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';

export interface IUser extends Document {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

export interface IEvent extends Document {
    id: number;
    type: EventType;
    date: number; // JS-timestamp
    title: string;
    description: string;
}

export enum EventType {
    Webinar = 'WEBINAR',
    Lecture = 'LECTURE',
    PracticalClass = 'PRACTICAL_CLASS',
}

export interface IUserBase extends IUser {
    subscription: Array<EventType>;
}

export interface IEventBase extends IEvent {
    notifiedUsers: Array<Schema.Types.ObjectId>,
    unnotifiedUsers: Array<Schema.Types.ObjectId>;
}

export const IUserSchema = new mongoose.Schema<IUserBase>({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    subscription: {
        type: [{type: String, enum: EventType}],
        default: Object.values(EventType)
    },
    email: {type: String, required: true, unique: true},
});

export const IEventSchema = new mongoose.Schema<IEventBase>({
    type: {type: String, enum: EventType, required: true},
    date: {type: Number, required: true},
    title: {type: String},
    description: {type: String},
    notifiedUsers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: {}
        }
    ],
    unnotifiedUsers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: {}
        }
    ],
});

export const User = mongoose.model('User', IUserSchema);
export const Event = mongoose.model('Event', IEventSchema);
