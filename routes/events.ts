import { Router } from 'express';

const router = require('express').Router();
import {
  IEvent,
  IUser,
  EventType,
  User,
  Event,
  IEventBase,
} from '../models/Model';

router.post('/create', async (req: any, res: any) => {
  try {
    const newEvent: IEvent = await Event.create({
      type: req.body.type,
      date: req.body.date,
      title: req.body.title,
      description: req.body.description,
    });
    const event = await newEvent.save();
    res.status(200).json(event);
  } catch (e: any) {
    res.status(500).json(e.message);
  }
});

router.put('/subscribe/:id', async (req: any, res: any) => {
  try {
    User.findById(req.params.id, function (err, post) {
      post.subscribers.push(req.body.subscriber);
    });
    // const user = await User.findByIdAndUpdate(req.params.id, {
    //   $push: { subscribers: req.body.subscription },
    // });
    res.status(200).json(req.body.subscription);
  } catch (e: any) {
    res.status(500).json(e.message);
  }
});

module.exports = router;
