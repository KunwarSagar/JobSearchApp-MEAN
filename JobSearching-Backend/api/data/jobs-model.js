const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
    address : String,
    coordinates: {
        type : [Number],
        index: '2dsphere'
    }
});
const reviewsSchema =  new mongoose.Schema({
    date: Date,
    review: String,
    reviewedBy: String
});
const jobsSchema = mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    salary: Number,
    location: LocationSchema,
    description: String,
    experience: String,
    skills: [String],
    postDate:Date,
    reviews: [reviewsSchema]
});

mongoose.model(process.env.JOB_MODEL, jobsSchema, process.env.DB_JOBS_COLLECTION);