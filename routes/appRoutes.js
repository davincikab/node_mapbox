const express = require('express');
const path = require('path');
const persons = require('../controller/personController.js');

// create a router 
const router = express.Router();

// register the first route
router.get("", persons.getAllPersons);
router.get("/new_persons",persons.getNewPersons);

module.exports = router;

