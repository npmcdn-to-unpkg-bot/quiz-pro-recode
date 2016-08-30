var $ = require('./zepto.js');

function choiceSelected(type,ele){

	if(type == 'OPTION_SINGLE' || type == 'TRUE_FALSE'){
		var parentNode = ele.parentNode;
		var liSelected = parentNode.getElementsByTagName('li');
		for(var i=0;i<liSelected.length;i++){
			liSelected[i].firstChild.setAttribute('src','./img/single-round-unselected.png');
			liSelected[i].className = 'choice';
		}
		ele.firstChild.setAttribute('src','./img/single-round-selecting.png');
		ele.className = 'choice selected';	
		ele.parentNode.parentNode.parentNode.parentNode.className = 'question-basic is-answered';
	}else if(type == 'OPTION_MULTI'){
		if(ele.className == 'choice'){ // 选项未选中时
			ele.firstChild.setAttribute('src','./img/multi-rectangle-selecting.png');
			ele.className = 'choice selected';
			ele.parentNode.parentNode.parentNode.parentNode.className = 'question-basic is-answered';
		}else if(ele.className == 'choice selected'){ // 选项选中时						
			// 测验题目所有已选择的选项
			var parentNodeChildNodes  = ele.parentNode.getElementsByClassName('selected');	
			ele.firstChild.setAttribute('src','./img/multi-rectangle-unselected.png');
			ele.className = 'choice';				
			//当所有已选择的选项为空时，修改测验题的状态为“未选择”
			if(parentNodeChildNodes.length == 0){
				ele.parentNode.parentNode.parentNode.parentNode.className = 'question-basic no-answered';
			}
		}
	}
}



/**
 * [打开测验结果列表]
 * @param  {[object]} ele [单击的选项dom对象]
 * @return null 
 */
