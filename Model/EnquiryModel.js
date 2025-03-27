const mongoose = require("mongoose");
// Define a Mongoose schema for your enquiry data
const enquirySchema = new mongoose.Schema({
    name: 
    {
        type: String,
        required
    },
    email: 
    {
        type: String,
        required
    },
    phone: 
    {
        type: String,
        required
    },
    service: 
    {
        type: String,
        required
    },
    message:
    {
        type: String,
        required
    },
    timestamp: { type: Date, default: Date.now },
});

// Create a Mongoose model based on the schema
const Enquiry = mongoose.model('Enquiry', enquirySchema);