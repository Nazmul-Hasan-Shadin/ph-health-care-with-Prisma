import nodemailer from "nodemailer";
import config from "../../../config";

const emailSender = async (email: string, html: string) => {

   console.log(email,'iam inside');
   
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: config.jwt.email,
      pass: config.jwt.app_password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: '"Ph health care 👻" <nazmulhasanshadin000@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Becareful bro reset pass ✔", // Subject line
    //text: "Hello world?", // plain text body
    html, // html body
  });

  console.log("emais send", info);
};

export default emailSender;
