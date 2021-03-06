import {Request, Response} from 'express';
const router = require('express').Router();
import {EventType, User,} from '../models/Model';

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json(user)
    } catch (e: any) {
        res.status(500).json(e.message)
    }

});


router.post('/create', async (req: Request, res: Response) => {
    try {
        const newUser = await User.create({
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

router.put('/:id', async (req: Request, res: Response) => {
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
            await User.findByIdAndUpdate(req.params.id, {
                $set: {subscription: req.body.subscription},
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
