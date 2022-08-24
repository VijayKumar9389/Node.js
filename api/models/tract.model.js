var Connection = require('../../config/database');

var Tract = (tract) => {
    this.id = tract.id;
    this.tractNo = tract.tractNo;
    this.pin = tract.pin;
    this.structure_type = tract.structure_type;
    this.interest = tract.interest;
    this.contact = tract.contact;
    this.name = tract.name;
    this.street = tract.street;
    this.mailing = tract.mailing;
    this.phone = tract.phone;
    this.occupants = tract.occupants;
    this.worked = tract.worked;
    this.contacted = tract.contacted;
    this.attempts = tract.attempts;
    this.consultation = tract.consultation;
    this.followup = tract.followup;
    this.comments = tract.comments;
    this.keepdelete = tract.keepdelete;
    this.commodity = tract.commodity;
    this.pipelinestatus = tract.pipelinestatus;
}

Tract.getAllTracts = (result) => {
    Connection.query(`select * from ${process.env.TABLE}`, (err, res) => {
        if (err) {
            console.log('error');
            result(null, err);
        } else {
            console.log("Tracts fetched successfully");
            result(null, res);
        }
    });
}


// get tract by id from data base
Tract.getTractbyID = (id, result) => {
    Connection.query(`SELECT * from ${process.env.TABLE} where id=?, id`, (err, res)=>{
        if(err){
            console.log('Error fetching tract by id');
            result(null, err);
        } else {
            result(null, res);
        }
    });
}

Tract.getTractbyNo = (tractNo, result) => {
    Connection.query(`SELECT * from ${process.env.TABLE} where tract=?`, tractNo, (err, res)=>{
        if(err){
            console.log('Error fetching tract by number');
            result(null, err);
        } else {
            result(null, res);
        }
    });
}

Tract.getTractbyName = (name, result) => {
    Connection.query(`SELECT * from ${process.env.TABLE} where name=?`, name, (err, res)=>{
        if(err){
            console.log('Error fetching tract by number');
            result(null, err);
        } else {
            result(null, res);
        }
    });
}

Tract.getRelationCluster = (name, result) => {
    Connection.query(`select * from ${process.env.TABLE}`, (err, res) => {
        if (err) {
            console.log('error');
            result(null, err);
        } else {
            console.log("Tracts fetched successfully");
            result(null, res);
        }
    });
}

Tract.updateTract = (tractData, result) => {
    Connection.query(`UPDATE ${process.env.TABLE} set STRUCTURE_TYPE = ?, INTEREST = ?, OCCUPANTS = ?, WORKED = ?, COMMENTS = ? WHERE ID = ?`, 
    [tractData.STRUCTURE_TYPE, tractData.INTEREST, tractData.OCCUPANTS, tractData.WORKED, tractData.COMMENTS, tractData.ID], 
    (err, res) => {
        if (err) {
            console.log('error');
            result(null, err);
        } else {
            console.log("Tract updated successfully");
            result(null, res);
        }
    });
}

module.exports = Tract;