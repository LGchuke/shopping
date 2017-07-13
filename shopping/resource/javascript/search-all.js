var main = function(){
	$('.search-container label').on('click',function(){
		window.location.href = 'search.html?search='+$('#searchAll').val();
	})
}
$(document).ready(main);