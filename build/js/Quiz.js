import React from 'react';
import ReactDOM from 'react-dom';
var Question = React.createClass({

  render(){
    return (
        <div id="question-basic is-answered">
	        <div className="question-title">question1</div>
	        <div className="content">
	          <div className="desc desc-pic"><img src="../images/test-desc-pic.png"/></div>
	          <div className="choices">
	            <ul>
	              <li className="choice"  type="single">
	                <img src="../images/multi-rectangle-unselected.png"/>
	                <span>hahha</span>
	              </li>
	            </ul>
	          </div>
	        </div>
        </div>
    )
  }
});


Question.defaultProps = {
	
};

export default Question;
