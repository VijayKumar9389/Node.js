const SurveyModel = require('../models/survey.models');

exports.createSurvey = (req, res) => {

    const formData = req.body;

    SurveyModel.enterSurvey(formData, (err, log) => {
        if (err)
            res.send(err);
        console.log('created ', formData);
        res.send(log);
    });
}

exports.getSurvey = (req, res) => {

    const stakeholder = req.params.stakeholder;

    SurveyModel.getSurvey(stakeholder, (err, log) => {
        if(err)
            res.send(err);
        console.log('fetched survey from ', stakeholder);
        res.send(log);
    });
}   