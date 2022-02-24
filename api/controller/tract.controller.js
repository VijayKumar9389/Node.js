const TractModel = require("../models/tract.model");

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
        var tmp = [];
        var idList = []
        var cluster = [];

        //Grabs all tracts under the requested name
        for (let index = 0; index < json.length; index++) {
            if (json[index].NAME === req.params.name) {
                tmp.push(json[index])
            }
        }

        //Adds records with matching tracts
        for (let i = 0; i < tmp.length; i++) {
            if (idList.includes(tmp[i].ID) === false) {
                cluster.push(tmp[i])
                for (let y = 0; y < json.length; y++) {
                    //Checks for a mathcing tract number and ensures the record isnt a duplicate
                    if (tmp[i].TRACT === json[y].TRACT && tmp[i].ID !== json[y].ID) {
                        if (idList.includes(json[y].ID) === false) {
                            console.log(json[y].ID)
                            cluster.push(json[y]);
                            idList.push(json[y].ID);
                        }
                    }
                }
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
            if(!stakeholderList.includes(json[i].NAME)){
                stakeholderList.push(json[i].NAME)
                total.push(json[i])
            }
        }

        for (let i = 0; i < total.length; i++) {
            if (total[i].CONTACTED !== 'YES'){
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
            if(stakeholders.length > 1){
                multiTract++;
            } else {
                singleTract++;
            }


        }



        res.send({contacted: contacted, remaining: remaining, total: total.length, single: singleTract, multi: multiTract })


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