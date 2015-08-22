angular.module('MainCtrl', [])
	.controller('MainController', function($http) {
		var vm = this;
		vm.formData = {};
		vm.players = {};
		vm.addPlayer = function() {
			$http.post('/api/player', vm.formData)
				.success(function(data){
					vm.players[vm.formData.player_name] = data;
					console.log(vm.players);
				}).error(function(data){
					console.log('Error: ' + data);
				});
		}
});