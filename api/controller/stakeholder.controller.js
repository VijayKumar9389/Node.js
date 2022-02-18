const StakeholderModel = require("../models/stakeholder.model");

// get all stakeholders
exports.getStakeholderList = (req, res) => {
    StakeholderModel.getAllStakeholders((err, stakeholders) => {
        if (err)
            res.send(err);
        console.log("stakeholders", stakeholders)
        res.send(stakeholders);
    });
}

// get stakeholder by name
exports.getStakeholderbyName = (req, res) => {
    StakeholderModel.getStakeholderbyName(req.params.name, (err, stakeholder) => {
        if (err)
            res.send(err);
        console.log("Fetched the following stakeholder", stakeholder)
        res.send(stakeholder);
    });
}


// get stakeholders who share the same number as the requested stakeholder
exports.getMatchingNumbers = (req, res) => {
    StakeholderModel.getAllStakeholders((err, stakeholder) => {
        
        if (err)
            res.send(err);

        var string = JSON.stringify(stakeholder);
        var json = JSON.parse(string);
        var clientName = req.params.name;
        var clientNumberList;
        var tmp = [];
        var relatives = [];

        //Grabs the requested stakeholders number
        for (let y = 0; y < json.length; y++) {
            if (clientName === json[y].NAME) {
                clientNumberList = json[y].PHONE.split(',');
                break;
            }
        }

        //Confirms Theres a valid Phone No
        if (clientNumberList !== undefined) {
            //Grabs each number from the requested stakeholder 
            for (let i = 0; i < clientNumberList.length; i++) {
                var clientNumber = clientNumberList[i].split(':');
                //Splits each number
                for (let y = 0; y < json.length; y++) {
                    var searchNoList = json[y].PHONE.split(',');
                    //compares each number to the requested stakeholders
                    for (let x = 0; x < searchNoList.length; x++) {
                        var searchNo = searchNoList[x].split(':');
                        if (json[y].NAME !== clientName && json[y].PHONE !== "") {
                            if (clientNumber[1] === searchNo[1] && !tmp.includes(json[y].NAME)) {
                                relatives.push(json[y]);
                                tmp.push(json[y].NAME);
                            }
                        }
                    }
                }
            }
        }
        res.send(relatives);
    });
}


// get stakeholders who share the same street or mailing address as the requested stakeholder
exports.getMatchingAddress = (req, res) => {
    StakeholderModel.getAllStakeholders((err, stakeholder) => {
        if (err)
            res.send(err);

        var string = JSON.stringify(stakeholder);
        var json = JSON.parse(string);
        var clientName = req.params.name;
        var reqStreet;
        var reqMailing;
        var relatives = [];
        var tmp = [];

        //Grabs the requested stakeholders number
        for (let y = 0; y < json.length; y++) {
            if (clientName === json[y].NAME) {
                reqStreet = json[y].STREET;
                reqMailing = json[y].MAILING;
                break;
            }
        }

        //Grabs each number from the requested stakeholder 
        for (let i = 0; i < json.length; i++) {
            var stakeholderStreet = json[i].STREET;
            var stakeholderMailing = json[i].MAILING;
            //Splits each number
            if (reqStreet === stakeholderStreet || reqMailing === stakeholderMailing) {
                if (!tmp.includes(json[i].NAME) && json[i].NAME !== clientName && json[i]) {
                    if (stakeholderMailing !== "" && stakeholderStreet !== "") {
                        relatives.push(json[i]);
                        tmp.push(json[i].NAME);
                    }
                }
            }
        }
        res.send(relatives);
    });
}


// update stakeholder's information across the database by name
exports.updateStakeholder = (req, res) => {
    const stakeholderData = req.body
    StakeholderModel.updateStakeholder(stakeholderData, (err, stakeholder) => {
        console.log("Stakeholder updated");
        if (err)
            res.send(err);
        console.log("Changed info to", stakeholderData)
        res.send(stakeholderData)
    });
}


