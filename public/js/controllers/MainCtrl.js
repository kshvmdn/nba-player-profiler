angular.module('MainCtrl', [])
	.controller('MainController', function($http) {
		var vm = this;
		vm.formData = {};
		vm.players = {}
		//vm.player = {"info":{"bbr_link":"http://www.basketball-reference.com/players/r/rosede01.html","name":"Derrick Rose","img_src":"http://d2cwpp38twqe55.cloudfront.net/images/images-002/players/rosede01.png","current_contract":"$20,093,063"},"stats":{"total":{"g":340,"gs":339,"mp":12113,"fg":2655,"fga":5872,"fg_pct":0.452,"fg3":306,"fg3a":1008,"fg3_pct":0.304,"fg2":2349,"fg2a":4864,"fg2_pct":0.483,"efg_pct":0.478,"ft":1305,"fta":1601,"ft_pct":0.815,"orb":312,"drb":952,"trb":1264,"ast":2205,"stl":284,"blk":141,"tov":1011,"pf":487,"pts":6921},"per_game":{"g":340,"gs":339,"mp_per_g":35.6,"fg_per_g":7.8,"fga_per_g":17.3,"fg_pct":0.452,"fg3_per_g":0.9,"fg3a_per_g":3,"fg3_pct":0.304,"fg2_per_g":6.9,"fg2a_per_g":14.3,"fg2_pct":0.483,"efg_pct":0.478,"ft_per_g":3.8,"fta_per_g":4.7,"ft_pct":0.815,"orb_per_g":0.9,"drb_per_g":2.8,"trb_per_g":3.7,"ast_per_g":6.5,"stl_per_g":0.8,"blk_per_g":0.4,"tov_per_g":3,"pf_per_g":1.4,"pts_per_g":20.4},"per_36_min":{"g":340,"gs":339,"mp":12113,"fg_per_mp":7.9,"fga_per_mp":17.5,"fg_pct":0.452,"fg3_per_mp":0.9,"fg3a_per_mp":3,"fg3_pct":0.304,"fg2_per_mp":7,"fg2a_per_mp":14.5,"fg2_pct":0.483,"ft_per_mp":3.9,"fta_per_mp":4.8,"ft_pct":0.815,"orb_per_mp":0.9,"drb_per_mp":2.8,"trb_per_mp":3.8,"ast_per_mp":6.6,"stl_per_mp":0.8,"blk_per_mp":0.4,"tov_per_mp":3,"pf_per_mp":1.4,"pts_per_mp":20.6},"per_100_poss":{"g":340,"gs":339,"mp":12113,"fg_per_poss":11.5,"fga_per_poss":25.3,"fg_pct":0.452,"fg3_per_poss":1.3,"fg3a_per_poss":4.3,"fg3_pct":0.304,"fg2_per_poss":10.1,"fg2a_per_poss":21,"fg2_pct":0.483,"ft_per_poss":5.6,"fta_per_poss":6.9,"ft_pct":0.815,"orb_per_poss":1.3,"drb_per_poss":4.1,"trb_per_poss":5.5,"ast_per_poss":9.5,"stl_per_poss":1.2,"blk_per_poss":0.6,"tov_per_poss":4.4,"pf_per_poss":2.1,"pts_per_poss":29.9,"":null,"off_rtg":107,"def_rtg":107}}};
		this.addPlayer = function() {
			$http.post('/api/player', vm.formData)
				.success(function(data){
					//vm.formData = {};
					vm.players[vm.formData.player_name] = data;
					console.log(vm.players);
				})
				.error(function(data){
					console.log('Error: ' + data);
				});
		}
});