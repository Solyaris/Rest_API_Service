import {
    IEvent,
    IUser,
    EventType,
    User,
    Event,
    IEventBase,
  } from '../models/Model';

exports.all = function(cb){
    Event.find().toArray(function(err, docs){
        cb(err, docs)
    })
}

exports.update = function(req: any, res: any){

      }
