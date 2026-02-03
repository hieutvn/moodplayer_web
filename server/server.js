import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';



import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import albumRouter from './routes/album.js';
import artistRouter from './routes/artist.js';
import searchRouter from './routes/search.js';

import { authenticateAccess } from "./routes/middleware/token-middleware.js";


dotenv.config();

const app = express();

const corsOptions = {

    origin: "http://127.0.0.1:5173",
    credentials: true
}


const PORT = 3000;



app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet.contentSecurityPolicy({

    directives: {

        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://sdk.scdn.co"],
        frameSrc: ["'self'", "https://sdk.scdn.co"],
        connectSrc: ["'self'", "https://sdk.scdn.co", "https://api.spotify.com", "https://accounts.spotify.com"]
    }
    
}));
//app.use(authenticateAccess);

///////////////
/// ROUTES ///
/////////////

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/album", albumRouter);
app.use("/api/artist", artistRouter);
app.use("/api/search", searchRouter);

app.get("/", (req, res) => {

    res.send("At /");
});


app.listen(PORT, "127.0.0.1", () => {

    console.log("Server listen on PORT ", PORT);
});
