require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Basic Configuration
const port = process.env.PORT || 5000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const originalUrls=[];
const shortUrls = [];


// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  console.log(originalUrls);
  console.log(shortUrls);
  const url = req.body.url;
  const foundIndex = originalUrls.indexOf(url);
  
  if(!url.includes("https://") && !url.includes("http://")){
    return res.json({
      error: "invalid url"
    })
  }

  if(foundIndex < 0){
    originalUrls.push(url);
    shortUrls.push(shortUrls.length);
    return res.json({
      original_url:url,
      short_url : shortUrls.length - 1,
    });  
  }
  return res.json({
    original_url:url,
    short_url:shortUrls[foundIndex]
  })
  
});

app.get("/api/shorturl/:shorturl", function(req,res){
 const shorturl = parseInt(req.params.shorturl);
 console.log(shorturl);
 const foundIndex = shortUrls.indexOf(shorturl);
 console.log(foundIndex);
 
 if(foundIndex < 0){
  return res.json({
    error : "No short URL found for the given input",
  })
 }

 res.redirect(originalUrls[foundIndex]);
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
