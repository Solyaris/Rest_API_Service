import { IEvent, IUser, EventType, User, Event } from './models/Model';
import express from 'express';
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const path = require('path');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');

const PORT = 4000;
const app = express(); // переменаняя приложения
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
});

app.engine('hbs', hbs.engine); // движок для рендеринга страниц, 1 - имя, 2 - объект движка
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
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
  // const event: IEvent = await Event.create({
  //     type: EventType.Webinar,
  //     date: Date.now(),
  //     title: "Ewkere",
  //     description: "Let's celebrate!"
  // })
}

start();
