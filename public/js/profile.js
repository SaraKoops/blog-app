
$(document).ready(function(){

	var timer;

	timer = setTimeout(function(){ 

		$("#kop, #welcomeback").fadeOut(500, function(){

			$("#createpost").css("display", "block");

		});

	},1000);

	$.ajax ({ // ajax request messages by user
				url: '/myposts',
				error: function () {
					console.log('myposts not working');
				}, 
			   	success: function(data){ // callback function. De parameter krijgt de functie uit app.js file door callback functie.
			   		console.log('ajax myposts working')

			   		$('#list').html(data);
			   	},

			   	type: 'GET'

			});

	$.ajax ({ // ajax request messages all
				url: '/allposts',
				error: function () {
					console.log('allposts not working');
				}, 
			   	success: function(data){
			   		console.log('ajax allposts working')

			   		$('#list2').html(data);
			   	},

			   	type: 'GET'

			});











})