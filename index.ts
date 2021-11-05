import {Mailer, MailResult} from "./mailer";

const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const path = require('path');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');
const cron = require('node-cron');
const moment = require("moment");
const axios = require('axios').default;

const PORT = 80;
const app = express(); // переменаняя приложения
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
});

app.engine('hbs', hbs.engine); // движок для рендеринга страниц, 1 - имя, 2 - объект движка
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/user', userRoutes);
app.use('/api/event', eventRoutes);


async function start() {
    try {
        await mongoose.connect(
            'mongodb+srv://kirill:040294@cluster0.fyzb7.mongodb.net/todos',
            {
                useNewUrlParser: true,
            }
        );
        app.listen(PORT, () => {
            // колбек, который вызывается, если сервер уже запущен
            console.log('Server has been started  ');
        });
    } catch (e) {
        console.log(e);
    }


    const mailer = new Mailer
    cron.schedule('30 * * * *', async () => { // Runs notifications every 30 minutes
        const {data} = await axios.get('/api/event/daily');
        for (const event of data) {
            for (const user of event.unnotifiedUsers) {

                if (user.subscription.includes(event.type)) {
                    const result = mailer.sendNotificationMail(user.email, event.title, event.type, event.date);

                    if (result == MailResult.Success) {
                        const {data} = await axios.put(`/api/event/markNotified/${event._id}`,
                            `userId=${user._id}`);
                        console.log("Success: " + data)
                    } else {
                        console.log(result)
                    }
                }
            }
        }

         });

    }

    start();
