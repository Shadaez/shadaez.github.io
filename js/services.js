'use strict';

/* Services */

angular.module('RacingUI.services', [])
	.factory('pollingService', [function(){
        var DefaultPollingTime = 1000,
        	polls = {};

        return {
            startPolling: function(name, callback, pollingTime) {
                if (!polls[name]) {
                    polls[name] = setInterval(callback, (pollingTime || DefaultPollingTime));
                }
            },
            stopPolling: function(name) {
                clearInterval(polls[name]);
                delete polls[name];
            }
        }
    }]);