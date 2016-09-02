require('normalize.css/normalize.css');
require('styles/App.css');
import React from 'react';
import ReactDOM from 'react-dom';
import quizData from '../data/quizData.js';
import $ from 'jquery';


class Question extends React.Component{

  constructor(){
    super();
    this.state = {
       singleImgUrl:'',
       multiImgUrl:'',
       is_selected:false
    }
  }

  handleClick(event){
       
    const OPTION_SINGLE = 'OPTION_SINGLE';
    const OPTION_MULTI = 'OPTION_MULTI';
    const TRUE_FALSE = 'TRUE_FALSE';
    let eventTargetValue = event.target.getAttribute('class');

    if(this.props.type == OPTION_SINGLE || this.props.type == TRUE_FALSE){      
      this.setState({singleImgUrl:event.target.getAttribute('class')});
    }else if(this.props.type == OPTION_MULTI){

      if(this.state.multiImgUrl == ''){

        this.setState({multiImgUrl:this.state.multiImgUrl.concat(eventTargetValue)});

      }else{
        let isInMultiImgUrl = this.state.multiImgUrl.indexOf(eventTargetValue);
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
    

    let choiceArrNew = [];
    let type = this.props.type;
    let choiceArr;
    let is_selected = this.state.is_selected;
    let imgUrl;
    const OPTION_SINGLE = 'OPTION_SINGLE';
    const OPTION_MULTI = 'OPTION_MULTI';
    const TRUE_FALSE = 'TRUE_FALSE';


    if(!!this.props.option_array){
      choiceArr = Array.from(this.props.option_array);
    }else{
      choiceArr = [{'option_name':'是'},{'option_name':'否'}];
    }

    let options = choiceArr.map(function(option){
    let option_name = option.option_name;
    let  isIn = this.state.multiImgUrl.indexOf(option_name);

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


class Submit extends React.Component{
  handleClick(){

    $.post(this.props.source,{quiz_id:1},function(res){alert(res)},"json");
  }
  render(){
    return (
      <a className="submit" onClick={this.handleClick.bind(this)}>提交</a>
    );
  }
}

class Main extends React.Component{
  render(){   
    let questionArr = [];
    let question_array = quizData.question_array;
    let j = question_array.length;

    question_array.forEach(function(value,index){
      let question_name = value.question_name;
      let type = value.type;
      let option_array = value.option_array;

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
}

Main.defaultProps = {
	
};

export default Main;
