var express = require("express");
var request = require("request");
var cheerio = require("cheerio");

var router = express.Router();

router.post("/player", function(req,res) {
	var name = req.body.player_name.trim();
	var nameArr = name.split(" ");
	
	// first letter of last name;
	var l = nameArr[1][0];

	var host = "http://www.basketball-reference.com";
	var playerList = host + "/players/" + l + "/";

	var getPlayerPath = function(callback) {
		request(playerList, function(error, response, body) {
			if (error) throw error;
			var $ = cheerio.load(body);
			var playerPath = $('#players tbody tr').filter(function() {
				return $(this).find('td').first().find('a').text().toLowerCase() === name.toLowerCase();
			}).find('a').attr('href');

			callback(null, playerPath);
		});
	}

	var getPlayerInfo = function(playerUrl, callback) {
		var url = playerUrl;
		request(url, function(error, response, body) {
			if (error) throw error;
			var $ = cheerio.load(body);

			var player = {info: {}, stats: {}}

			player.info.bbr_link = url;

			// INFO
			$("#info_box").filter(function() {
				player.info.name = $(this).find('h1').text();
				player.info.img_src = $(this).find('img').attr('src');
				// TODO get more info lol
			});

			$('#contract').filter(function() {
				// if table#contract exists, player's still active
				player.info.current_contract = $(this).find('tr').last().find('td').eq(1).text()
			});
			
			// STATS
			var scrapeTable = function(tableAttr, cb) {
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
			scrapeTable('#totals', function(err, res) {
				player.stats.total = res;
			});

			// per game
			scrapeTable('#per_game', function(err, res) {
				player.stats.per_game = res;
			});

			// per 36 minutes
			scrapeTable('#per_minute', function(err, res) {
				player.stats.per_36_min = res;
			});
			
			// per 100 possessions
			scrapeTable('#per_poss', function(err, res) {
				player.stats.per_100_poss = res;
			});

			callback(null, player);
		});
	}

	getPlayerPath(function(err, path) {
		var url = host + path;
		getPlayerInfo(url, function(err, info) {
			res.json(info);
		});
	});
})

module.exports = router;
