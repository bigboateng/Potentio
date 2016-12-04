
var app = angular.module("djApp", ['ngRoute', 'ngAudio', 'ngProgress']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl: 'angular/main.html',
		controller: 'mainController'
	})
	.otherwise({
		redirectTo: '/'
	});
}]);


$(document).ready(function() {
	$('.play').click(function(){
		var $this = $(this);
		$this.toggleClass('active');
		if($this.hasClass('active')){
			$this.text('pause');         
		} else {
			$this.text('play');
		}
	});
});





app.controller('mainController', ['$scope', 'ngAudio','ngProgressFactory', function($scope, ngAudio, ngProgressFactory){

	$scope.map = function (x, in_min, in_max, out_min, out_max){
		return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
	}



	$scope.lastSong1Id = 0;
	$scope.lastSong2Id = 1;
	$scope.names = ['Alleso - I wanna know', 
	'Martin Garrix - Forbidden Voices',
	'Martin Garrix - Bouncy Bob',
	'Green Velvet - Flash'];

	$scope.audios1 = [
	ngAudio.load('sounds/Alesso.mp3'),
	ngAudio.load('sounds/forbidden.mp3'),
	ngAudio.load('sounds/garrix.mp3'),
	ngAudio.load('sounds/GreenVelvet.mp3')
	];


	$scope.audios2 = [
	ngAudio.load('sounds/Alesso.mp3'),
	ngAudio.load('sounds/forbidden.mp3'),
	ngAudio.load('sounds/garrix.mp3'),
	ngAudio.load('sounds/GreenVelvet.mp3')
	];


	var config = {
		apiKey: "AIzaSyA3OrvG4g7fb3PELJKTJKekOo7yan8k5HE",
		authDomain: "microbit-5b696.firebaseapp.com",
		databaseURL: "https://microbit-5b696.firebaseio.com",
		storageBucket: "microbit-5b696.appspot.com",
		messagingSenderId: "72543783488"
	};

	firebase.initializeApp(config);


	$scope.rootRef = firebase.database().ref();


	$scope.rootRef.child("fader").on('value', function(data){
  	//console.log(data.val());
  	$scope.rootRef.faderVal = $scope.map(data.val(), 0,1020,0,1);
  	// console.log($scope.faderVal);
  	$scope.faderChange();
     });

	$scope.rootRef.child("effect1").on('value', function(data){
		$scope.effect1 = ngAudio.load('sounds/effects/scratch.wav');
		$scope.effect1.play();
	});

	$scope.rootRef.child("effect2").on('value', function(data){
		$scope.effect2 = ngAudio.load('sounds/effects/lazer.mp3');
		$scope.effect2.play();
	});

	$scope.rootRef.child("pitch1").on('value', function(data){
		$scope.audio1.playbackRate = $scope.map(data.val(),0,1024,0.5,1.5);
		console.log("Pitch 1" + data.val());
	});


	$scope.rootRef.child("play1").on('value', function(data){
		data.val() == 1 ? $scope.audio1.pause() : $scope.audio1.play();
	});

	$scope.rootRef.child("play2").on('value', function(data){
		data.val() == 1 ? $scope.audio2.pause() : $scope.audio2.play();
	});


	$scope.rootRef.child("pitch2").on('value', function(data){
		$scope.audio2.playbackRate = $scope.map(data.val(),0,1024,0.5,1.5);
	});


	$scope.url1 = $scope.audios1[0];
	$scope.audio1 = $scope.url1;
	$scope.lastSong1 = $scope.audios1[0];

	// configure gauge 


	$scope.playButton1 = "Play";
	$scope.playButton2 = "Play";

	$scope.song1Selected = function(id) {
		// console.log(id)

		if (id == null) {
			console.log("Same song");
			// pause/play the song 
			$scope.audio1.paused ? $scope.audio1.play() : $scope.audio1.pause();
			$scope.playButton1 == "Play" ? "Pause" : "Play";
		} else {
			// stop the song and start new one
			$scope.audio1.stop();
			$scope.audio1 = $scope.audios1[id];
			$scope.audio1.play();
			$scope.lastSong1 = $scope.audio1;
			$scope.playButton1 == "Play" ? "Pause" : "Play";
		}
		
	}







	$scope.song2Selected = function(id) {
		$scope.audio2.stop();
		$scope.audio2 = $scope.audios2[id];
		$scope.audio2.play();
		$scope.lastSong2 = $scope.audio2;
	}


	$scope.changeSong1 = function() {
		$scope.audio1.paused ? $scope.audio1.play() : $scope.audio1.pause();
		$scope.playSong1 == "Currently playing..." ? "paused" : "Currently playing...";
	}



	$scope.url2 = $scope.audios2[1];
	$scope.audio2 = $scope.url2;
	$scope.lastSong2 = $scope.audios2[1];

	$scope.playSong2 = "paused";

	$scope.changeSong2 = function() {
		$scope.audio2.paused ? $scope.audio2.play() : $scope.audio2.pause();
		$scope.playSong2 == "Currently playing..." ? "paused" : "Currently playing...";
	}


	$scope.faderChange = function() {
		$scope.audio1.volume = 1 - $scope.faderVal;
		$scope.audio2.volume = $scope.faderVal;
	}

}]);

