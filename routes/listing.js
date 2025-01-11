const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing"); // Ensure the path to your model is correct
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")
// Middleware to validate listings
const listingController = require("../controllers/listings.js");
const multer = require("multer")
const {storage} = require("../cloudConfig.js");
const upload  = multer({ storage })

// Fetch all listings
router. 
route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
);
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.
route("/:id")
.put( isLoggedIn, isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.editListing))
.get( wrapAsync(listingController.showListing))
.delete(isLoggedIn, wrapAsync(listingController.deleteListing)
);

// Show form to create a new listing



// Show form to edit a listing
router.get("/:id/edit", wrapAsync(listingController.renderEditForm));

// Update a listing


// Show a specific listing



module.exports = router;
