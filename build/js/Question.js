
var $ = require('./zepto.js');



/**
 * 创建一个测验类
 * @param {[type]} info [description]
 */

function Quiz(info){
	
}
/*添加原型方法*/
Quiz.prototype = {

	/**
	 * 创建测验方法
	 * @param  {[object]} info         [测验对象]
	 * @return quizArrToString         [返回测试题串]
	 */
	generateQuiz:function(info){
		
		var questionArray = info.question; //测验题数组
		var questionNumbers = questionArray.length;	//测验题数组长度
		var quizArrToString;//存放测验题所有信息数组字符串
		var quizArr = [];//存放测验题所有信息数组
		var is_pass =  info.is_pass; //测验是否通过
		var result_count = info.result_count;//参加测验次数
		// 利用循环测验题所有信息数组中塞入每个测验题
		for(var i = 0;i<questionNumbers;i++){
			var liNumber = i+1;
			var choiceImgUrl; // 选项图标
			var questionType = questionArray[i].type; //每个题目类型
			var optionArray = questionArray[i].option || [{"option_id":"1","option_name":"是","answer_true_false":true},{"option_id":"2","option_name":"否","answer_true_false":false}];//每个测验题的选项数组		
			var image_240_url = questionArray[i].image_240_url;		
			var question_id = questionArray[i].question_id;
			//根据是否上传测试图，选择是否显示
			if(!!!image_240_url){
				is_show_desc_img = 'no';
			}else{
				is_show_desc_img = 'yes';
			}
			//根据测验题目类型初始化选项图标
			if(questionType == "OPTION_SINGLE"){
				choiceImgUrl = "./img/single-round-unselected.png";
			}else if(questionType == "OPTION_MULTI"){
				choiceImgUrl = "./img/multi-rectangle-unselected.png";
			}else if(questionType == "TRUE_FALSE"){
				choiceImgUrl = "./img/single-round-unselected.png";
			}
			// 首先向测验题所有信息数组中塞入题目信息
			quizArr.push('<div class="question-basic no-answered" type = "'+questionType+'"question_id = '+question_id+'><div class="question-title">'+liNumber+". "+questionArray[i].question_name+'</div><div class="content">'+'<div class="desc desc-pic">',
					'<img src="'+image_240_url+'" class="'+is_show_desc_img+' />','</div><div class="choices"><ul>'
			);

			// 根据题目类型，塞入题目选项信息
			if(questionType == 'OPTION_SINGLE' || questionType == 'OPTION_MULTI'){
				for(var j = 0;j<optionArray.length;j++){
					var optionImgUrl = optionArray[j].image_120_url;
					//根据是否上传选项图片，决定是否显示选项图片
					if(!!!optionImgUrl){
						is_show_option_img = 'no';
					}else{
						is_show_option_img = 'yes';
					}
					quizArr.push('<li class="choice" onclick="choiceSelected(\''+questionType+'\',this)" option_id ="'+optionArray[j].option_id+'"><img src="'+choiceImgUrl+'"/><span>'+optionArray[j].option_name+'</span></li><img src="'+optionImgUrl+'" style="margin-bottom:10px;margin-top:10px;"class="'+is_show_option_img+'"/>');												
				}
			}else{
				for(var j = 0;j<optionArray.length;j++){
					var optionImgUrl = optionArray[j].image_120_url;
					if(!!!optionImgUrl){
						is_show_option_img = 'no';
					}else{
						is_show_option_img = 'yes';
					}
					quizArr.push('<li class="choice" onclick="choiceSelected(\''+questionType+'\',this)" answer_true_false = "'+optionArray[j].answer_true_false +'"><img src="'+choiceImgUrl+'"/><span>'+optionArray[j].option_name+'</span></li><img src="'+optionImgUrl+'" style="margin-bottom:10px;margin-top:10px;"class="'+is_show_option_img+'"/>');									
				}
			}
			//为每个测验题塞入闭合标签
			quizArr.push('</ul></div></div></div>');
		}
		//最后向测验题所有信息数组中塞入提交按钮并塞入到指定的div中
		var submit = this.submit;
		
		quizArr.push('<a class="button submit" onclick="submit()" >提交</a>','<a class="button close">关闭</a>');
		quizArrToString = quizArr.join('');
		return quizArrToString;
	},
	
	/**
	 * [测验类提交方法]
	 * @return null
	 */
	submit:function(){	
		
		// 获取到所有的测验题
		var questions = document.getElementsByClassName('question-basic');	
		// 收集用户的选择的选项ID数组	
		var user_answer_question = [];	
		// 通过循环每个题获取每个已选择题目的option_id
		has_more = true;
		for(var i=0,j=questions.length;i<j;i++){	
			var questionType = questions[i].getAttribute('type'); //每道测验题类型
			var is_answered = questions[i].getAttribute('class'); // 每道测验题目状态
			var question_id = parseInt(questions[i].getAttribute('question_id')); //每道测验题id
			var answer_option_id = []; // 存放选中单选或者多选选项的option_id
			var answer_true_false; // 存放选中判断题的option_id
			var options = questions[i].getElementsByClassName('selected');// 获取每道题所有已选择的选项
			var user_answer_option_string;// 将传递给submits_json接口的json对象转为json字符串，并存放到测验列表的user_answer_string属性中，方便获取
			//如果题目状态是"选中"
			if(is_answered == 'question-basic is-answered'){
				//判断题拼接字符串
				if(questionType == 'TRUE_FALSE'){
					//将字符串"true" 转为 布尔值 true
					answer_true_false = options[0].getAttribute('answer_true_false') == 'true'?true:false;									
					user_answer_question.push({'question_id':question_id,'answer_true_false':answer_true_false,'is_right':false});
				}else{	// 多选题拼接字符串	
					for(var m=0,n=options.length;m<n;m++){
						//定义option_id存放选中选项id 
						var option_id = parseInt(options[m].getAttribute('option_id'));
						answer_option_id.push(option_id);
					}
					user_answer_question.push({'question_id':question_id,'answer_option_id':answer_option_id,'is_right':false});			
				}
			}else{ // 如果测验题没有选中，提交测验题id
				user_answer_question.push({'question_id':question_id,'is_right':false});			
			}
		}		
		//通过JSON.stringify()函数将json对象转为json字符串，再向后台submit接口提交
		user_answer_option_string = JSON.stringify({user_answer:user_answer_question});
		
		$.post('../api/discover/submit_quiz.json',{item_id:item_id,answer:user_answer_option_string},function(res){
			
			// 如果提交成功
			if(res.result == 'SUCC'){
				//隐藏测验题区
				document.getElementById('question-wrap').style.display = 'none';
				//显示测验结果列表区
				document.getElementById('show-result-lists').style.display = 'block';
				// 设置body滚动条位置置顶
				document.body.scrollTop='0px';
				// 请求测验结果列表接口
				$.post('../api/discover/get_quiz_user_result_list.json',{item_id:item_id,size:5},function(res){					
					//测验结果数组，存放测验列表页所有信息
					var quizResult = [];
					// 测验结果图片url
					var resultImgUrl;
					// 获取测验结果
					var resultList = res.result;
					//根据最新的测验结果是否通过，指定最新一次测验结果的图片
					offset_index = res.offset_index;
					
					if(resultList[0].is_pass){
						resultImgUrl = './img/test-success.png';
					}else{
						resultImgUrl = './img/test-fail.png';
					}
					quizResult.push('<div class="tips"><img src="'+resultImgUrl+'"/></div><div class="test-lists"><ul>');
					
					for(var i=0;i<resultList.length;i++){
												
						var question_right_count = resultList[i].question_right_count;
						var question_total_count = resultList[i].question_total_count;
						var quiz_time = resultList[i].quiz_time;
						var item_id = resultList[i].item_id;
						var user_answer = resultList[i].user_answer;
						var user_answer_string = JSON.stringify(user_answer);
						var is_pass = resultList[i].is_pass;
						if(is_pass){
							quizResult.push('<li class="item" onclick="openQuizResult(this);" user_answer_string='+user_answer_string+' item_id="'+item_id+'"><div class="test-pic"><img src="./img/bedge1.png"/></div><div class="test-desc"><h1>考试题目</h1><p>'+timeFormat(quiz_time)+'</p></div><div class="test-tongji"><span class="pass-question-count-pass">'+question_right_count+'</span><span class="total-question-count">/'+question_total_count+'</span></div></li>');	
						}else{
							quizResult.push('<li class="item" onclick="openQuizResult(this);" user_answer_string='+user_answer_string+' item_id="'+item_id+'"><div class="test-pic"><img src="./img/bedge1.png"/></div><div class="test-desc"><h1>考试题目</h1><p>'+timeFormat(quiz_time)+'</p></div><div class="test-tongji"><span class="pass-question-count-nopass">'+question_right_count+'</span><span class="total-question-count">/'+question_total_count+'</span></div></li>');	
						}		
					}
					quizResult.push('</ul></div><a class="try-again" onclick="quizAgain()">再去挑战一次</a>');	
					
					document.getElementById('show-result-lists').innerHTML = quizResult.join('');	
					
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
					
				},"json");
			}
		},'json');	
	}
}