$(document).ready(function(){

	var timer;

	timer = setTimeout(function(){ 

		console.log("test")

		$("#kop, #welcomeback").fadeOut(600, function(){

			console.log("test2")

			$("#createpost").css("display", "block");

		});

	},3000);

	console.log("test3")

	// clearTimeout(timer);

})
