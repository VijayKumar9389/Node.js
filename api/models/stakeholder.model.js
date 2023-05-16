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
}

Stakeholder.getAllStakeholders = (table, result) => {
    console.log(table)
    Connection.query(`SELECT NAME, CONTACT, STREET, MAILING, PHONE, CONTACTED, ATTEMPTS, CONSULTATION, FOLLOWUP, EMAIL, STAKEHOLDERCOMMENT, CORPERATION, COUNT(*) as count FROM ${process.env.TABLE} group by NAME`, table, (err, res) => {
        if (err) {
            console.log('error');
            result(null, err);
        } else {
            console.log("Stakeholders fetched successfully");
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

Stakeholder.updateStakeholder = (stakeholderData, result) => {
    Connection.query(`UPDATE ${process.env.TABLE} set NAME = ?, CONTACT = ?, STREET = ?, MAILING = ?, PHONE = ?,  CONTACTED = ?, ATTEMPTS = ?, CONSULTATION = ?, FOLLOWUP = ?, EMAIL = ?, STAKEHOLDERCOMMENT = ?, CORPERATION = ? WHERE name = ?`, 
    [stakeholderData.NEWNAME, stakeholderData.CONTACTSTATUS, stakeholderData.STREET, stakeholderData.MAILING, stakeholderData.PHONE, stakeholderData.CONTACTED, stakeholderData.ATTEMPTS, stakeholderData.CONSULTATION, stakeholderData.FOLLOWUP, stakeholderData.EMAIL, stakeholderData.STAKEHOLDERCOMMENT, stakeholderData.CORPERATION,  stakeholderData.NAME], 
    (err, res) => {
        if (err) {
            console.log('error');
            result(null, err);
        } else {
            console.log("Stakeholder fetched successfully");
            result(null, res);
        }
    });
}

module.exports = Stakeholder;