function openQuizResult(ele){
	
	var quizQuestion = document.getElementById('question-wrap');
	
	$(".choice").attr("onclick","");
	
	var scrollTop = document.body.scrollTop;
	
	// 获取选项对象存放的用户答案json字符串
	var user_answer_string = ele.getAttribute('user_answer_string');
	// 将获取到用户答案json字符串转为json数组
	var user_answer_array = JSON.parse(user_answer_string);
	
	// 判断选项对象是否存在用户答案，存在打开用户答题情况区
	if(!!user_answer_string){
		// 循环答案数组，针对每个答案，获取测验id和用户选中的选项id
		
		for(var i=0,m=user_answer_array.length;i<m;i++){
			// 测验题id
			
			var question_id = user_answer_array[i].question_id;
			
			var is_right = (user_answer_array[i].is_right==true)?'答对':'答错';
			// 测验题用户选中单选或者多选选项id
			var answer_option_id = user_answer_array[i].answer_option_id;
					
			// 获取题目类型:
			var questionType = $("div[question_id='"+question_id+"']").attr('type');
			
			// 测验题用户选中判断题的信息
			var answer_true_false = user_answer_array[i].answer_true_false;
			// 该题用户是否选对
			var is_right = user_answer_array[i].is_right;
			// 根据answer_option_id 是否存在判断是否是判断题
			
			//重置作答
			
			var choices = $("div[question_id='"+question_id+"']").find("li[class^='choice']");	
			
			$("div[question_id='"+question_id+"']").attr("class","question-basic no-answered");
			if(questionType == 'OPTION_SINGLE' || questionType == 'TRUE_FALSE'){
				for(var j=0;j<choices.length;j++){
					choices[j].childNodes[0].setAttribute('src','./img/single-round-unselected.png');
					choices[j].setAttribute('class','choice');
				}
			}else{
				for(var j=0;j<choices.length;j++){
					choices[j].childNodes[0].setAttribute('src','./img/multi-rectangle-unselected.png');
					choices[j].setAttribute('class','choice');
				}
			}
			
			if(!!answer_option_id){
				if(questionType == 'OPTION_SINGLE'){ //单选题
					
					//循环存放用户选中选项id数组
					var option_selected_id = answer_option_id[0];
					// 根据用户选中选项id的长度来判定题目类型设置选错选项的图标
					if(is_right == false){ //选对
	
						//获取option_id与option_selected_id相同的选项
						$("li[option_id='"+option_selected_id+"']").find('img').attr('src','./img/single-round-selected-wrong.png');							
					}else{ //选错
						
						$("li[option_id='"+option_selected_id+"']").find('img').attr('src','./img/single-round-selecting.png');				
					}
				}
				if(questionType == 'OPTION_MULTI'){ // 多选题
					
					//重置作答
					var choices = $("div[question_id='"+question_id+"']").find("li[class^='choice']");
					$("div[question_id='"+question_id+"']").attr("class","question-basic no-answered");
					for(var j=0;j<choices.length;j++){
						
						choices[j].childNodes[0].setAttribute('src','./img/multi-rectangle-unselected.png');
					}
					for(var n = 0;n<answer_option_id.length;n++){
						var option_selected_id = answer_option_id[n];
						// 根据用户选中选项id的长度来判定题目类型设置选错选项的图标
						if(is_right == false){ //选对
							//获取option_id与option_selected_id相同的选项
							$("li[option_id='"+option_selected_id+"']").find('img').attr('src','./img/multi-rectangle-selected-wrong.png');							
						}else{ //选错
							$("li[option_id='"+option_selected_id+"']").find('img').attr('src','./img/multi-rectangle-selecting.png');				
						}
					}
				}
			}
			
			if(answer_true_false !== undefined){
				
				var answer_true_false_selected = answer_true_false == true?'true':'false';
				if(is_right == false){
					
					$("div[question_id='"+question_id+"']").find("li[answer_true_false='"+answer_true_false_selected+"']").find('img').attr('src','./img/single-round-selected-wrong.png');					
				}else{
					
					$("div[question_id='"+question_id+"']").find("li[answer_true_false='"+answer_true_false_selected+"']").find('img').attr('src','./img/single-round-selecting.png');
				}
			}
		}
		
		// 隐藏测验题区	
		
		document.getElementById('question-wrap').style.display = 'block';
		document.getElementById("question-wrap").scrollTop = '0px';
		document.getElementsByClassName('submit')[0].style.display = 'none';
		document.getElementsByClassName('close')[0].style.display = 'block';
		document.getElementById('show-result-lists').style.display = 'none';	
		document.getElementsByClassName('close')[0].addEventListener("click",function(){
			document.getElementById('question-wrap').style.display = 'none';
			document.getElementById('show-result-lists').style.display = 'block';	
			document.body.scrollTop = scrollTop;
		});
	}
}

function quizAgain(){

	var item_id = parseInt(window.location.href.match(/=[0-9]{1,}/g)[0].replace(/=/,''));
	var questions = document.getElementsByClassName("question-basic");
	$(".question-basic").attr("class","question-basic no-answered");
	for(var i=0;i<questions.length;i++){
		var questionType = questions[i].getAttribute("type");
		if(questionType == 'OPTION_SINGLE' || questionType == 'TRUE_FALSE'){
			var allLi = questions[i].getElementsByTagName("li");
			for(var j=0;j<allLi.length;j++){
				
				allLi[j].setAttribute("onclick","choiceSelected('"+questionType+"',this)");
				allLi[j].firstChild.setAttribute("src","./img/single-round-unselected.png");
			}
		}
		if(questionType == 'OPTION_MULTI'){
			var allLi = questions[i].getElementsByTagName("li");
			for(var j=0;j<allLi.length;j++){
				allLi[j].setAttribute("onclick","choiceSelected('"+questionType+"',this)");
				allLi[j].firstChild.setAttribute("src","./img/multi-rectangle-unselected.png");
			}
		}
	}
	
	$("#question-wrap").show();
	$("#question-wrap")[0].scrollTop = '0px';
	$("#show-result-lists").hide();
	$(".submit").show();
	$(".close").hide();
	
	$.post('../api/discover/get_quiz.json',{item_id:item_id},function(res){
		document.getElementsByClassName('submit')[0].addEventListener("click",new Quiz(JSON.parse(res).quiz[0]).submit);
	});	
}

