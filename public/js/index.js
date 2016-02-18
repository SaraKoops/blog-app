$(document).ready(function(){	


	$("#loginp").click(function() {

		$("#error").hide();

		$("#none").show();

		$("#register").css("display", "none");

		$("#login").css("display", "block");

  	});

  	$("#registerp").click(function() {

  		$("#none").hide()

  		$("#error").show();

		$("#login").css("display", "none");

		$("#register").css("display", "block");

  	});




});