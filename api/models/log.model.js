var Connection = require('../../config/database');

var Log = (log) => {
    this.id = log.id;
    this.info = log.info;
    this.user = log.user;
    this.date = log.date;
    this.changes = log.changes;
}

Log.getAllLogs = (result) => {
    Connection.query("select * from Logs", (err, res) => {
        if (err) {
            console.log(err);
            result(null, err);
        } else {
            console.log("All Logs");
            result(null, res);
        }
    });
}

Log.createLog = (data, result) => {
    Connection.query("INSERT INTO Logs (date, user, info, changes) values (?, ?, ?, ?)", data, (err, res) => {
        if (err) {
            console.log('error creating log', err);
            result(null, err);
        } else {
            console.log("Successfully created log");
            result(null, res);
        }
    });
}

module.exports = Log;