var height = $(document).height();
		$('.page').css('height',height+'px');
		$('.login').css('height',height+'px');
		$('.pageList').css('height',height+'px');

function Page (obj) {
	this.nowPage = obj.length - 1;
	this.lastPage = obj.length; 
	this.pages = obj;
	this.pagesHeight = obj.height();
	// this.startposition = [0,0];
	// this.moveposition = [];
	this.endposition = [0,0];
	this.stop = true;
	this.move = false;
}

Page.prototype.slidedown = function (pg) {
	var that = this;
	this.stop = false;
	
	this.pages.eq(pg).animate({
		top: '0px'
	},500,'ease-out',function () {
		draw.context(that.pages.eq(pg).data('id'),function (that) {that.stop = true;},that);	
	});
};

Page.prototype.slideup = function (pg) {
	var that = this;
	this.stop = false;
	
	this.pages.eq(pg).animate({
		top: -this.pagesHeight + 'px'
	},500,'ease-out',function () {
		draw.context(that.pages.eq((pg-1)).data('id'),function (that) {that.stop = true;},that);
	});
};

Page.prototype.login = function () {
	$('.login').eq(0).animate({top: -height + 'px'}, 500, "ease-in");
};

Page.prototype.bind = function () {
	console.log('bind ok!');
	var that = this;
	this.pages.on('touchstart', function (e) {
		console.log('touch start!');
		event.preventDefault();
		if ((that.nowPage || that.pages.eq(that.lastPage).length !== 0) && that.stop && isLogin) {
			that.endposition = [];
			that.endposition.push(e.touches[0].pageX,e.touches[0].pageY);
		}
	}).on('touchmove', function (e) {
		var pagey = e.touches[0].pageY;
		that.move = true;
		that.moveDir = '';
		if ((that.nowPage || that.pages.eq(that.lastPage).length !== 0) && that.stop && isLogin) {
			if (pagey - that.endposition[1] < 0 && that.nowPage) {
				that.moveDir = 'up';
				that.pages.eq(that.nowPage).css({top: parseFloat(that.pages.eq(that.nowPage).css('top')) + pagey - that.endposition[1]});
			} else if (pagey - that.endposition[1] > 0 && that.pages.eq(that.lastPage).length !== 0) {
				console.log(that.pages.eq(that.nowPage).css('top'));
				if (that.pages.eq(that.nowPage).css('top') == '0px') {
					that.moveDir = 'down';
					that.pages.eq(that.lastPage).css({top: parseFloat(that.pages.eq(that.lastPage).css('top')) + pagey - that.endposition[1]});
				}
			}
			that.endposition = [];
			that.endposition.push(e.touches[0].pageX,e.touches[0].pageY);
		}
	}).on('touchend',function (e) {
		console.log('end');
		if (that.move && isLogin) {
			that.move = false;
			if (that.pages.eq(that.lastPage).length !== 0 && that.stop && (that.moveDir == 'down')) {
				if (-parseInt(that.pages.eq(that.lastPage).css('top')) > that.pagesHeight*3/4) {
				 	that.slideup(that.lastPage);
				} else if (-parseInt(that.pages.eq(that.lastPage).css('top')) < that.pagesHeight*3/4) {
				 	that.slidedown(that.lastPage);
				 	that.nowPage += 1;
				 	that.lastPage += 1;
				} 
			}
			if (that.nowPage && that.stop && (that.moveDir == 'up')) {
				if (-parseInt(that.pages.eq(that.nowPage).css('top')) > that.pagesHeight/4) {
					that.slideup(that.nowPage);
					that.nowPage -= 1;
					that.lastPage -= 1;
				} else if (-parseInt(that.pages.eq(that.nowPage).css('top')) < that.pagesHeight/4) {
					that.slidedown(that.nowPage);
				}
			}
		}
		
		
	});
};

function Draw () {
}

