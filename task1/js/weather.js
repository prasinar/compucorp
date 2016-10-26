(function() {
	var app = angular.module("app", ['ngSanitize']);

	app.controller("controller", function($scope, $http) {
		//init
		$scope.message="Would you give us permission to access your location?";
		$scope.messageShow=true;
		$scope.yesNoButtonsShow=true;
		$scope.topShow=true;
		$scope.mainShow=false;

		//if access to location is allowed
		$scope.saidYes = function() {
			$scope.message="Acquiring information...";
			$scope.yesNoButtonsShow=false;
			$scope.topShow=false;
			getLocation();
			$scope.mainShow=true;
		}

		//if access to location is not allowed
		$scope.saidNo = function() {
			$scope.messageShow=false;
			$scope.yesNoButtonsShow=false;
			$scope.searchFormShow=true;
		}

		//displaying weather by value in text input
		$scope.seeWeather = function() {
			$scope.message="Acquiring information...";
			$scope.messageShow=true;
			$scope.topShow=false;

			//if it is not a number (city)
			if (isNaN($scope.location))
			{
				$http.get("http://api.openweathermap.org/data/2.5/find?q="+$scope.location+"&units=metric&type=like&APPID=71d17000e5ffe3100da7f1b8a7da36cb").then(function(response) {
					//console.log(response.data);
					showWeatherInfo(response.data.list[0]);
					$scope.mainShow=true;
				});
			}
			//else if it is number (zip code)
			else
			{
				$http.get("http://api.openweathermap.org/data/2.5/weather?zip="+$scope.location+"&units=metric&APPID=71d17000e5ffe3100da7f1b8a7da36cb").then(function(response) {
					//console.log(response.data);
			        showWeatherInfo(response.data);
					$scope.mainShow=true;
				});
			}
			//api.openweathermap.org/data/2.5/weather?zip=94040
		}

		function showWeatherInfo(data) {
			$scope.currtemp = data.main.temp+" °C";
			$scope.mintemp = data.main.temp_min+" °C";
			$scope.maxtemp = data.main.temp_max+" °C";
			$scope.pressure = data.main.pressure+" hpa";
			$scope.humidity = data.main.humidity+"%";
			$scope.weather = "<img src='http://openweathermap.org/img/w/"+data.weather[0].icon+".png' />"+data.weather[0].description;
			$scope.clouds = data.clouds.all+"%";
			$scope.message="You can see the current weather in <span>"+data.name+"</span>";
		}

		//asking for permission for location
		function getLocation() {
		    if (navigator.geolocation) {
		        navigator.geolocation.getCurrentPosition(showPosition, showError);
		    } else {
		        $scope.message = "Geolocation is not supported by this browser.";
		    }
		}

		//if permission allowed show weather
		function showPosition(position) {
			$http.get("http://api.openweathermap.org/data/2.5/weather?lat="+position.coords.latitude+"&lon="+position.coords.longitude+
		    				"&units=metric&APPID=71d17000e5ffe3100da7f1b8a7da36cb").then(function(response) {
					//console.log(response.data);
			        showWeatherInfo(response.data);
			});
		}

		//geolocation errors
		function showError(error) {
			switch(error.code) {
			    case error.PERMISSION_DENIED:
			        $scope.message = "User denied the request for Geolocation."
			        break;
			    case error.POSITION_UNAVAILABLE:
			        $scope.message = "Location information is unavailable."
			        break;
			    case error.TIMEOUT:
			        $scope.message = "The request to get user location timed out."
			        break;
			    case error.UNKNOWN_ERROR:
			        $scope.message = "An unknown error occurred."
			        break;
			}
		}
	});
})();