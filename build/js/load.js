var $ = require('zepto'); // commonJs方式引入
var pic1 = require('../img/test-success.png');
var pic2 = require('../img/test-fail.png');
var pic3 = require('../img/bedge1.png');
console.log($);
//获取item_id
		
var item_id = parseInt(window.location.href.match(/=[0-9]{1,}/g)[0].replace(/=/,''));
var offset_index = ''; // 全局变量
var offset_index2 = ''; //记录加载时返回的offset_index  全局变量
var has_more;
var offset_index_arr = []; //存储每次返回的offset_index
//先请求测验列表接口，如果为空，再请求测验接口
$.post('../api/discover/get_quiz_user_result_list.json',{item_id:item_id,size:5},function(res){
	//如果测验列表result为空，表明没有参加过测验，此时请求get_quiz.json接口，打开测验页面
	if(res.result.length == 0){
		var item_id = parseInt(window.location.href.match(/=[0-9]{1,}/g)[0].replace(/=/,''));
		$.post('../api/discover/get_quiz.json',{item_id:item_id},function(res){
			//实例化一个测验类
			var quiz = new Quiz(res.quiz[0]);
			var questionWrap = quiz.generateQuiz(res.quiz[0]);
			document.getElementById('question-wrap').innerHTML = questionWrap;
			document.getElementsByClassName('close')[0].style.display = 'none';
			document.getElementsByClassName('submit')[0].addEventListener("click",quiz.submit);
			
		},"json");
	}else{
	//如果参加了测验，则初始化测验列表result
		
		var quizResult = [];//存放测验列表页的所有信息
		var resultImgUrl; //测验结果图
		var resultList = res.result; //测验列表	
		offset_index = res.offset_index; //记录第一次返回的offset_index
		offset_index_arr.push(offset_index);
		has_more = res.has_more;
	    
		/*初始化测验列表页*/
		// 根据测验结果，指定测验结果图片
		if(resultList[0].is_pass){
			resultImgUrl = pic1;
		}else{
			resultImgUrl = pic2;
		}
		// 向测验列表页数组中塞入测验结果图
		quizResult.push('<div class="tips"><img src="'+resultImgUrl+'"/></div><div class="test-lists"><ul>');
		// 向测验列表页数组中塞入测验列表
		for(var i=0;i<resultList.length;i++){
			var question_right_count = resultList[i].question_right_count;
			var question_total_count = resultList[i].question_total_count;
			var quiz_time = resultList[i].quiz_time;
			var item_id = resultList[i].item_id;
			var user_answer_array = resultList[i].user_answer;
			var user_answer_string = JSON.stringify(user_answer_array);
			var is_pass = resultList[i].is_pass;
			if(is_pass){
				quizResult.push('<li class="item" onclick="openQuizResult(this);" user_answer_string='+user_answer_string+' item_id="'+item_id+'"><div class="test-pic"><img src="'+pic3+'"/></div><div class="test-desc"><h1>考题</h1><p>'+'</p></div><div class="test-tongji"><span class="pass-question-count-pass">'+question_right_count+'</span><span class="total-question-count">/'+question_total_count+'</span></div></li>');	
			}else{
				quizResult.push('<li class="item" onclick="openQuizResult(this);" user_answer_string='+user_answer_string+' item_id="'+item_id+'"><div class="test-pic"><img src="'+pic3+'"/></div><div class="test-desc"><h1>考题</h1><p>'+'</p></div><div class="test-tongji"><span class="pass-question-count-nopass">'+question_right_count+'</span><span class="total-question-count">/'+question_total_count+'</span></div></li>');	
			}		
		}
		
		quizResult.push('</ul></div><a class="try-again" onclick="quizAgain()">再去挑战一次</a>');					
		// 最后向结果展示区塞入测验列表页数组
		document.getElementById('show-result-lists').innerHTML = quizResult.join('');
		document.getElementById('question-wrap').style.display = 'none';
		document.getElementById('show-result-lists').style.display = 'block';	
		
		document.getElementById("show-result-lists").onscroll = function(){
			if(has_more && document.getElementById("show-result-lists").scrollTop+document.getElementById("show-result-lists").clientHeight+10>=document.getElementById('show-result-lists').scrollHeight){			
			 	if(offset_index2 == ''){//第一次加载
			 		loadMore('../api/discover/get_quiz_user_result_list.json',{item_id:item_id,size:5,offset_index:offset_index});						
			 	}else{// 第二次之后的加载
			 		// 请求之前判断是否已经请求过了，即判断offset_index 和上次请求的offset_index是否相同	
			 		if(offset_index_arr.length>=2){
			 			if(offset_index_arr[offset_index_arr.length-1]!=offset_index_arr[offset_index_arr.length-2]){
			 				loadMore('../api/discover/get_quiz_user_result_list.json',{item_id:item_id,size:5,offset_index:offset_index2});
			 			}			 		
			 		}
			 	}
			}
		}
		
		$.post('../api/discover/get_quiz.json',{item_id:item_id},function(res){
			var quiz = new Quiz(res.quiz[0]);
			var questionWrap = quiz.generateQuiz(res.quiz[0]);
			
			document.getElementById('question-wrap').innerHTML = questionWrap;
			document.getElementsByClassName('submit')[0].style.display = 'none';
			document.getElementsByClassName('close')[0].addEventListener("click",function(){
				document.getElementById('question-wrap').style.display = 'none';
				document.getElementById('show-result-lists').style.display = 'block';
				document.body.scrollTop='0px';
				
			});
		},"json");
		
	}
},'json');
