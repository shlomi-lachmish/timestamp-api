const express = require('express')
const moment = require('moment')
const app = express()

var oDate = new Date();
app.get('/:date', function (req, res) {
  var resJson = {
    date:null,
    unix:null
  }
  if (moment(req.params.date, "DD-MM-YYYY", true).isValid()){ //we have a humen date detected
    resJson.date = req.params.date;
    var hDate =  moment(req.params.date, "DD-MM-YYYY");
    //build a unix time 
    var uTime = (hDate.valueOf() / 1000).toString(); 
    resJson.unix = uTime;
  }
  if (moment(req.params.date, "X", true).isValid()){ //we have a unix date detected
    resJson.unix = req.params.date;
    var uDate =  moment(req.params.date, "X");
    //build a humen time 
    var hTime = moment(uDate).format("DD-MM-YYYY"); 
    resJson.date = hTime;
  }
  res.send(resJson);
})

app.listen(process.env.PORT, function () {
  console.log('Example app listening on port 3000!')
})