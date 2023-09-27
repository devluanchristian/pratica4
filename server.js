import express from 'express'
import passport from 'passport'
import session from 'express-session'
import './passport.js'

import dotenv from 'dotenv'

dotenv.config()

const app = express();

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

app.get("/home", (req, res) => {
    res.send("Home Page")
})

app.get('/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    })
)

app.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/failed',
    }),
    function (req, res) {
        res.redirect('/success')
    }
)

app.get("/failed", (req, res) => {
    console.log('User is not authenticated');
    res.send("Failed")
})

// Success route if the authentication is successful
app.get("/success", isLoggedIn, (req, res) => {
    console.log('You are logged in');
    res.send(`Welcome ${req.user.displayName}`)
})

// Route that logs out the authenticated user  
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Error while destroying session:', err);
        } else {
            req.logout(() => {
                console.log('You are logged out');
                res.redirect('/home');
            });
        }
    });
});

app.listen(3000, console.log("servidor online"))