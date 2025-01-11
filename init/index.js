const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

const uri = 'mongodb+srv://jenishkanani93:Jenish%40315@cluster0.fxo0g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// MongoDB connection function
const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(uri);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); // Exit the process if connection fails
    }
};

// Database initialization function
const initDB = async () => {
    try {
        console.log("Initializing database...");
        
        // Clear existing listings
        await Listing.deleteMany({});
        console.log("Existing listings deleted.");

        // Add owner field to each data object
        initData.data = initData.data.map((obj) => ({
            ...obj,
            owner: "677e23369c0ebca58768d549" // Ensure this ID exists in your database
        }));

        // Insert new data
        await Listing.insertMany(initData.data);
        console.log("Data initialized successfully.");
    } catch (error) {
        console.error("Error initializing database:", error.message);
    } finally {
        mongoose.connection.close(); // Close the connection after operation
    }
};

// Connect to the database and initialize it
(async () => {
    await connectDB();
    await initDB();
})();
