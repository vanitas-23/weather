require('dotenv').config();
const http = require("http");
const fs = require("fs");
var requests = require("requests");


const homeFile = fs.readFileSync("index.html", "utf-8");


const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", parseFloat(orgVal.main.temp-273.15).toFixed(2));
  temperature = temperature.replace("{%tempmin%}", parseFloat(orgVal.main.temp_min-273.15).toFixed(2));
  temperature = temperature.replace("{%tempmax%}", parseFloat(orgVal.main.temp_max-273.15).toFixed(2));
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=12c5a9d0104c83b974dd74264565a608"
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        //console.log(arrData);
        
        const realTimeData = arrData.map((val) => 
        // console.log(val.main));
        replaceVal(homeFile, val)).join("");
       // res.write(realTimeData);
        //   .join("");
         res.write(realTimeData);
         //console.log(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  } else {
    res.end("File not found");
  }
});

server.listen(8000, "127.0.0.1");