import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async(to:string, html:string) => {
    const transporter = nodemailer.createTransport({
      service:'gmail',
        host: "smtp.gmail.email",
        port: 587,
        secure: config.NODE_ENV === 'production', // true production, false for dev
        auth: {
          user: "kamrulbappy3@gmail.com",
          pass: "kqoj ohwm ithr ollo",
        },
      });

      await transporter.sendMail({
        from: 'kamrulbappy3@gmail.com', // sender address
        to, // list of receivers
        subject: "Reset Your PassWord with in 10 mins", // Subject line
        text: "", // plain text body
        html, // html body
      });
}