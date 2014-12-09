'use strict';

/* Directives */

angular.module('RacingUI.directives', [])
	.directive('gamepad', ['pollingService', function(pollingService){
		return {
			restrict: 'E',
			scope: {updatefps: '@updatefps'},
			link: function(scope, element, attr){
				var gp, keybinds,
					defaultControls = {
						controller: 0,
						manual: true,
						steering: {axis: true, index: 0},
						boost: {axis: false, index: 0},
						ebrake: {axis: false, index: 2},
						brake: {axis: false, index: 6},
						gas: {axis: false, index: 7},
						shiftup: {axis: false, index: 5},
						shiftdn: {axis: false, index: 4}
				};
				scope.controls = {
					steering: 0,
					boost: false,
					ebrake: false,
					brake: 0,
					gas: 0,
					shiftup: false,
					shiftdn: false,
				}
				scope.keybinds = JSON.parse(localStorage.getItem('controls') || JSON.stringify(defaultControls))
				scope.updatefps = scope.updatefps || 24;
				pollingService.startPolling('gamepad',  gpCallback, (1000 / scope.updatefps));

				scope.saveBindings = function() {
					localStorage.setItem('controls', JSON.stringify(scope.keybinds));
				}

				function gpCallback(){
					scope.$apply(function(){
						keybinds = scope.keybinds;
						gp = navigator.getGamepads()[keybinds.controller];
						if(gp){
							scope.controls.steering = getValue(keybinds.steering);
							scope.controls.boost = getValue(keybinds.boost);
							scope.controls.ebrake = getValue(keybinds.ebrake);
							scope.controls.brake = getValue(keybinds.brake);
							scope.controls.gas = getValue(keybinds.gas);
							scope.controls.shiftup = getValue(keybinds.shiftup);
							scope.controls.shiftdn = getValue(keybinds.shiftdn);
						}
					});	
				}

				function getValue(keybind){
					return keybind.axis ? gp['axes'][keybind.index] : gp['buttons'][keybind.index].value;
				}
			},
			templateUrl: '/partials/gamepad.html'
		}
	}]);