var express = require("express");
var request = require("request");
var cheerio = require("cheerio");

var router = express.Router();

router.get("/:url", function(req,res) {
	//var url = req.params.url;
	var url = "http://www.basketball-reference.com/players/r/rosede01.html";
	res.json({title:"Derrick Rose", info: url});
});

module.exports = router;
