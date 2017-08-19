(function() {

'use strict';
angular.module('GhanaSmsApp')
	.controller('DashboardController', ['$scope',
		'EndpointCallService',
		'UserDataService',
		DashboardController
	]);

	function DashboardController($scope, EndpointCallService, UserDataService) {
		$scope.testVar = 'hello world!';
		$scope.operator = {
			name: 'Operator'
		};
		$scope.dashboard = {
			messages: '',
			events: '',
			news: ''
		};


		var loginDetails = UserDataService.getLoginDetails();
		console.log(loginDetails);
		if(loginDetails.loginId === undefined
			|| loginDetails.loginId === null
			|| loginDetails.loginId === '') {
			console.log('User not logged in');
			window.location.href = '#!/';
			return;
		}


		var configUser = {
			method: 'POST',
			url: 'http://localhost:3000/user',
			headers: {
				'Content-Type': 'application/json'
			},
			data: {
				user_id: loginDetails.userId
			}
		};
		var configAdmin = {
			method: 'POST',
			url: 'http://localhost:3000/user',
			headers: {
				'Content-Type': 'application/json'
			},
			data: {
				user_id: 0
			}
		};
		var configDashboard = {
			method: 'POST',
			url: 'http://localhost:3000/dashboard',
			headers: {
				'Content-Type': 'application/json'
			},
			data: {
				user_id: loginDetails.userId
			}
		};

		var pr = EndpointCallService.callEndpoint(configUser);
		pr.then(function(success) {
			console.log(success);
			$scope.operator.name = success.data.name;
			UserDataService.setUserName(success.data.name);
		}, function(err) {
			console.log(err);
		});

		var pr = EndpointCallService.callEndpoint(configAdmin);
		pr.then(function(success) {
			console.log(success);
			UserDataService.setDefaultAdminName(success.data.name);
		}, function(err) {
			console.log(err);
		});

		var promise = EndpointCallService.callEndpoint(configDashboard);
		promise.then(function(success) {
			console.log(success);
			$scope.dashboard.messages = success.data.messageCount;
			$scope.dashboard.events = success.data.eventsCount;
			$scope.dashboard.news = success.data.newsCount;
			console.log($scope.dashboard);
		}, function(error) {
			console.log(error);
		});
	}
	
})();