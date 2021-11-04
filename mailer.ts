const nodemailer = require('nodemailer');
const moment = require('moment')
const axios = require('axios').default;
require('dotenv').config()

export interface IMailer {

    sendNotificationMail(mailTo: String, eventTitle: String, eventType: String, eventDate: Number): String;

    sendDelayMail(mailTo: String, eventTitle: String, eventType: String, eventDate: Number): String;

    sendCancelMail(mailTo: String, eventTitle: String, eventType: String): String;

    sendMail(mailOptions: Object): String;
}

export enum MailResult {
    Error = "ERROR",
    Success = "SUCCESS",
    OptionsError = "OPTIONS_ERROR"
}

export class Mailer implements IMailer {

    // private readonly smtpConfig = {
    //     host: 'smtp.gmail.com',
    //     port: 80,
    //     secure: false, // use SSL
    //     auth: {
    //         user: process.env.MAIL_USER,
    //         pass: process.env.MAIL_PASS
    //     }
    //
    // };
    // private readonly transporter = nodemailer.createTransport(this.smtpConfig);

    private readonly transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });
    // private readonly transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user:' kirpesok@gmail.com',
    //         pass: 'avefishka9'
    //     }
    // });

    sendCancelMail(mailTo: String, eventTitle: String, eventType: String): String {
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: mailTo,
            subject: `Событие ${eventTitle} отменено`,
            text: `Уведомлям вас, что ${eventType} ${eventTitle} отменен.`
        };
        return this.sendMail(mailOptions)
    }

    sendDelayMail(mailTo: String, eventTitle: String, eventType: String, eventDate: Number): String {
        const formattedDate = (moment(eventDate)).format('DD/MM/YYYY HH:mm')
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: mailTo,
            subject: `Событие ${eventTitle} перенесено`,
            text: `Уведомлям вас, что ${eventType} ${eventTitle} перенесен на ${formattedDate}.`
        };
        return this.sendMail(mailOptions)
    }

    sendMail(mailOptions: Object): String {
        try {
            this.transporter.sendMail(mailOptions, function (error: any, info: any) {
                if (error) {
                    console.log(error);
                    return MailResult.Error;
                } else {
                    console.log('Email sent: ' + info.response);
                    return MailResult.Success;
                }
            });
        }catch (e: any) {
            console.log(e.message)
        }
        return MailResult.Success;
    }


    sendNotificationMail(mailTo: String, eventTitle: String, eventType: String, eventDate: Number): String {
        const formattedDate = (moment(eventDate)).format('DD/MM/YYYY HH:mm')
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: mailTo,
            subject: "Напоминание",
            text: `Напоминаем, что ${eventType} ${eventTitle} состоится ${formattedDate}.`
        };
        return this.sendMail(mailOptions)
    }
}
