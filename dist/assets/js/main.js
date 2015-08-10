function Page (obj) {
	this.nowPage = obj.length - 1;
	this.lastPage = obj.length; 
	this.pages = obj;
	this.pagesHeight = obj.height();
	this.startposition = [0,0];
	// this.moveposition = [];
	this.endposition = [0,0];
	this.stop = true;
}

Page.prototype.slidedown = function (page) {
	var that = this;
	this.pages.eq(page).animate({
		top: '0px'
	},500,'ease-out',function () {
		that.stop = true;
	});
};

Page.prototype.slideup = function (page) {
	var that = this;
	this.pages.eq(page).animate({
		top: -this.pagesHeight
	},500,'ease-out',function () {
		that.stop = true;
	});
};

Page.prototype.bind = function () {
	var that = this;
	this.pages.on('touchstart', function (e) {
		// console.log(e.touches);
		if (that.nowPage || that.pages.eq(that.lastPage).length != 0) {
			that.endposition = [];
			that.endposition.push(e.touches[0].pageX,e.touches[0].pageY);
		}
	}).on('touchmove', function (e) {
		if (that.nowPage || that.pages.eq(that.lastPage).length != 0) {
			var pagex = e.touches[0].pageX,
				pagey = e.touches[0].pageY;
				console.log(pagey - that.endposition[1]);
			if (pagey - that.endposition[1] < 0 && that.nowPage) {
				// console.log(parseInt(that.pages.eq(that.nowPage).css('height')) - pagey + that.endposition[1]);
				that.moveDir = 'up';
				that.pages.eq(that.nowPage).css({top: parseFloat(that.pages.eq(that.nowPage).css('top')) + pagey - that.endposition[1]});
			} else if (pagey - that.endposition[1] > 0 && that.pages.eq(that.lastPage).length != 0) {
				that.moveDir = 'down';
				that.pages.eq(that.lastPage).css({top: parseFloat(that.pages.eq(that.lastPage).css('top')) + pagey - that.endposition[1]});
			}
			that.endposition = [];
			that.endposition.push(e.touches[0].pageX,e.touches[0].pageY);
			// console.log(that.endposition);
		}
	}).on('touchend',function (e) {
		console.log(that.moveDir);
		if (that.pages.eq(that.lastPage).length != 0 && that.stop && (that.moveDir == 'down')) {
			that.stop = false;
			if (-parseInt(that.pages.eq(that.lastPage).css('top')) > that.pagesHeight*3/4) {
			 	//console.log(2);
			 	that.slideup(that.lastPage);
			} else if (-parseInt(that.pages.eq(that.lastPage).css('top')) < that.pagesHeight*3/4) {
			 	//console.log(4);
			 	that.slidedown(that.lastPage);
			 	that.nowPage += 1;
			 	that.lastPage += 1;
			} 
		}
		if (that.nowPage && that.stop && (that.moveDir == 'up')) {
			that.stop = false;
			if (-parseInt(that.pages.eq(that.nowPage).css('top')) > that.pagesHeight/4) {
				//console.log(1);
				that.slideup(that.nowPage);
				that.nowPage -= 1;
				that.lastPage -= 1;
			} else if (-parseInt(that.pages.eq(that.nowPage).css('top')) < that.pagesHeight/4) {
				//console.log(3);
				that.slidedown(that.nowPage);
			}
		}
		
	});
};

var page = new Page($('.page'));
page.bind();
