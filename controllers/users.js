const User = require("../models/user");

module.exports.renderSignupForm =  (req, res) => {
    console.log("Signup route works!");
    res.render("users/signup");

}
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");  // Make sure this matches the location of your login view
}

module.exports.signup = async (req, res) => {
    try {
        // Destructure user input
        let { username, email, password } = req.body;
        
        // Create a new User instance
        const newUser = new User({ email, username });

        // Register the user and hash the password
        const registeredUser = await User.register(newUser, password);

        // Automatically log the user in after registration
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err); // If an error occurs, pass it to next middleware
            }

            // After logging in, redirect to the listings page
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");  // No need for manual login
        });

    } catch (e) {
        // If there's an error during registration
        req.flash("error", e.message);
        res.redirect("/signup"); // Redirect back to signup page
    }
}
module.exports.login = async (req, res) => {
    req.flash("success", "welcome back to  Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}
module.exports.logout =  (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "you logged out Successfully");
        res.redirect("/listings");
    })

}