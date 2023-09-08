const xlsx = require('xlsx');
const path = require('path');

const TractModel = require("../models/tract.model");
const { type } = require('os');

const HeadingJson = ['TRACT', 'PIN', 'STRUCTURE_TYPE', 'INTEREST', 'CONTACT', 'NAME', 'STREET', 'MAILING', 'PHONE', 'OCCUPANTS', 'WORKED', 'CONTACTED', 'ATTEMPTS', 'CONSULTATION', 'FOLLOWUP', 'COMMENTS', 'KEEPDELETE', 'COMMODITY', 'PIPLINESTATUS'];
const HeadingBook = ['TRACT', 'PIN/ LEGAL', 'STRUCTURE TYPE/STATUS', 'INTEREST STATUS', 'CONTACT STATUS', 'NAME(S)', 'STREET ADDRESS', 'MAILING ADDRESS', "PHONE #'s", '# OF OCCUPANTS', 'WORKS LAND (Y/N)', 'CON- TACTED (Y/N)', 'ATTEMPT DETAILS', 'CONSULT-ATION DATE', 'FOLLOW UP (Y/N)', 'COMMENTS', 'KeepDelete', 'Commodity', 'PipelineStatus'];


// get all tracts
exports.getTractList = (req, res) => {
    TractModel.getAllTracts((err, tracts) => {
        console.log("All Tracts are here");
        if (err)
            res.send(err);
        res.send(tracts);
    });
}

//Tract list seperated by tract number
exports.getTractCluster = (req, res) => {
    TractModel.getAllTracts(req.params.project, (err, tracts) => {
        console.log("All Tracts are here");
        if (err)
            res.send(err);

        var string = JSON.stringify(tracts);
        var json = JSON.parse(string);
        var tractCluster = [];
        var tractList = [];

        for (let i = 0; i < json.length; i++) {
            if (!tractList.includes(json[i].TRACT)) {
                tractList.push(json[i].TRACT)
            }
        }

        for (let z = 0; z < tractList.length; z++) {

            var tmp = [];
            var tractNo = tractList[z];

            for (let y = 0; y < json.length; y++) {
                if (json[y].TRACT === tractNo) {
                    tmp.push(json[y]);
                }
            }

            tractCluster.push(tmp);
        }

        res.send(tractCluster);
    });
}

//Tract list seperated by tract number
exports.getAdjacentTracts = (req, res) => {
    TractModel.getAllTracts((err, tracts) => {
        console.log("All Tracts are here");
        if (err)
            res.send(err);

        var string = JSON.stringify(tracts);
        var json = JSON.parse(string);
        var tractCluster = [];
        var tractList = [];

        for (let i = 0; i < json.length; i++) {
            if (!tractList.includes(json[i].TRACT)) {
                tractList.push(json[i].TRACT)
            }
        }

        for (let z = 0; z < tractList.length; z++) {

            var tmp = [];
            var tractNo = tractList[z];

            for (let y = 0; y < json.length; y++) {
                if (json[y].TRACT === tractNo) {
                    tmp.push(json[y]);
                }
            }

            tractCluster.push(tmp);
        }

        res.send(tractCluster);
    });
}

// get all tracts by id
exports.getTractbyID = (req, res) => {
    TractModel.getTractbyID(req.params.id, (err, tract) => {
        if (err)
            res.send(err);
        console.log("Tract by", tract);
        res.send(tract);
    });
}


// get all tracts by number
exports.getTractbyNo = (req, res) => {
    TractModel.getTractbyNo(req.params.tractNo, (err, tract) => {
        if (err)
            res.send(err);
        console.log("Tract by no", tract);
        res.send(tract);
    });
}

