var apiKey = "AIzaSyAAXAiJ5WgWHoaxL1QG9E1w9dJLA6eH1MQ";
var searchID ="008182633033430538347:isqigawv_v8";
const GoogleImages = require('google-images'); 
const client = new GoogleImages(searchID, apiKey);
 
client.search('Reut Lachmish', {page: 2})
    .then(images => {
        console.log(images);
        // [{
        //     "url": "http://steveangello.com/boss.jpg",
        //     "type": "image/jpeg",
        //     "width": 1024,
        //     "height": 768,
        //     "size": 102451,
        //     "thumbnail": {
        //         "url": "http://steveangello.com/thumbnail.jpg",
        //         "width": 512,
        //         "height": 512
        //     }
        // }]
         
    });
 