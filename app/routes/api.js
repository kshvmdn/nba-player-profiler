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

		// INFO
		$("#info_box").filter(function() {
			player.info.name = $(this).find('h1').text();
			player.info.img_src = $(this).find('img').attr('src');
			// TODO get more info lol
		});

		$('#contract').filter(function() {
			
		})
		
		// STATS
		var scrape_table_values = function(tableAttr, cb) {
			$(tableAttr).filter(function(){
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
				cb(null, stats);
			});
		}

		// all time
		scrape_table_values('#totals', function(err, res) {
			player.stats.total = res;
		});

		// per game
		scrape_table_values('#per_game', function(err, res) {
			player.stats.per_game = res;
		});

		// per 36 min
		scrape_table_values('#per_minute', function(err, res) {
			player.stats.per_36_min = res;
		})

		
		res.send(player);
	});
});

module.exports = router;
