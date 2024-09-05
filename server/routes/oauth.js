import express from "express";
var router = express.Router();
import dotenv from 'dotenv';
import User from "../models/User.js";
dotenv.config();
import jwt from "jsonwebtoken";


// const {OAuth2Client} = require('google-auth-library');
import { OAuth2Client } from "google-auth-library";

async function getUserData(access_token) {

  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
  
  const data = await response.json();

  return data;
}



/* GET home page. */
router.get('/', async function(req, res, next) {

    const code = req.query.code;

    try {
            const redirectURL = "http://127.0.0.1:3001/oauth";
            const oAuth2Client = new OAuth2Client(
              process.env.GOOGLE_CLIENT_ID,
              process.env.GOOGLE_CLIENT_SECRET,
              redirectURL
            );
            const r = await oAuth2Client.getToken(code);
            await oAuth2Client.setCredentials(r.tokens);
            // console.log(r.tokens);
            const accessToken = oAuth2Client.credentials.access_token;
            const userInfo = await getUserData(accessToken);
        
            // Ensure to get email from the userInfo
            if (!userInfo.email) {
              return res.status(400).send("Email not found in Google account");
            }
        
            // Check if the user already exists in the database
            let user = await User.findOne({ googleId: userInfo.sub });
            if (!user) {
              user = new User({
                googleId: userInfo.sub,
                firstName: userInfo.given_name,
                lastName: userInfo.family_name,
                email: userInfo.email,
                password: 'N/A',
                picturePath: userInfo.picture,
                viewedProfile: Math.floor(Math.random() * 10000),
                impressions: Math.floor(Math.random() * 10000),
              });
              await user.save();
            }
        
            const userData = await User.findOne({ googleId: userInfo.sub })
        
            const userParam = encodeURIComponent(JSON.stringify(userData));

            const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET);

            res.redirect(`http://localhost:3000/oauth-callback?token=${token}&user=${userParam}`);

      } catch (err) {
        console.log('Error logging in with OAuth2 user', err);
    }

});

export default router;