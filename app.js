if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// MongoDB connection URL
const url = process.env.ATLASTDB_URL;

// Session store
const store = MongoStore.create({
    mongoUrl: url,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, // Time interval in seconds
});

// Session options
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
    },
};

// MongoDB connection function
const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(url);
        console.log("MongoDB Connected");

        // Start the server only after connecting to DB
        const server = app.listen(8080, () => {
            console.log("Server running on port 8080");
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};

// Middleware
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// EJS configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Root route
app.get("/", (req, res) => {
    res.redirect("/listings");
});

// Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Catch-all route for undefined endpoints
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

// Error-handling middleware
app.use((error, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = error;
    res.status(statusCode).render("error.ejs", { message });
});

// Connect to the database
connectDB();
