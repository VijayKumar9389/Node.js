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
exports.getAllLocations = (req, res) => {
    TractModel.getAllTracts((err, tracts) => {
        if (err)
            res.send(err);

        var provinceList = [];
        var Locationlist = [];
        var string = JSON.stringify(tracts);
        var json = JSON.parse(string);

        for (let i = 0; i < json.length; i++) {
            if (json[i].MAILING !== "") {
                var location = json[i].MAILING.split(',');
                if (!provinceList.includes(location[location.length - 2])) {
                    provinceList.push(location[location.length - 2]);
                }
            }
        }

        for (let i = 0; i < provinceList.length; i++) {
            var tmp = [];

            for (let y = 0; y < json.length; y++) {

                var location = json[y].MAILING.split(',');

                if (location[location.length - 2] === provinceList[i]) {
                    if (!tmp.includes(location[location.length - 3])) {
                        tmp.push(location[location.length - 3]);
                    }
                }

            }
            Locationlist.push({ province: provinceList[i], cities: tmp })
        }

        console.log(Locationlist)
        res.send(Locationlist);
    });
}