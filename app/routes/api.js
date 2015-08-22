var express = require("express");
var request = require("request");
var cheerio = require("cheerio");

var router = express.Router();

router.get("/:url", function(req,res) {
	//var url = req.params.url;
	var url = "http://www.basketball-reference.com/players/r/rosede01.html";

	request(url, function(error, response, body) {
		if (error) throw error;
		var $ = cheerio.load(body);

		var player_info = {name: "", img_src: ""}
		$("#info_box").filter(function() {
			player_info.name = $(this).find('h1').text();
			player_info.img_src = $(this).find('img').attr('src');
		});
		res.send(player_info);
	});
});

module.exports = router;