//将时间戳转换为"2015-09-07 16:02"
function timeFormat(time){
	var date = new Date(time*1000);
	var hours=date.getHours(),minutes=date.getMinutes(),months=date.getMonth(),days=date.getDate();
	months=months+1;
	if(hours<10){
		hours="0"+hours;
	}
	if(minutes<10){
		minutes="0"+minutes;
	}
	if(months<10){
		months="0"+months;
	}
	if(days<10){
		days="0"+days;
	}
	return date.getFullYear()+'-'+months+'-'+days+' '+hours+':'+minutes;
}

function loadMore(loadUrl,data){
	$.post(loadUrl,data,function(res){
		
		var resultList = JSON.parse(res).result;
		offset_index2 = JSON.parse(res).offset_index;//3
		offset_index_arr.push(offset_index2);
		has_more = JSON.parse(res).has_more;
		
		
		for(var i=0;i<resultList.length;i++){
			var question_right_count = resultList[i].question_right_count;
			var question_total_count = resultList[i].question_total_count;
			var quiz_time = resultList[i].quiz_time;
			var item_id = resultList[i].item_id;
			var user_answer_array = resultList[i].user_answer;
			var user_answer_string = JSON.stringify(user_answer_array);
			var is_pass = resultList[i].is_pass;
			var liNode = document.createElement('li');
			var divNode1 = document.createElement('div');
			var divNode2 = document.createElement('div');
			var divNode3 = document.createElement('div');
			var imgNode = document.createElement('img');
			var hNode = document.createElement('h1');
			var hText  = document.createTextNode('考题');
			hNode.appendChild(hText);
			var pNode = document.createElement('p');
			var pText = document.createTextNode(timeFormat(quiz_time));
			pNode.appendChild(pText);
			var spanNode1 = document.createElement('span');
			var spanNode2 = document.createElement('span');
			var spanText1 = document.createTextNode(question_right_count);
			var spanText2 = document.createTextNode("/"+question_total_count);
			spanNode1.appendChild(spanText1);
			spanNode2.appendChild(spanText2);
			liNode.appendChild(divNode1);
			liNode.appendChild(divNode2);
			liNode.appendChild(divNode3);
			divNode1.appendChild(imgNode);
			divNode2.appendChild(hNode);
			divNode2.appendChild(pNode);
			divNode3.appendChild(spanNode1);
			divNode3.appendChild(spanNode2);
			liNode.setAttribute("class","item");
			liNode.setAttribute("onClick","openQuizResult(this)");
			liNode.setAttribute("user_answer_string",""+user_answer_string+"");
			liNode.setAttribute("item_id","item_id");
			divNode1.setAttribute("class","test-pic");
			imgNode.setAttribute("src","./img/bedge1.png");
			divNode2.setAttribute("class","test-desc");
			divNode3.setAttribute("class","test-tongji");
			if(!is_pass){
				spanNode1.setAttribute("class","pass-question-count-nopass");
			}else{
				spanNode1.setAttribute("class","pass-question-count-pass");
			}
			spanNode2.setAttribute("class","total-question-count");
			document.getElementById("show-result-lists").getElementsByTagName("ul")[0].appendChild(liNode);
			document.getElementById("show-result-lists").getElementsByTagName("ul")[0].style.paddingBottom = '52px';
			document.getElementById("show-result-lists").getElementsByClassName("test-lists")[0].style.paddingBottom = '50px'; 	
			document.getElementById("show-result-lists").getElementsByClassName("test-lists")[0].style.height = '100%';
		}
		
		
	});
}