Draw.prototype.drawSex = function (context) {
	require([
			'echarts',
			'echarts/chart/pie'
		],
		function (ec) {
			var myChart = ec.init(document.getElementById(context));
			var idx = 1;
			var option = {
				color : ['#ffa634','#fee147','#c4df42','#eeb623'],
			    title : {
			        text: '你所在学院的男女比例为' + data.sex.male + ' : ' + data.sex.female,
			        subtext: '脱单率' + Math.round(data.sex.fff/(data.sex.fff+data.sex.single)*10000)/100.000+'% (仅作参考)',
			        x: 'center',
			        textStyle: {
			        	color: '#d87e1d',
			        	fontSize: 20
			        }
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
			        orient : 'horizontal',
			        x : 'center',
			        y : 'bottom',
			        data:['男生','女生','脱单','未脱单']
			    },
			    toolbox: {
			        show : false,
			    },
			    calculable : false,
			    series : [
		        {
		            name:'男女比例',
		            type:'pie',
		            selectedMode: 'single',
		            radius : [0, 60],
		            
		            // for funnel
		            
		            funnelAlign: 'center',
		            max: 1548,
		            
		            itemStyle : {
		                normal : {
		                    label : {
		                        position : 'inner'
		                    },
		                    labelLine : {
		                    	show: false
		                    },
		                    
		                }
		            },
		            data:[
		                {value:parseInt(data.sex.male), name:'男生'},
		                {value:parseInt(data.sex.female), name:'女生'}
		            ]
		        },
		        {
		            name:'脱单比例',
		            type:'pie',
		            radius : [75, 105],
		            
		            // for funnel
		            
		            funnelAlign: 'center',
		            itemStyle : {
		                normal : {
		                    label : {
		                        position : 'outer'
		                    },
		                    labelLine : {
		                    	show: true,
		                     	length: -5   
		                    }
		                }
		            },
		            data:[
		                {value:parseInt(data.sex.fff), name:'脱单'},
		                {value:parseInt(data.sex.single), name:'未脱单'}
		            ]
		        }]
		    };
		    myChart.setOption(option);  
		}); 
		   
};

Draw.prototype.drawCome = function (context) {
	require([
			'echarts',
			'echarts/chart/pie'
		],
		function (ec) {
			var myChart = ec.init(document.getElementById(context));
			var idx = 1;
			var option = {
				color : ['#ffa634','#fee147','#c4df42','#eeb623'],
			    title : {
			        text: '新生中你的老乡比例为 ' + Math.round(data.from.hometown/(data.from.hometown+data.from.others)*10000)/100.000+'%',
			        subtext: '其中男女比例为 ' + data.from.male +' : '+ data.from.female,
			        x: 'center',
			        textStyle: {
			        	color: '#d87e1d',
			        	fontSize: 20
			        }
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
			        orient : 'horizontal',
			        x : 'center',
			        y : 'bottom',
			        data:['你的老乡','其它省份','老乡男生','老乡女生']
			    },
			    toolbox: {
			        show : false,
			    },
			    calculable : false,
			    series : [
		        {
		            name:'老乡比例',
		            type:'pie',
		            selectedMode: 'single',
		            radius : [0, 60],
		            
		            // for funnel
		            
		            funnelAlign: 'center',
		            max: 1548,
		            
		            itemStyle : {
		                normal : {
		                    label : {
		                        position : 'inner'
		                    },
		                    labelLine : {
		                    	show: false
		                    },
		                    
		                }
		            },
		            data:[
		                {value:parseInt(data.from.hometown), name:'你的老乡'},
		                {value:parseInt(data.from.others), name:'其它省份'}
		            ]
		        },
		        {
		            name:'老乡男女比例',
		            type:'pie',
		            radius : [75, 105],
		            
		            // for funnel
		            
		            funnelAlign: 'center',
		            itemStyle : {
		                normal : {
		                    label : {
		                        position : 'outer'
		                    },
		                    labelLine : {
		                    	show: true,
		                     	length: -5   
		                    }
		                }
		            },
		            data:[
		                {value:parseInt(data.from.male), name:'老乡男生'},
		                {value:parseInt(data.from.female), name:'老乡女生'}
		            ]
		        }]
		    };
		    myChart.setOption(option);  
		}); 
};

