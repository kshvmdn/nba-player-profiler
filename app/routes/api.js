var express = require("express");
var request = require("request");
var cheerio = require("cheerio");

var router = express.Router();

router.post("/player", function(req,res) {
	var name = req.body.player_name.toLowerCase().trim();
	var nameArr = name.split(" ");
		
	// first letter of last name (or first name if only one name) -- not working with single names (?)
	var l = (nameArr.length > 1) ? nameArr[1][0] : nameArr[0][0];

	var host = "http://www.basketball-reference.com";
	var playerList = host + "/players/" + l + "/";

	var scrape_bbr_path = function(callback) {
		request(playerList, function(error, response, body) {
			if (error) { callback(true); return; }

			var $ = cheerio.load(body);
			var playerPath = $('#players tbody tr').filter(function() {
				return $(this).find('td').first().find('a').text().toLowerCase() === name.toLowerCase();
			}).find('a').attr('href');

			callback(null, playerPath);
		});
	};

	var scrape_bbr_stats = function(playerUrl, callback) {
		var url = playerUrl;
		request(url, function(error, response, body) {
			if (error) { callback(true); return; }
			var $ = cheerio.load(body);

			var player = {info: {}, stats: {}}

			player.bbr_link = url;

			// if table#contract exists, player's still active
			$('#contract').filter(function() {
				player.info.current_contract = $(this).find('tr').last().find('td').eq(1).text()
			});

			var scrape_stats_table = function(tableAttr, cb) {
				$(tableAttr).filter(function(){
					var stats = {};
					var temp = [];

					// get values (from footer)
					$(this).find('tfoot td').each(function(i, el) {
						if (i > 4) temp.push(parseFloat($(this).text()));
					});

					// get heading names and assign values (from footer) to respective headings
					$(this).find('thead th').each(function(i, el) {
						if (i > 4) stats[$(this).attr('data-stat')] = temp[i-5];
					});
					cb(null, stats);
				});
			}

			// all time
			scrape_stats_table('#totals', function(err, res) { player.stats.total = res; });
			// per game
			scrape_stats_table('#per_game', function(err, res) { player.stats.per_game = res; });
			// per 36 minutes
			scrape_stats_table('#per_minute', function(err, res) { player.stats.per_36_min = res; });
			// per 100 possessions
			scrape_stats_table('#per_poss', function(err, res) { player.stats.per_100_poss = res; });

			callback(null, player);
		});
	};

	var scrape_nba_data = function(cb) {
		var encoded_name = name.split(" ").join("_");
		var url = 'http://www.nba.com/playerfile/'+encoded_name+'/';
		request(url, function(error, response, body) {
			if (error) { cb(true); }

			var playerInfo = {};
			playerInfo.nba_link = url;

			var $ = cheerio.load(body);

			// name 
			playerInfo['name'] = $('.player-name').text();

			// img
			$('.player-headshot').filter(function() {
				playerInfo['img_src'] = $(this).find('img').attr('src');
			});

			// info
			$('.player-info').filter(function(){
				var num_position = $(this).find('.num-position').text().trim().split(' | ');
				playerInfo['num'] = num_position[0];
				playerInfo['pos'] = num_position[1];
				playerInfo['team'] = $(this).find('.player-team').text();
			});
			
			cb(null, playerInfo);
		});
	};

	scrape_bbr_path(function(err, path) {
		var url = host + path;
		scrape_bbr_stats(url, function(err, player_data) {
			scrape_nba_data(function(err, nba_data) {
				if (typeof player_data !== 'undefined' && player_data) {
					player_data.info.team = nba_data.team;
					player_data.info.position = nba_data.pos;
					player_data.info.number = nba_data.num;
					player_data.info.name = nba_data.name;
					player_data.info.img_src = nba_data.img_src;
					player_data.nba_link = nba_data.nba_link;
					res.json(player_data);
				} else {
					res.status(400).send('Player not found');
				}
			});
		});
	});
});

module.exports = router;