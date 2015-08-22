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

		var player = {info: {}, stats: {}}

		// player info
		$("#info_box").filter(function() {
			player.info.name = $(this).find('h1').text();
			player.info.img_src = $(this).find('img').attr('src');
			// TODO get more info lol
		});

		// player stats
		$('#per_game').filter(function() {
			var stats = {};
			var temp = [];
			$(this).find('tfoot td').each(function(i, el) {
				if (i > 4)
					temp.push(parseFloat($(this).text()));
			});
			$(this).find('thead th').each(function(i, el) {
				if (i > 4)
					stats[$(this).attr('data-stat')] = temp[i-5];
			});
			player.stats.per_game = stats;
		});
		res.send(player);
	});
});

module.exports = router;
