
$(document).ready(function(){

function runAjax (){ 

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
};

runAjax();

	$("#post").on('click', function(){

		var nMessage = {baby: $('#title').val(), maybe: $('#text').val()};

		$.ajax ({ // ajax to post message to database
				url: '/createpost',
				data: nMessage,
				error: function () {
					console.log('ajax create not working');
				}, 
			   	success: function(data){
			   		console.log('ajax create working');

			   		runAjax();

			   		$('#error').html(data);

			   	},

			   	type: 'GET'

			});
	})

})