const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;


const listingSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"], // Adds a custom error message if title is missing
    },
    description: {
        type: String,
        trim: true, // Removes leading/trailing spaces
    },
    image: {
        filename: String,
        url: String,
      },
    price: {
        type: Number, // Changed to Number for better price operations
        required: [true, "Price is required"], // Validation
        min: [0, "Price must be a positive number"], // Prevents negative prices
    },
    location: {
        type: String,
        required: [true, "Location is required"],
    },
    country: {
        type: String,
        required: [true, "Country is required"],
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});

listingSchema.post("findOneAndDelete", async function (doc) {
    if (doc) { // 'doc' contains the deleted listing document
        try {
            await review.deleteMany({ _id: { $in: doc.reviews } });
        } catch (err) {
            console.error("Error deleting associated reviews:", err);
        }
    }
});


const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
