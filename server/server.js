import express from "express";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import cookieParser from "cookie-parser";

import { attachToken } from "./middleware/token-middleware.js";

import authRouter from './routes/auth.js';
import tokenRouter from './routes/token.js';
import userRouter from './routes/user.js';
import albumRouter from './routes/album.js';
import artistRouter from './routes/artist.js';

const app = express();

const corsOptions = {

    origin: "http://127.0.0.1:5173",
}


const PORT = 3000;



app.use(express.json());
app.use(cookieParser("test"));
app.use(cors(corsOptions));
app.use(helmet.contentSecurityPolicy({

    directives: {

        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://sdk.scdn.co"],
        frameSrc: ["'self'", "https://sdk.scdn.co"],
        connectSrc: ["'self'", "https://sdk.scdn.co", "https://api.spotify.com", "https://accounts.spotify.com"]
    }

}));
app.use(session({

    secret: 'accessToken',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000, secure: false },
    signed: false
},

));
//app.use(attachToken);

///////////////
/// ROUTES ///
/////////////
app.use("/api/auth", authRouter);
app.use("/api/token", tokenRouter);
app.use("/api/user", userRouter);
app.use("/api/album", albumRouter);
app.use("/api/artist", artistRouter);

app.get("/", (req, res) => {

    res.send("At /");
});

app.get("/dashboard", (req, res) => {

    console.log("AT DASH")

    res.send("DASHBOARD")
});



app.listen(PORT, "127.0.0.1", () => {

    console.log("Server listen on PORT ", PORT);
});