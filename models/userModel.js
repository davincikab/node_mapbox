const pool = require("../db.js");

var Person = function(person) {
	this.ALIAS = person.alias;
	this.LAST_NAME = person.last_name;
	this.NAME = person.name;
	this.LAST_NAME1 = person.last_name1;
	this.COUNTRY = person.country;
	this.STATE = person.state;
	this.CITY = person.city;
	this.LONGITUDE = person.longitude;
	this.ALTITUDE  = person.latitude,
	this.DOB = person.dob;
	this.ID_ESC = person.id_esc;
	this.GEN = person.gen;
	this.PROFESSION = person.profession;
    this.PIC_PROFILE = person.pic_profile;
    this.AUTHORIZED = person.authorized;
}

Person.getAllPersons = function(result) {
    pool.getConnection(function(error, sql) {
        if(error) throw error;

        sql.query("SELECT ID_CAN, ALIAS, COUNTRY, STATE, CITY, LONGITUDE, ALTITUDE, DOB, PROFESSION, PIC_PROFILE from location_data WHERE AUTHORIZED = ?", ['Y'], function (err, res, fields) {

            if(err) {
                console.log("error: ", err);
                result(null, err);
            }
            else{
    
                result(null, res);
            }
        });

    });   
}

Person.getNewPersons = function(lastId, result) {
    pool.getConnection(function(error, sql) {
        if(error) throw error;

        sql.query("SELECT ID_CAN, ALIAS, COUNTRY, STATE, CITY, LONGITUDE, ALTITUDE, DOB, PROFESSION, PIC_PROFILE from location_data WHERE ID_CAN > ? AND AUTHORIZED = ?", [lastId, 'Y'] , function (err, res) {

            if(err) {
                console.log("error: ", err);
                result(null, err);
            }
            else{
                sql.release();
                result(null, res);
            }
        });  
    });
}

module.exports = Person;