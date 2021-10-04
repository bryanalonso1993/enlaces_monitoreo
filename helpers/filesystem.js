const fs = require('fs');
const date = require('date-and-time');
const now = new Date();

const dropFilesystem = nroDays => {
    let afterDate = date.format(date.addDays(now,-nroDays), 'YYYY-MM-DD');
    fs.unlinkSync("./logs/logApplicationRotate-".concat(afterDate,".log"));
}

module.exports = dropFilesystem;
