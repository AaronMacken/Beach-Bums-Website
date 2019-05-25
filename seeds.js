// Require mongoose and models used
var mongoose = require("mongoose"),
  Beach = require("./models/beach"),
  Comment = require("./models/comment");

var data = [
  {
    name: "Lena Lake",
    image: "https://farm4.staticflickr.com/3163/2596935871_bcf2d61ff7.jpg",
    content: "The water was crystal clear and sand as far as the eye can see."
  },
  {
    name: "Half Moon Bay",
    image: "https://farm1.staticflickr.com/23/30718039_be2753306f.jpg",
    content: "This bay only had half a moon... go figure!"
  },
  {
    name: "White Wash Shores",
    image: "https://farm4.staticflickr.com/3096/3160709660_8acafbcfc0.jpg",
    content: "So much white wash, hard to make it out the back."
  }
];

function seedDB() {
  // Remove existing beaches
  Beach.remove({}, err => {
    if (err) console.log(err);
    else {
      // Now that beaches are removed, remove the existing comments
      console.log("Removed beach");
      Comment.remove({}, err => {
        if (err) console.log(err);
        else {
          console.log("Removed comment");
          // Insert the data from the sample data array we created
          data.forEach(seed => {
            // Create a beach object for each piece of sample data we created
            // This only covers the main data for the object and not the comments
            Beach.create(seed, (err, beach) => {
              if (err) console.log(error);
              else {
                console.log("Added a beach");
                // Time to add the sample comments
                Comment.create(
                  {
                    text: "Salt life, Salt life!",
                    author: "I_Love_Beaches_32"
                  },
                  (err, comment) => {
                    // call back with the comment added to mongo
                    if (err) console.log(err);
                    else {
                      // using the beach object that was added to mogno
                      beach.comments.push(comment);
                      beach.save();
                      console.log("Created new comment");
                    }
                  }
                );
              }
            });
          });
        }
      });
    }
  });
}

module.exports = seedDB;