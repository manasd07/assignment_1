import nodemailer from "nodemailer";
export const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "27e3708ced0e21",
    pass: "986598d9343996",
  },
});
