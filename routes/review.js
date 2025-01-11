const express = require("express");
const router = express.Router({ mergeParams: true }); // Use mergeParams to access `:id` from parent route
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require('../models/review');
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn ,isReviewAuthor } = require("../middleware.js")
const reviewController = require("../controllers/reviews.js"); 

// Middleware to validate review


// Create a new review for a specific listing
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete a review for a specific listing
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
