'use strict';

/* Services */

angular.module('StreamerUI.services', [])
	.factory('pollingService', ['$interval', function($interval){
		var DefaultPollingTime = 1000,
			polls = {};

		return {
		    startPolling: function(name, callback, pollingTime) {
		        if (!polls[name]) {
		            polls[name] = $interval(callback, (pollingTime || DefaultPollingTime));
		        }
		    },
		    stopPolling: function(name) {
		        $interval.cancel(polls[name]);
		        delete polls[name];
		    }
		}
  }])
	.factory('gamepadService', ['pollingService', function(pollingService){
		var getGamepads = navigator.getGamepads,
				gamepads = getGamepads(),
				events = {0: {}, 1: {}, 2: {}, 3:{}, All: {}};

		return {
			init: function(fps){
				fps = fps || 60;

				pollingService.startPolling('gamepads', function(){
					oldGamepads = gamepads;
					gamepads = getGamepads();
					_.each(gamepads, function(g){

					});
				}, 1000 / fps);
			},
			gamepad: function(i){
				var list = events[i < 4 && i > 0 ? i || 'All'];

				return {
					on: function(e, callback){
						!!list[e] ? list[e].push(callback) : list[e] = [callback];
					},
					emit: function(e){
						!!list[e] ? '' : list[e] = [];
						_.each(list[e], function(callback){
							callback();
						});
					}
				}
			}
		}
	}]);
