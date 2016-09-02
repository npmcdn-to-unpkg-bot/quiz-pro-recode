	var  React = require('react');
	var ReactDom = require('react-dom');
	var quizData = require('./quizData.js');
	var $ = require('jquery');
	var Question = React.createClass({
	   
	   setInitialState(){
	       var singleImgUrl = '';
	       var multiImgUrl = '';
	       var is_selected = false;  
	   }
	   handleClick(event){
	       
	    const OPTION_SINGLE = 'OPTION_SINGLE';
	    const OPTION_MULTI = 'OPTION_MULTI';
	    const TRUE_FALSE = 'TRUE_FALSE';
	    var  eventTargetValue = event.target.getAttribute('class');
	
	    if(this.props.type == OPTION_SINGLE || this.props.type == TRUE_FALSE){      
	      this.setState({singleImgUrl:event.target.getAttribute('class')});
	    }else if(this.props.type == OPTION_MULTI){
	
	      if(this.state.multiImgUrl == ''){
	
	        this.setState({multiImgUrl:this.state.multiImgUrl.concat(eventTargetValue)});
	
	      }else{
	        var  isInMultiImgUrl = this.state.multiImgUrl.indexOf(eventTargetValue);
	        if(isInMultiImgUrl == -1){
	          this.setState({multiImgUrl:this.state.multiImgUrl.concat(eventTargetValue)});
	        }else{
	          this.setState({multiImgUrl:this.state.multiImgUrl.replace(eval('/'+eventTargetValue+'/'))});
	        }
	
	      }
	    }
	
	    event.stopPropagation();
	    event.preventDefault();   
	  }
	  
	
	  render(){
	    
	
	    var  choiceArrNew = [];
	    var  type = this.props.type;
	    var  choiceArr;
	    var  is_selected = this.state.is_selected;
	    var  imgUrl;
	    const OPTION_SINGLE = 'OPTION_SINGLE';
	    const OPTION_MULTI = 'OPTION_MULTI';
	    const TRUE_FALSE = 'TRUE_FALSE';
	
	
	    if(!!this.props.option_array){
	      choiceArr = Array.from(this.props.option_array);
	    }else{
	      choiceArr = [{'option_name':'是'},{'option_name':'否'}];
	    }
	
	    var  options = choiceArr.map(function(option){
	    var  option_name = option.option_name;
	    var   isIn = this.state.multiImgUrl.indexOf(option_name);
	
	    if(type == OPTION_SINGLE || type == TRUE_FALSE){ //单选题
	      if(option_name == this.state.singleImgUrl){
	        imgUrl = '../images/single-round-selecting.png';
	      }else{
	        imgUrl = '../images/single-round-unselected.png';
	      }
	    }else{ // 多选题
	      if(isIn != -1){
	        imgUrl = '../images/multi-rectangle-selecting.png';
	      }else{
	        imgUrl = '../images/multi-rectangle-unselected.png';
	      }
	    }
	 
	    return (
	        <li type={type} onClick={this.handleClick.bind(this)} className={is_selected} >
	          <img src={imgUrl} className={option_name} />
	          <span>{option.option_name}</span>
	        </li>
	      );
	    },this);
	
	    return (
	        <div className="question-basic is-answered">
	          <div className="question-title">{this.props.question_name}</div>
	
	          <div className="content">
	            <div className="desc desc-pic"><img src="../images/test-desc-pic.png"/></div>
	            <div className="choices-choice">
	              <ul>
	                {options}
	              </ul>
	            </div>
	          </div>
	        </div>
	    )
	  }
	}


 	var Submit = React.createClass({
	  handleClick(){
	
	    $.post(this.props.source,{quiz_id:1},function(res){alert(res)},"json");
	  }
	  render(){
	    return (
	      <a className="submit" onClick={this.handleClick.bind(this)}>提交</a>
	    );
	  }
 	});

	var Main = React.createClass({
	  render(){   
	    var  questionArr = [];
	    var  question_array = quizData.question_array;
	    var  j = question_array.length;
	
	    question_array.forEach(function(value,index){
	      var  question_name = value.question_name;
	      var  type = value.type;
	      var  option_array = value.option_array;
	
	      if(!!value.option_array){
	        questionArr.push(<Question type={type} question_name={question_name} option_array={option_array} />);
	      }else{
	        questionArr.push(<Question type={type} question_name={question_name} />);
	      }
	       
	    });
	    
	    return (
	      <section className="main-area">
	        <section className="question-area">
	          {questionArr}
	        </section>
	        <section className="submit-area">
	          <Submit source="http://localhost:8080/test/test_login.html" />
	        </section>
	      </section>
	    )
	  }
	});

	Main.defaultProps = {
		
	};

	export default Main;
