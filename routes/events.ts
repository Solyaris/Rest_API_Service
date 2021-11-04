import {Event, User,} from '../models/Model';
import {Request, Response} from 'express';

const router = require('express').Router();

router.post('/create', async (req: Request, res: Response) => {
    try {
        const newEvent = await Event.create({
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
router.get('/daily', async (req: Request, res: Response) => {
    try {
        const events =
            await Event.find({date: {$lte: (Date.now() + 86400000)}})
                .populate('unnotifiedUsers');
        res.status(200).json(events)
    } catch (e: any) {
        res.status(500).json(e.message);
    }

});


router.put('/markNotified/:id', async (req: Request, res: Response) => {
        try {
            Event.findByIdAndUpdate(req.params.id, {
                $pull: {unnotifiedUsers: req.body.userId},
                $addToSet: {notifiedUsers: {_id: req.body.userId}}
            }, function (error: any, doc: any) {
                if (error) {
                    Error(error)
                }
            });
            res.status(200).json(req.body.userId)

        } catch
            (e: any) {
            res.status(500).json(e.message);
        }
    }
)
router.put('/subscribe/:id', async (req: Request, res: Response) => {
    try {
        await User.findById(req.body.userId);
        try {
            await Event.findByIdAndUpdate(req.params.id,// FIXME: добавить проверку существующей подписки
                {
                    $addToSet: {unnotifiedUsers: req.body.userId},
                });
            res.status(200).json(`User with id:${req.body.userId} subscribed successfully to event ${req.params.id}`);
        } catch (e: any) {//TODO
            res.status(500).json(e.message);
        }
    } catch (e: any) {
        res.status(404).json(`User with id:${req.body.userId} does not exist`)
    }

});

router.put('/delay/:id', async (req: Request, res: Response) => {
    try {
        await Event.findByIdAndUpdate(req.params.id, {
                $set: {date: req.body.date},
                $addToSet: {unnotifiedUsers: {$each: 'notifiedUsers'}}
            }
        );
        res.status(200).json(`Event delayed to ${req.body.date}`);

    } catch (e: any) {
        console.log(e);
        res.status(404).json(e.message);
    }
});
router.delete('/cancel/:id', async (req: Request, res: Response) => {
    try {
        const eventId = await Event.findById(req.params.id).select("_id title");
        if (!eventId) {
            throw new Error(`Event with id:${req.params.id} does not exist`);
        } else {
            await Event.findByIdAndRemove(req.params.id);
            res.status(200).json(`Event with id:${req.params.id} has been removed successfully`);
        }
    } catch (e: any) {
        res.status(404).json(e.message);
    }
});

module.exports = router;
