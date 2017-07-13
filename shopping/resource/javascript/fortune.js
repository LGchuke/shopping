var main = function(){
	$('#second-header-container label,.item').on('click',function(){
		alert('该板块只能在app下查看');
	})
}
$(document).ready(main);