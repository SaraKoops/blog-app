
$(document).ready(function(){

	$.ajax ({ // ajax request comments on post
				url: '/comments',
				error: function () {
					console.log('comments ajax not working');
				}, 
			   	success: function(data){ // 
			   		console.log('comments ajax is working')

			   		var comments = [];

			   		for (i=0; i < data.length; i++) {
			   			comments.push(data[i].username + " said: " + data[i].comment + "<br>" + data[i].date + "<br>" + "<br>");	   			
			   		}

			   		console.log(comments);

			   		$('#list').html(comments);
			   	},

			   	type: 'GET'

			});


})