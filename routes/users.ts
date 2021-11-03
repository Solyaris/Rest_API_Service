const router = require('express').Router();
import {
  IEvent,
  IUser,
  EventType,
  User,
  Event,
  IUserBase,
} from '../models/Model';

router.post('/create', async (req: any, res: any) => {
  try {
    const newUser: IUserBase = await User.create({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      subscription: req.body.subscription,
    });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (e: any) {
    res.status(500).json(e.message);
  }
});

router.put('/:id', async (req: any, res: any) => {
  try {
    const subscription: Array<String> = Array.isArray(req.body.subscription)
      ? req.body.subscription
      : Array.of(req.body.subscription);

    subscription.forEach((type: String) => {
      if (!Object.values(EventType).includes(type as EventType)) {
        throw new Error();
      }
    });

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: { subscription: req.body.subscription },
      });
      res.status(200).json(req.body.subscription);
    } catch (e: any) {
      res.status(500).json(e.message);
    }
  } catch (e: any) {
    res
      .status(405)
      .json(`${req.body.subscription} does not exist in EventType`);
  }
});

module.exports = router;
