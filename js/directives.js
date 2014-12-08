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
						steering: {type: 'axes', index: 0},
						boost: {type: 'buttons', index: 0},
						ebrake: {type: 'buttons', index: 2},
						brake: {type: 'buttons', index: 6},
						gas: {type: 'buttons', index: 7},
						shiftup: {type: 'buttons', index: 5},
						shiftdn: {type: 'buttons', index: 4}
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
				scope.updatefps = scope.updatefps || 22;
				pollingService.startPolling('gamepad',  gpCallback, (1000 / scope.updatefps));

				scope.saveBindings = function() {
					console.log('test')
					console.log(scope.keybinds);
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
					return keybind.type == 'axes' ? gp[keybind.type][keybind.index] : gp[keybind.type][keybind.index].value;
				}
			},
			template: 	"<ol class='gamepad' ng-click='showcontrols = !showcontrols' ng-init='showcontrols = true'>"+
						"<li class='steering horizontal'>"+
						"		<div class='bar' ng-style='{right: (controls.steering > 0? 50 - controls.steering * 50 : 50) + \"%\", left: (controls.steering > 0? 0 : controls.steering * 50) + \"%\"}'></div>"+
						"	</li>"+
						"	<li class='boost'>"+
						"		<div class='button' ng-class='{down: controls.boost}'>&uArr;</div>"+
						"	</li>"+
						"	<li class='e-brake'>"+
						"		<div class='button' ng-class='{down: controls.ebrake}'>E</div>"+
						"	</li>"+
						"	<li class='brake vertical'>"+
						"		<div class='bar' ng-style='{top: 100 - controls.brake * 100 + \"%\"}'></div>"+
						"	</li>"+
						"	<li class='gas vertical'>"+
						"		<div class='bar' ng-style='{top: 100 - controls.gas * 100 + \"%\"}'></div>"+
						"	</li>"+
						"	<li class='shifter' ng-if='keybinds.manual'>"+
						"		<div class='up-btn button' ng-class='{down: controls.shiftup}'>&#9650;</div>"+
						"		<div class='down-btn button' ng-class='{down: controls.shiftdn}'>&#9660;</div>"+
						"	</li>"+
						"</ol>"+
						"<div ng-if='showcontrols'>"+
						"	<p>Controller index:</p>"+
						"	<input type='text' ng-model='keybinds.controller'>"+
						"	<p>Steering:</p>"+
						"	<input type='text' ng-model='keybinds.steering.index'>"+
						"	<p>Boost:</p>"+
						"	<input type='text' ng-model='keybinds.boost.index'>"+
						"	<p>E-brake:</p>"+
						"	<input type='text' ng-model='keybinds.ebrake.index'>"+
						"	<p>Brake:</p>"+
						"	<input type='text' ng-model='keybinds.brake.index'>"+
						"	<p>Gas:</p>"+
						"	<input type='text' ng-model='keybinds.gas.index'>"+
						"	<p>Shift Up:</p>"+
						"	<input type='text' ng-model='keybinds.shiftup.index'>"+
						"	<p>Shift Down:</p>"+
						"	<input type='text' ng-model='keybinds.shiftdn.index'>"+
						"	<p>Show shifter:"+
						"	<input type='checkbox' ng-model='keybinds.manual'></p>"+
						"	<button type='button' ng-click='saveBindings()'>Save</button>"+
						"</div>"
		}
	}]);