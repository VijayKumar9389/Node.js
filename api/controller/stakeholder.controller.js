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

// get stakeholders who share the same street or mailing address as the requested stakeholder
exports.getConnections = (req, res) => {
    StakeholderModel.getAllStakeholders(req.params.project, (err, stakeholder) => {
        if (err)
            res.send(err);

        var string = JSON.stringify(stakeholder);
        var json = JSON.parse(string);
        var clientName = req.params.name;
        var reqStreet;
        var reqMailing;
        var reqDelivery;
        var Phonerelatives = [];
        var clientNumberList;
        var relatives = [];
        var streetrelatives = [];
        var deliveryrelatives = [];
        var connections = [];


        //Grabs the requested stakeholders mailing and street address
        for (let y = 0; y < json.length; y++) {
            if (clientName === json[y].NAME) {
                reqStreet = json[y].STREET.trim();
                reqMailing = json[y].MAILING.trim();
                reqDelivery = json[y].LOCATION.trim();
                console.log(reqDelivery)
                break;
            }
        }

        //checks each stakeholders adress
        for (let i = 0; i < json.length; i++) {
            var stakeholderStreet = json[i].STREET.trim();
            //checks if street address is a match
            if (reqStreet === stakeholderStreet) {
                if (json[i].NAME !== clientName) {
                    if (stakeholderStreet !== "") {
                        streetrelatives.push(json[i]);
                    }
                }
            }
        }

        for (let i = 0; i < json.length; i++) {
            var stakeholderDelivery = json[i].LOCATION.trim();
            if (reqDelivery === stakeholderDelivery) {
                if (json[i].NAME !== clientName) {
                    if (stakeholderDelivery !== "") {
                        deliveryrelatives.push(json[i]);
                    }
                }
            }
        }

        //checks each stakeholders adress
        for (let i = 0; i < json.length; i++) {
            var stakeholderMailing = json[i].MAILING.trim();
            //checks if mailing address is a match
            if (reqMailing === stakeholderMailing) {
                if (json[i].NAME !== clientName) {
                    if (stakeholderMailing !== "") {
                        relatives.push(json[i]);
                    }
                }
            }
        }

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
                            if (clientNumber[1] === searchNo[1]) {
                                Phonerelatives.push(json[y]);
                            }
                        }
                    }
                }
            }
        }


        //Creates an array with each connection type for any related stakeholders
        for (let i = 0; i < json.length; i++) {
            let matchingPhone = false;
            let matchingAddress = false;
            let mathcingStreet = false;
            let matchingDelivery = false;

            for (let y = 0; y < Phonerelatives.length; y++) {
                if (Phonerelatives[y].NAME === json[i].NAME) {
                    matchingPhone = true;
                }
            }

            for (let x = 0; x < relatives.length; x++) {
                if (relatives[x].NAME === json[i].NAME) {
                    matchingAddress = true;
                }
            }

            for (let x = 0; x < streetrelatives.length; x++) {
                if (streetrelatives[x].NAME === json[i].NAME) {
                    mathcingStreet = true;
                }
            }

            for (let x = 0; x < deliveryrelatives.length; x++) {
                if (deliveryrelatives[x].NAME === json[i].NAME) {
                    matchingDelivery = true;
                }
            }

            if (matchingAddress || matchingPhone || mathcingStreet || matchingDelivery) {
                connections.push({ stakeholder: json[i], phone: matchingPhone, address: matchingAddress, street: mathcingStreet, delivery: matchingDelivery });
            }

        }
        res.send(connections);
    });
}

// get stakeholders who share the same street or mailing address as the requested stakeholder
exports.getRelations = (req, res) => {
    StakeholderModel.getAllStakeholders(req.params.project, (err, stakeholder) => {
        if (err)
            res.send(err);

        var string = JSON.stringify(stakeholder);
        var json = JSON.parse(string);
        var clientName = req.params.name;
        const connections = [];



        for (let i = 0; i < json.length; i++) {

            let client = getLastNames(json[i].NAME);
            let target = getLastNames(clientName);

            if (hasCommonElement(client, target) && json[i].NAME !== clientName) {
                console.log(json[i].NAME + " is related to " + clientName);
                connections.push(json[i]);
            }
        }

        res.send(connections);

    });
}

function hasCommonElement(arr1, arr2) {
    return arr1.some((item1) => {
        return arr2.some((item2) => item1 === item2);
    });
}

function getLastNames(name) {
    const parts = name.split(/[:,]+/);
    const toRemove = ["ATTN", "HOLDINGS", "ATTN:", "LIMITED", "FARMS"];
    const lastNames = [];

    for (let i = 0; i < parts.length; i++) {
        let fullName = parts[i].split(" ");
        const lastName = fullName[fullName.length - 1];

        // Check if lastName exists in the toRemove array
        if (!toRemove.includes(lastName)) {
            lastNames.push(lastName);
        }
    }

    return lastNames;
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


