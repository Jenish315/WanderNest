const Listing = require("../models/listing");
module.exports.index = async (req, res) => {
    try {
        const allListing = await Listing.find({});
        res.render("listings/index", { allListing });
    } catch (error) {
        console.error("Error fetching listings:", error.message);
        req.flash("error", "Could not fetch listings.");
        res.redirect("/");
    }
};
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
}
module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const listingData = req.body.listing;
    if (!listingData) {
        throw new ExpressError(400, "Invalid listing data.");
    }

    const newListing = new Listing(listingData);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    console.log("User ID:", req.user._id); // Debug log to ensure user is logged in correctly

    await newListing.save();

    // Populate the owner field after saving
    const populatedListing = await Listing.findById(newListing._id).populate("owner");

    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${populatedListing._id}`);
}
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews", populate: {
        path: "author",
        }
    }).populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show", { listing });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    // Resize the image URL for preview
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");

    // Render the edit form with the resized image URL
    res.render("listings/edit", { listing, originalImageUrl });
};

module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body.listing;

    if (!updatedData) {
        throw new ExpressError(400, "Invalid data for listing.");
    }

  let listing = await Listing.findByIdAndUpdate(id, { ...updatedData });
  if(typeof req.file!== "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url,filename};
  await listing.save();
  }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id); // Ensure this deletes the listing
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings")
    // This should redirect to the listings page
}