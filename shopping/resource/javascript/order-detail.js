var main = function(){
	$('.comment').on('click',function(){
		var $this = $(this).parents('.order-item');
		var commentInfo = {
			goodsId: $this.data('goods_id'),
			orderId: $this.data('order_id'),
			pic: $this.find('img').attr('src')
		}
		localStorage.setItem(commentStorage,JSON.stringify(commentInfo));
		window.location.href='write-comment.html';
	})
}
$(document).ready(main);