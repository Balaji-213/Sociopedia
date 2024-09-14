import express from "express";
var router = express.Router();

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

const baseURL = process.env.REACT_APP_BASE_URL;

import { OAuth2Client } from "google-auth-library";

/* GET users listing. */
router.post('/', async function(req, res, next) {
  res.header("Access-Control-Allow-Origin", 'https://sociopedia-o098dtoa4-balaji-n-ks-projects.vercel.app');
  res.header("Access-Control-Allow-Credentials", 'true');
  res.header("Referrer-Policy","no-referrer-when-downgrade");
  const redirectURL = `${baseURL}/oauth`;

  const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
      redirectURL
    );

    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/userinfo.email email',
      prompt: 'consent'
    });

    res.json({url:authorizeUrl})

});

export default router;