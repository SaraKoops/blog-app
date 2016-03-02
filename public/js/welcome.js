
$(document).ready(function(){

var url = "/profile"; 
var timer;

timer = setTimeout(function(){ 

		$("#kop, #welcomeback").fadeOut(1600);
		$(location).attr('href',url);  // this redirects to /profile after the welcome intro

	},1000); // this is the time to adjust if you want to last the intro
})	