//get records accossiated with stakeholder and their tracts
exports.getRelationCluster = (req, res) => {
    TractModel.getRelationCluster({name: req.params.name, project: req.params.project}, (err, tract) => {
        if (err)
            res.send(err);

        var string = JSON.stringify(tract);
        var json = JSON.parse(string);

        var stakeholder = [];
        var idList = [];
        var cluster = [];

        //Grabs all tracts under the requested name
        for (let index = 0; index < json.length; index++) {
            if (json[index].NAME === req.params.name) {
                stakeholder.push(json[index])
            }
        }

        //Adds records with matching tracts
        for (let i = 0; i < stakeholder.length; i++) {

            var tmp = [];

            if (idList.includes(stakeholder[i].ID) === false) {

                tmp.push(stakeholder[i]);

                for (let y = 0; y < json.length; y++) {
                    //Checks for a mathcing tract number and ensures the record isnt a duplicate
                    if (stakeholder[i].TRACT === json[y].TRACT && stakeholder[i].ID !== json[y].ID) {
                        if (idList.includes(json[y].ID) === false) {
                            tmp.push(json[y]);
                            idList.push(json[y].ID);
                        }
                    }
                }
            }

            cluster.push(tmp);
        }

        for (let index = 0; index < cluster.length; index++) {
            if (cluster[index].length < 1) {
                cluster.splice(index, 1)
            }

        }

        res.send(cluster);
    });
}

// get tract by stakeholder's name
exports.getTractbyName = (req, res) => {
    TractModel.getTractbyName(req.params.name, (err, tract) => {
        if (err)
            res.send(err);

        console.log("Tract by name", tract);
        res.send(tract);
    });
}

// compiles a list of provinces/states and the citites within them
exports.getReport = (req, res) => {
    TractModel.getAllTracts(req.params.project, (err, tracts) => {
        if (err)
            res.send(err);

        var string = JSON.stringify(tracts);
        var json = JSON.parse(string);
        var singleTract = 0;
        var multiTract = 0;
        var contacted = 0;
        var attempted = 0;
        var noAttempts = 0;
        var remaining = 0;
        var missingPhone = 0;
        var total = [];
        var stakeholderList = [];

        //removes duplicate records
        for (let i = 0; i < json.length; i++) {
            if (!stakeholderList.includes(json[i].NAME)) {
                stakeholderList.push(json[i].NAME)
                total.push(json[i])
            }
        }

        //grabs to number of stakeholders contacted and not
        for (let i = 0; i < total.length; i++) {
            if (total[i].CONTACTED !== 'YES') {
                remaining++;
            } else {
                contacted++;
            }
        }

        //grabs to number of stakeholders attempted and not
        for (let i = 0; i < total.length; i++) {
            if (total[i].ATTEMPTS !== '') {
                attempted++;
            } else {
                noAttempts++;
            }
        }

        //cehcks for missing phone numbers
        for (let z = 0; z < total.length; z++) {
            if (total[z].PHONE.length < 1) {
                missingPhone++;
            }
        }

        //checks how many times the name appears in the original 
        for (let y = 0; y < total.length; y++) {

            var stakeholders = [];
            var count = 0;

            //grabs number of instances
            for (let i = 0; i < json.length; i++) {
                if (total[y].NAME === json[i].NAME) {
                    stakeholders.push(json[i].NAME);
                }
            }

            //determines if stakeholder is single tract or multie
            if (stakeholders.length > 1) {
                multiTract++;
            } else {
                singleTract++;
            }
        }
        res.send({ contacted: contacted, remaining: remaining, missingPhone: missingPhone, total: total.length, single: singleTract, multi: multiTract });
    });
}

exports.updateTract = (req, res) => {
    const tractData = req.body
    TractModel.updateTract({data: tractData, project: req.params.project}, (err, stakeholder) => {
        console.log("Tract updated");
        if (err)
            res.send(err);
        console.log("Changed Tract to", tractData)
        res.send(tractData)
    });
}

exports.getExcel = (req, res) => {
    TractModel.getAllTracts((err, tracts) => {
        var string = JSON.stringify(tracts);
        var json = JSON.parse(string);

        var newwb = xlsx.utils.book_new();
        var newws = xlsx.utils.json_to_sheet(json, { defval: "" });
        xlsx.utils.book_append_sheet(newwb, newws, "New Data");
        xlsx.writeFile(newwb, 'NewBook.xlsx');
        res.sendFile(path.resolve('./NewBook.xlsx'), 'Wascana.xlsx');
    });
}

exports.compareBook = (req, res) => {

    const arr = req.body.data.project;
    var string = JSON.stringify(arr);
    var json = JSON.parse(string);
    console.log(json)

    var newwb = xlsx.utils.book_new();
    var newws = xlsx.utils.json_to_sheet(json, { defval: "" });
    xlsx.utils.book_append_sheet(newwb, newws, "New Data");
    xlsx.writeFile(newwb, 'NewBook.xlsx');
    res.sendFile(path.resolve('./NewBook.xlsx'), 'Wascana.xlsx');
}
