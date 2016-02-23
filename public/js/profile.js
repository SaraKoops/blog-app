$(document).ready(function(){

	var timer;

	timer = setTimeout(function(){ 

		$("#kop, #welcomeback").fadeOut(500, function(){

			$("#createpost").css("display", "block");

		});

	},1000);

	// clearTimeout(timer);

})