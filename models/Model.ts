import { model, Schema, Model, Document } from 'mongoose';
import * as mongoose from 'mongoose';

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
  subscribers: any;
}

export const IUserSchema = new mongoose.Schema<IUserBase>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  subscription: {
    type: [{ type: String, enum: EventType }],
    default: Object.values(EventType),
  },
  email: { type: String, required: true, unique: true },
});

// exports.all = function (cb) {
//   Event.find().toArray(function (err, docs) {
//     cb(err, docs)
//   });
// };

export const IEventSchema = new mongoose.Schema<IEventBase>({
  type: { type: String, enum: EventType, required: true },
  date: { type: Number, required: true },
  title: { type: String },
  description: { type: String },
  subscribers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Event',
    },
  ],
});

export const User = mongoose.model('User', IUserSchema);
export const Event = mongoose.model('Event', IEventSchema);
// module.exports = model('User', IUserSchema);
// module.exports = model('Event', IEventSchema);