Draw.prototype.drawSame = function (context) {
	require([
			'echarts',
			'echarts/chart/pie'
		],
		function (ec) {
			var myChart = ec.init(document.getElementById(context));
			var idx = 1;
			var option = {
				color : ['#ffa634','#fee147','#c4df42','#eeb623'],
			    title : {
			        text: '新生中和你同年同月的比例为'+Math.round(data.same.samemon/(data.same.samemon+data.same.others)*10000)/100.000+'%',
			        subtext: '新生中和你相同星座的比例为 ' + Math.round(data.same.samehor/(data.same.samehor+data.same.othershor)*10000)/100.000+'%<br/>和你同年同月同日的男生有'+samemale+'人，女生有'+samefemale+'人',
			        x: 'center',
			        textStyle: {
			        	color: '#d87e1d',
			        	fontSize: 20
			        }
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
			        orient : 'horizontal',
			        x : 'center',
			        y : 'bottom',
			        data:['同年同月','其它月份','相同星座','其它星座']
			    },
			    toolbox: {
			        show : false,
			    },
			    calculable : false,
			    series : [
		        {
		            name:'同年同月比例',
		            type:'pie',
		            selectedMode: 'single',
		            radius : [0, 60],
		            
		            // for funnel
		            
		            funnelAlign: 'center',
		            max: 1548,
		            
		            itemStyle : {
		                normal : {
		                    label : {
		                        position : 'inner'
		                    },
		                    labelLine : {
		                    	show: false
		                    },
		                    
		                }
		            },
		            data:[
		                {value:parseInt(data.same.samemon), name:'同年同月'},
		                {value:parseInt(data.same.others), name:'其它月份'}
		            ]
		        },
		        {
		            name:'老乡男女比例',
		            type:'pie',
		            radius : [75, 105],
		            
		            // for funnel
		            
		            funnelAlign: 'center',
		            itemStyle : {
		                normal : {
		                    label : {
		                        position : 'outer'
		                    },
		                    labelLine : {
		                    	show: true,
		                     	length: -5   
		                    }
		                }
		            },
		            data:[
		                {value:parseInt(data.same.samehor), name:'相同星座'},
		                {value:parseInt(data.same.othershor), name:'其它星座'}
		            ]
		        }]
		    };
		    myChart.setOption(option);  
		}); 
};

Draw.prototype.drawHard = function (context) {
	require([
			'echarts',
			'echarts/chart/pie'
		],
		function (ec) {
			var myChart = ec.init(document.getElementById(context));
			var idx = 1;
			var option = {
				color : ['#ffa634','#fee147','#c4df42','#eeb623'],
			    title : {
			        text: '你所在学院学生心目中大一最难的科目',
			        subtext: '本数据由红岩网校工作站统计，仅作参考',
			        x:'center',
			        textStyle: {
			        	color: '#d87e1d',
			        	fontSize: 20
			        }
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
			        orient : 'horizontal',
			        x : 'center',
			        y : 'bottom',
			        data:[hard[data.college].n1,hard[data.college].n2,hard[data.college].n3]
			    },
			    series : [
			        {
			            name:'最难科目',
			            type:'pie',
			            radius : '55%',
			            center: ['50%', '50%'],
			            data:[
			                {value:hard[data.college].n1k, name:hard[data.college].n1},
			                {value:hard[data.college].n2k, name:hard[data.college].n2},
			                {value:hard[data.college].n3k, name:hard[data.college].n3}
			            ]
			        }
			    ]
			};
		    myChart.setOption(option);  
		}); 
};

Draw.prototype.drawFuture = function (context) {
	require([
			'echarts',
			'echarts/chart/pie'
		],
		function (ec) {
			var myChart = ec.init(document.getElementById(context));
			var idx = 1;
			var option = {
				color : ['#ffa634','#fee147','#c4df42','#eeb623'],
			    title : {
			        text: '你所在学院2015年毕业生毕业去向',
			        subtext: '本数据由红岩网校工作站统计，仅作参考',
			        x:'center',
			        textStyle: {
			        	color: '#d87e1d',
			        	fontSize: 20
			        }
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
			        orient : 'horizontal',
			        x : 'center',
			        y : 'bottom',
			        data:['签约就业','升学出国','待就业','灵活就业']
			    },
			    series : [
			        {
			            name:'毕业去向',
			            type:'pie',
			            radius : '55%',
			            center: ['50%', '50%'],
			            data:[
			                {value:future[data.college].jy, name:'签约就业'},
			                {value:future[data.college].sx, name:'升学出国'},
			                {value:future[data.college].djy, name:'待就业'},
			                {value:future[data.college].lh, name:'灵活就业'}
			            ]
			        }
			    ]
			};
		    myChart.setOption(option);  
		}); 
};

Draw.prototype.drawAll = function (fun,callback,obj) {
	for (var i = 0; i < fun.length; i++) {
		this[fun[i]](fun[i]);
	}
	if (callback) {
		console.log('11');
		if (obj) {
			console.log('22');
			callback(obj);
		}
	}
};

Draw.prototype.context = function (fun,callback,obj) {
	// console.log(obj.data('id'));
	if (fun){
		this[fun](fun);
	}
	if (callback) {
		console.log('11');
		if (obj) {
			console.log('22');
			callback(obj);
		}
	}
};

var page = new Page($('.page'));
page.bind();

var draw = new Draw();