let fs = require("fs");

const log = (error) => {
  let today = new Date();
  let date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  let time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let dateTime = date + " " + time;

  let content = `${dateTime} : ${error} \n`;

  console.log(content);

  fs.appendFile("./logger/error.log", content, (err) => {
    return err;
  });
};

module.exports = log;
