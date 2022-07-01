const xlsx = require('xlsx');
const path = require('path');

const TractModel = require("../models/tract.model");

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
    TractModel.getRelationCluster(req.params.name, (err, tract) => {
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
            if(cluster[index].length < 1) {
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
    TractModel.getAllTracts((err, tracts) => {
        if (err)
            res.send(err);

        var string = JSON.stringify(tracts);
        var json = JSON.parse(string);
        var singleTract = 0;
        var multiTract = 0;
        var contacted = 0;
        var remaining = 0;
        var total = [];
        var stakeholderList = [];

        //removes duplicate records
        for (let i = 0; i < json.length; i++) {
            if (!stakeholderList.includes(json[i].NAME)) {
                stakeholderList.push(json[i].NAME)
                total.push(json[i])
            }
        }

        for (let i = 0; i < total.length; i++) {
            if (total[i].CONTACTED !== 'YES') {
                remaining++;
            } else {
                contacted++;
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
        res.send({ contacted: contacted, remaining: remaining, total: total.length, single: singleTract, multi: multiTract });
    });
}

exports.updateTract = (req, res) => {
    const tractData = req.body
    TractModel.updateTract(tractData, (err, stakeholder) => {
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

// function createReport(book, db) {

//     const A = [];

//     for (let index = 0; index < db.length; index++) {

//         bookIndex = index++;

//         if(book[bookIndex].NAME != db[index].NAME){

//         }
//     }

//     console.log(A);

//     var newwb = xlsx.utils.book_new();
//     var newws = xlsx.utils.json_to_sheet(A);
//     xlsx.utils.book_append_sheet(newwb, newws, "New Data");
//     xlsx.writeFile(newwb, 'FinalBook.xlsx');
// }

exports.compareBook = (req, res) => {

    if (!req.file) {

        console.log('no file')
        res.send({ msg: 'no file' });

    } else {
        //grabs data from the recieved book
        const wb = xlsx.readFile(path.resolve("./tmp/ProjectBook.xlsx"));
        const ws = wb.Sheets["Copy of Wascana"];
        const data = xlsx.utils.sheet_to_json(ws, { defval: "", skipHeader: true, header: HeadingJson });

        //grabs data from the DB
        TractModel.getAllTracts((err, tracts) => {
            console.log("All Tracts are here");
            if (err) res.send(err);
            createReport(data, tracts);
            res.send(tracts);
        });
    }
}
