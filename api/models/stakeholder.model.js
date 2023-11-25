var Connection = require('../../config/database');

var Stakeholder = (stakeholder) => {
    this.name = stakeholder.name;
    this.contact = stakeholder.contact;
    this.street = stakeholder.street;
    this.mailing = stakeholder.mailing;
    this.phone = stakeholder.phone;
    this.contacted = stakeholder.contacted;
    this.attempts = stakeholder.attempts;
    this.consultation = stakeholder.consultation;
    this.followup = stakeholder.followup;
    this.email = stakeholder.email;
    this.stakeholdercomment = stakeholder.stakeholdercomment;
    this.corperation = stakeholder.corperation;
    this.route = stakeholder.route;
    this.location = stakeholder.location;
    this.tracts = stakeholder.tracts;
}

Stakeholder.getAllStakeholders = (project, result) => {
    Connection.query(`SELECT NAME, CONTACT, STREET, MAILING, PHONE, CONTACTED, ATTEMPTS, CONSULTATION, FOLLOWUP, EMAIL, STAKEHOLDERCOMMENT, CORPERATION, ROUTE, LOCATION, GROUP_CONCAT(DISTINCT TRACT) as tracts, COUNT(*) as count FROM ${project} group by NAME`, (err, res) => {
        if (err) {
            console.log('error', err);
            result(null, err);
        } else {
            console.log("Stakeholders fetched successfully");
            console.log(res);
            result(null, res);
        }
    });
}

Stakeholder.getStakeholderbyName = (name, result) => {
    Connection.query(`SELECT NAME, CONTACT, STREET, MAILING, PHONE, CONTACTED, ATTEMPTS, CONSULTATION, FOLLOWUP FROM ${process.env.TABLE} WHERE NAME = ?`, name, (err, res) => {
        if (err) {
            console.log('error');
            result(null, err);
        } else {
            console.log("Stakeholder fetched successfully");
            result(null, res);
        }
    });
}

Stakeholder.updateStakeholder = (data, result) => {
    Connection.query(`UPDATE ${data.project} set NAME = ?, CONTACT = ?, STREET = ?, MAILING = ?, PHONE = ?,  CONTACTED = ?, ATTEMPTS = ?, CONSULTATION = ?, FOLLOWUP = ?, EMAIL = ?, STAKEHOLDERCOMMENT = ?, CORPERATION = ?, ROUTE = ?, LOCATION = ? WHERE name = ?`,
        [data.data.NEWNAME, data.data.CONTACTSTATUS, data.data.STREET, data.data.MAILING, data.data.PHONE, data.data.CONTACTED, data.data.ATTEMPTS, data.data.CONSULTATION, data.data.FOLLOWUP, data.data.EMAIL, data.data.STAKEHOLDERCOMMENT, data.data.CORPERATION, data.data.ROUTE, data.data.LOCATION, data.data.NAME],
        (err, res) => {
            if (err) {
                console.log('error');
                console.log(err);
                result(null, err);
            } else {
                console.log("Stakeholder fetched successfully");
                result(null, res);
            }
        });
}

Stakeholder.getRoutes = (project, result) => {
    Connection.query(`SELECT ROUTE FROM ${project} WHERE TRIM(ROUTE) <> '' GROUP BY ROUTE`, (err, res) => {
        if (err) {
            console.log('error');
            result(null, err);
        } else {
            console.log("Routes fetched successfully");
            result(null, res);
        }
    });
}

module.exports = Stakeholder;