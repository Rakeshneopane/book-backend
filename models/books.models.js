const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
    {
        title: {
            type : String,
            required : true,
        },
        author: {
            type : String,
            required : true,
        },
        publishedYear:{
            type: Number,
            required : true,
        },
        genre: [String],
        language: String,
        country: String,
        rating: {
            type : Number,
            min: 0,
            max: 5,
            default: 0,
        },
        summary: String,
        coverImageUrl: String,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Books", BookSchema);