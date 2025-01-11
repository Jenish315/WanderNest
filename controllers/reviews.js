const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
    const { id } = req.params; // Access listing ID from URL
    const listing = await Listing.findById(id); // Find the listing by ID

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }

    // Create and add review
    const review = new Review(req.body.review);
    review.author = req.user._id;
    listing.reviews.push(review); // Add review to the listing's `reviews` array
    await review.save(); // Save the review
    await listing.save(); // Save the listing with the new review
    req.flash("success", "Thank you for the feedback!");

    res.redirect(`/listings/${id}`); // Redirect back to the listing page
}
module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params; // Access listing ID and review ID from URL

    // Remove the review from the listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // Delete the review itself
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");

    res.redirect(`/listings/${id}`); // Redirect back to the listing page
}