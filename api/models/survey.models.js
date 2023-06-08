var Connection = require('../../config/database');

var Survey = function(formData) {
    this.stakeholder = formData.stakeholder || '';
    this.street_address = formData.street_address || '';
    this.mailing_address = formData.mailing_address || '';
    this.email = formData.email || '';
    this.phone = formData.phone || '';
    this.familiarity = formData.familiarity || '';
    this.receivedFromPMC = formData.receivedFromPMC || [];
    this.shareInformation = formData.shareInformation || '';
    this.rating = formData.rating || '';
    this.permissionRequired = formData.permissionRequired || [];
    this.pipelineMarkers = formData.pipelineMarkers || '';
    this.diggingProcedure = formData.diggingProcedure || '';
    this.heardOfOneCall = formData.heardOfOneCall || '';          // Add this line
    this.lastUsedOneCall = formData.lastUsedOneCall || '';        // Add this line
};

Survey.enterSurvey = (formData, result) => {
    Connection.query(
        "INSERT INTO Bodo_2023_survey (stakeholder, street_address, mailing_address, email, phone, diggingProcedure, familiarity, heardOfOneCall, lastUsedOneCall, permissionRequired, pipelineMarkers, rating, receivedFromPMC) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            formData.stakeholder,
            formData.street_address,
            formData.mailing_address,
            formData.email,
            formData.phone,
            formData.diggingProcedure,
            formData.familiarity,
            formData.heardOfOneCall,      // Corrected: Ensure the value is assigned correctly
            formData.lastUsedOneCall,     // Corrected: Ensure the value is assigned correctly
            JSON.stringify(formData.permissionRequired),
            formData.pipelineMarkers,
            formData.rating,
            JSON.stringify(formData.receivedFromPMC),
        ],
        (err, res) => {
            if (err) {
                console.log('error creating log', err);
                result(err, null);
            } else {
                console.log("Successfully created log");
                result(null, res);
            }
        }
    );
};

Survey.getSurvey = (stakeholder, result) => {
    Connection.query("select * from Bodo_2023_survey Where stakeholder = ?", stakeholder, (err, res) => {
        if (err) {
            console.log(err);
            result(null, err);
        } else {
            console.log("All Logs");
            result(null, res);
        }
    });
}

module.exports = Survey;