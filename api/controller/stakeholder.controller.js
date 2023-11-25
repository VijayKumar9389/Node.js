const StakeholderModel = require("../models/stakeholder.model");

// get all stakeholders
exports.getStakeholderList = (req, res) => {

    StakeholderModel.getAllStakeholders(req.params.project, (err, stakeholders) => {
        if (err)
            res.send(err);
        // console.log("stakeholders", stakeholders)
        res.send(stakeholders);
    });
}

exports.getRoutes = (req, res) => {
    StakeholderModel.getRoutes(req.params.project, (err, routes) => {
        if (err)
            res.send(err);
        // console.log("stakeholders", stakeholders)
        res.send(routes);
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

exports.getConnections = (req, res) => {
    StakeholderModel.getAllStakeholders(req.params.project, (err, stakeholders) => {
        if (err) {
            return res.status(500).send(err); // Handle the error appropriately
        }

        const clientName = req.params.name;
        const clientLastNames = getLastNames(clientName);

        const { STREET, MAILING, LOCATION, PHONE } = stakeholders.find(stakeholder => stakeholder.NAME === clientName) || {};

        const connectionsAndRelations = [];

        stakeholders.forEach(stakeholder => {
            if (stakeholder.NAME !== clientName) {
                const targetLastNames = getLastNames(stakeholder.NAME);
                const matchName = hasCommonElement(clientLastNames, targetLastNames);

                const matchStreet = (STREET && stakeholder.STREET === STREET);
                const matchMailing = (MAILING && stakeholder.MAILING === MAILING);
                const matchDelivery = (LOCATION && stakeholder.LOCATION === LOCATION);

                const matchPhone = PHONE && stakeholder.PHONE && PHONE.split(',').some(clientPhone => {
                    const [, clientNumber] = clientPhone.split(':');
                    return stakeholder.PHONE.includes(`:${clientNumber}`);
                });

                if (matchName || matchStreet || matchMailing || matchDelivery || matchPhone) {
                    connectionsAndRelations.push({
                        stakeholder: stakeholder,
                        name: matchName,
                        phone: matchPhone,
                        street: matchStreet,
                        mailing: matchMailing,
                        delivery: matchDelivery
                    });
                }
            }
        });

        res.status(200).json(connectionsAndRelations);
    });
}

function hasCommonElement(arr1, arr2) {
    const commonElements = arr1.filter(item1 => arr2.includes(item1));
    return commonElements.length > 0 ? commonElements.join(', ') : "";
}


function getLastNames(name) {
    // Remove anything within parentheses and trim spaces
    const cleanedName = name.replace(/\([^)]*\)/g, '').trim();

    const parts = cleanedName.split(/[:,]+/);
    const toRemove = ["ATTN", "HOLDINGS", "ATTN:", "LIMITED", "FARMS", "INC", "CORPORATION"];
    const lastNames = [];

    for (let i = 0; i < parts.length; i++) {
        let fullName = parts[i].split(" ");
        const lastName = fullName[fullName.length - 1];

        // Check if lastName exists in the toRemove array
        if (!toRemove.includes(lastName)) {
            lastNames.push(lastName);
        }
    }

    // Use Set to remove duplicates
    const uniqueLastNames = [...new Set(lastNames)];

    return uniqueLastNames;
}



exports.getRelations = (req, res) => {
    StakeholderModel.getAllStakeholders(req.params.project, (err, stakeholders) => {
        if (err) {
            return res.status(500).send(err); // Handle the error appropriately
        }

        const clientName = req.params.name;
        const clientLastNames = getLastNames(clientName);

        const connections = stakeholders
            .filter(stakeholder => stakeholder.NAME !== clientName)
            .filter(stakeholder => hasCommonElement(clientLastNames, getLastNames(stakeholder.NAME)))
            .map(({ NAME }) => ({ NAME }));

        res.status(200).json(connections);
    });
}





// compiles a list of provinces/states and the citites within them
exports.getAllLocations = (req, res) => {
    StakeholderModel.getAllStakeholders(req.params.project, (err, stakeholder) => {
        if (err)
            res.send(err);

        //variables
        var provinceList = [];
        var Locationlist = [];
        var string = JSON.stringify(stakeholder);
        var json = JSON.parse(string);
        var missing = 0;

        for (let z = 0; z < json.length; z++) {

            var locationChars = json[z].MAILING.split(',');

            if (json[z].MAILING === '' && json[z].STREET === '') {
                missing++;
            } else if (locationChars.length < 3) {
                missing++;
            }
        }

        Locationlist.push({ province: 'MISSING', count: missing, cities: [] });


        //adds provinces or states
        for (let i = 0; i < json.length; i++) {
            // checks if address is empty
            if (json[i].MAILING !== "") {
                var location = json[i].MAILING.split(',');
                //if province/state is not in the list add it
                if (!provinceList.includes(location[location.length - 2])) {
                    if (location.length > 2) {
                        provinceList.push(location[location.length - 2]);
                    }
                }
            }
        }

        //checks for cities in each province
        for (let i = 0; i < provinceList.length; i++) {

            var cityList = [];
            var test = [];
            var provinceCount = 0;

            //check every stakeholders location
            for (let y = 0; y < json.length; y++) {

                var location = json[y].MAILING.split(',');
                var city = location[location.length - 3];
                var province = location[location.length - 2];

                //checks province
                if (province === provinceList[i]) {

                    provinceCount++;
                    var cityCount = 0;

                    // adds city if it wasnt added already
                    if (!test.includes(city)) {

                        //check how many times a city appears
                        for (let x = 0; x < json.length; x++) {
                            var tmp = json[x].MAILING.split(',');
                            if (city === tmp[location.length - 3]) {
                                cityCount++;
                            }
                        }

                        test.push(city);
                        cityList.push({ name: city, count: cityCount });
                    }
                }
            }

            Locationlist.push({ province: provinceList[i], count: provinceCount, cities: cityList });
        }
        res.send(Locationlist);
    });
}

exports.getStakeholderbyRoute = (req, res) => {

    const route = req.params.route;

    StakeholderModel.getAllStakeholders((err, stakeholders) => {
        if (err)
            res.send(err);

        var string = JSON.stringify(stakeholders);
        var json = JSON.parse(string);

        console.log(json);

        res.send(stakeholders);
    });

}

// update stakeholder's information across the database by name
exports.updateStakeholder = (req, res) => {
    const stakeholderData = req.body;

    console.log(stakeholderData)

    if (stakeholderData.NEWNAME !== "") {
        StakeholderModel.updateStakeholder({ data: stakeholderData, project: req.params.project }, (err, stakeholder) => {
            console.log("Stakeholder updated");
            if (err)
                res.send(err);
            console.log("Changed info to", stakeholderData);
            res.send({ status: true })
        });

    } else {
        res.send({ status: false });
    }

    console.log(stakeholderData);


}


