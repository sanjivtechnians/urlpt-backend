const errorMiddleware = require('./src/middlewares/errorMiddleware');
const campaignRoute = require('./src/routes/user.campaign.route');
const visitorsRoute = require('./src/routes/user.visitor.route');
const scriptRoute = require('./src/routes/script.route')
const userRoute = require('./src/routes/user.route');
const scheduleUserCleanup = require('./src/crons/userCleanup.cron');
const scheduleSubscriptionDeactivation = require('./src/crons/subscriptionDeactivation.cron');

const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const connectDB = require('./src/configs/db');
const route = require('./src/routes/routes');

const moment = require('moment-timezone');
const bodyParser = require('body-parser');
const requestIp = require("request-ip");
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const app = express();
require('dotenv').config();
const path = require('path');
app.use(fileUpload());


// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: {
//     status: 429,
//     message: "Too many requests, please try again later.",
//   },
// });



const port = process.env.PORT || 5006;

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.ACCOUNT_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

const serverStartTime = moment().tz('Asia/Kolkata').format('DD-MM-YYYY, hh:mm A');

app.use(requestIp.mw());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.set('trust proxy', 1);
// app.use(limiter);
app.use('/scripts', express.static(path.join(__dirname, 'src/scripts')));

app.get('/', (req, res) => {
  const serverName = "URLPT server";
  res.json({
    upTime: serverStartTime,
    serverName: serverName
  });
});

app.post("/send-message", (req, res) => {
  const { body, to } = req.body;
  client.messages
    .create({
      body,
      to,
      from: '+12137862699', // Your Twilio number
    })
    .then((message) => {
      console.log("Message sent:", message.sid);
      res.status(200).send("Message sent successfully");
    })
    .catch((error) => {
      console.error("Error sending message:", error);
      res.status(500).send("Failed to send message");
    });
});

app.post("/send-whatsapp", (req, res) => {
  const { body, to } = req.body;

  client.messages
    .create({
      body: 'Your appointment is coming up on July 21 at 3PM',
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+917007652088'
    })

    .then((message) => {
      console.log("Message sent:", message.sid);
      res.status(200).send("Message sent successfully");
    })
    .catch((error) => {
      console.error("Error sending message:", error);
      res.status(500).send("Failed to send message");
    });
});


app.use('/api', route)
app.use('/api/v2', userRoute);
app.use('/api/v2/campaign', campaignRoute);
app.use('/api/v2/visitors', visitorsRoute);
app.use('/api/v2/script', scriptRoute);


app.listen(port, async () => {
  try {
    await connectDB()
      .then(() => {
        scheduleUserCleanup();
        scheduleSubscriptionDeactivation();
      })
      .catch((err) => {
        console.error("DB connection failed:", err);
      });
    console.log(`Our application is running at port: http://localhost:${port}`);
  } catch (error) {
    console.log("error", error);
  }
});


app.use(errorMiddleware)