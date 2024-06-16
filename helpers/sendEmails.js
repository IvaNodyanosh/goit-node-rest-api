import nodemailer from "nodemailer";
import { config } from "dotenv";
import { google } from "googleapis";

config();

const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;

const REDIRECT_URL = "https://developers.google.com/oauthplayground";




export const sendEmails = async (email, token) => {
  try {
    const client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URL
    );

    client.setCredentials({ refresh_token: REFRESH_TOKEN });
    
    const accessToken = await client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "nodianosh.official@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken
      },
    });

    transporter.sendMail({
      from: "ivan.nodianosh@outlook.com",
      to: [email],
      subject: "Verify email!",
      html: `<a href="http://localhost:3000/api/users/verify/${token}">Verify email!</a>`,
    });
  } catch (error) {
    console.log(error);
  }
};
