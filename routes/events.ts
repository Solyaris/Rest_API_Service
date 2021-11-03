const router = require('express').Router();
import {Event, IEvent, User,} from '../models/Model';


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
        await User.findById(req.body.userId);
        try {
            await Event.findByIdAndUpdate(req.params.id,//fixme добавить проверку существующей подписки
                {
                    $addToSet: {subscribers: req.body.userId},
                });
            res.status(200).json(`User with id:${req.body.userId} subscribed successfully to event ${req.params.id}`);
        } catch (e: any) {//TODO
            res.status(500).json(e.message);
        }
    } catch (e: any) {
        res.status(404).json(`User with id:${req.body.userId} does not exist`)
    }

});

router.put('/delay/:id', async (req: any, res: any) => {
    try {
        await Event.findByIdAndUpdate(req.params.id, {
                $set: {date: req.body.date}
            }
        );
        res.status(200).json(`Event delayed to ${req.body.date}`);

    } catch (e: any) {
        console.log(e)
        res.status(404).json(e.message)
    }
})
router.delete('/cancel/:id', async (req: any, res: any, next: any) => {
    try {
        const eventId = await Event.findById(req.params.id).select("_id title")
        if (!eventId) {
            throw new Error(`Event with id:${req.params.id} does not exist`)
        } else {
            await Event.findByIdAndRemove(req.params.id)
            res.status(200).json(`Event with id:${req.params.id} has been removed successfully`);
        }
    } catch (e: any) {
        res.status(404).json(e.message)
    }
})

module.exports = router;
