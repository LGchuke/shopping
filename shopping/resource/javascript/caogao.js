var main = function(){
	  $('.papa').click(function(e){
	  		console.log(e.target);
	  })
	  $('.papa').on('click','.kid',function(e){
	  		console.log(e.target);
	  })
}
$(document).ready(main);