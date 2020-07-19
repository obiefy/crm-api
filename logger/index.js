let fs = require("fs");

const log = (error) => {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;

  let content = `${dateTime} : ${error} \n`;
  fs.appendFile("./logger/error.log", content, (err) => {
    return err;
  });
};

module.exports = log;
