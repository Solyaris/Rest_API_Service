const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const path = require('path');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');
const axios = require('axios').default;
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const moment = require('moment')

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
    // console.log(EventType.Webinar)
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


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'kirpesok@gmail.com',
            pass: 'avefishka9'
        }
    });


    cron.schedule('* * * * *', async () => {
        const {data} = await axios.get('/api/event/daily');
        data.forEach((event: any) => {
            event.notifiedUsers.forEach((user: any) => {
                if (user.subscription.includes(event.type)) {
                    const formattedDate = (moment(event.date)).format('DD/MM/YYYY HH:mm')
                    const mailOptions = {
                        from: 'kirpesok@gmail.com',
                        to: user.email,
                        subject: `Уведомление`,
                        text: `Напоминаем, что ${event.type} ${event.title} состоится ${formattedDate}`
                    };
                    transporter.sendMail(mailOptions, async function (error: any, info: any) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                            const {data} = await axios.put(`/api/event/markNotified/${event._id}`,
                                `userId=${user._id}`);

                        }
                    });
                }
            })
        })

    });

}

start();
