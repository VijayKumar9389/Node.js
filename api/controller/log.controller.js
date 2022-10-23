const LogModel = require("../models/log.model");
const xlsx = require('xlsx');
const path = require('path');

const HeadingJson = ['TRACT', 'PIN', 'STRUCTURE_TYPE', 'INTEREST', 'CONTACT', 'NAME', 'STREET', 'MAILING', 'PHONE', 'OCCUPANTS', 'WORKED', 'CONTACTED', 'ATTEMPTS', 'CONSULTATION', 'FOLLOWUP', 'COMMENTS', 'KEEPDELETE', 'COMMODITY', 'PIPLINESTATUS'];
const HeadingBook = ['TRACT', 'PIN/ LEGAL', 'STRUCTURE TYPE/STATUS', 'INTEREST STATUS', 'CONTACT STATUS', 'NAME(S)', 'STREET ADDRESS', 'MAILING ADDRESS', "PHONE #'s", '# OF OCCUPANTS', 'WORKS LAND (Y/N)', 'CON- TACTED (Y/N)', 'ATTEMPT DETAILS', 'CONSULT-ATION DATE', 'FOLLOW UP (Y/N)', 'COMMENTS', 'KeepDelete', 'Commodity', 'PipelineStatus'];


// get all items
exports.getAllLogs = (req, res) => {
    LogModel.getAllLogs((err, items) => {
        console.log("Fetched all items");
        if (err)
            res.send(err);
        res.send(items);
    });
}

exports.createLog = (req, res) => {
    
    const date = req.body.date;
    const user = req.body.user;
    const info = req.body.info;
    const changes = req.body.changes;
    console.log(typeof(changes))

    LogModel.createLog([date, req.reqUser, info, changes], (err, log) => {
        if (err)
            res.send(err);
        console.log('created ', req.body.info);
        res.send(log);
    });
}

exports.getLogExcel = (req, res) => {
    LogModel.getAllLogs((err, logs) => {
        var string = JSON.stringify(logs);
        var json = JSON.parse(string);

        var newwb = xlsx.utils.book_new();
        var newws = xlsx.utils.json_to_sheet(json, { defval: "" });
        xlsx.utils.book_append_sheet(newwb, newws, "New Data");
        xlsx.writeFile(newwb, 'NewBook.xlsx');
        res.sendFile(path.resolve('./NewBook.xlsx'), 'Wascana.xlsx');
    });
}