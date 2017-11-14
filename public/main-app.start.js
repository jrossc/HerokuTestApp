"use strict";

angular.module('MainApp', ['ui.bootstrap', 'ngAnimate'
	])

.controller("MainController", function ($scope, $http) {
	//initialize scope variables
	$scope.people = [];
	$scope._name = "";
	$scope._location = "";
	$scope.user = {
		name: function (theName) {
			if (angular.isDefined(theName)) {
				$scope._name = theName;
			}
			return $scope._name;
		}
		(),
		location: function (theLocation) {
			if (angular.isDefined(theLocation)) {
				$scope._location = theLocation;
			}
			return $scope._location;
		}
		()
	};

	$scope.alerts = [];
	$scope.addAlert = function(type, message) {
			$scope.alerts.push({type: type, msg: message});
		};

	$scope.CloseSuccessByTimeout = function(index){
						$scope.alerts.splice(index, 1); 
	}

	//initialize config for headers
	var config = {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'ZUMO-API-VERSION': '2.0.0'
		},
	};

	//call getNames function
	getNames();

	function getNames() {
		$http.get('/api/users', config)
		.then(function (res) {
			console.log(res);
			$scope.people = res.data;
		});
	}

	// add in resource
	function addName(user) {
		var confirmres = confirm("You are about to add data, Continue?");

		if (confirmres == true) {
			//check if user exists
			$http.get('/api/users/id', {
				params: {
					name: user.name,
					location: user.location
				},
				headers: {
					'Access-Control-Allow-Origin': '*',
					'ZUMO-API-VERSION': '2.0.0'
				},
				dataType: "json",
				contentType: "application/json; charset=utf-8"
			})
			.then(function (res) {
				$scope.retData = res;
				var obj = $scope.retData;
				if (obj.data.length > 0) //if there is, alert
				{
					//alert('User exists!');
					$scope.addAlert('danger', 'User exists in the database!');
				} else //if none, then POST
				{
				$http.post('/api/users', user, config)
				.then(function (res) {
					console.log(res.data);
					//alert('Added successfully!');
					$scope.addAlert('success', 'Added successfully!');
					$scope.getNames();
				})
				.catch (function (res) {
					alert(res);
				});
				}
			})
			.catch (function (res) {
				alert(res);
			});
			
		}
	}

	function delName(user) {
		var confirmres = confirm("You are about to delete this record. Action cannot be undone. Continue?");
		var retrievedId = "";

		if (confirmres == true) {
			//get the ID via web service
			$http.get('/api/users/id', {
				params: {
					name: user.name,
					location: user.location
				},
				headers: {
					'Access-Control-Allow-Origin': '*',
					'ZUMO-API-VERSION': '2.0.0'
				},
				dataType: "json",
				contentType: "application/json; charset=utf-8"
			})
			.then(function (res) {
				$scope.retData = res;
				var obj = $scope.retData;
				if (obj.data.length == 0) {
					//alert('No data found');
					$scope.addAlert('danger', 'No data found!');
				} else {
					angular.forEach(obj.data, function (item) {
						//perform delete after getting the ID and append it to url
						$http.delete ('/api/users/' + item._id, config)
						.then(function (res) {
							$scope.addAlert('success','Item with Item ID: ' + item._id + ' deleted');
							$scope.getNames();
							//alert('item with item ID: ' + item._id + ' deleted');
						});
					});
				}
			})
			.catch (function (res) {
				alert(res);
			});
		}
	}

	$scope.addName = addName;
	$scope.getNames = getNames;
	$scope.delName = delName;

})