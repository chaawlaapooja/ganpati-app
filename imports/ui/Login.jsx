import React, { Component } from 'react';
import { Link } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Router, Route, browserHistory } from 'react-router';
import Header from './Header'
import {Translate} from '/imports/api/translate';
import {createContainer} from 'meteor/react-meteor-data';
import Footer from './Footer'

export class Login extends Component{

	constructor(props){
		super(props);
		this.state = {
			error : '',
			language:''
		};
	}
	componentDidMount(){
    if(this.props.location.state)
    this.setState({language:this.props.location.state.language}) 
    else
    this.setState({language:'en'})
      let languages = (document.querySelectorAll('.lang'))
      languages.forEach(language=>{
        language.addEventListener("click", ()=>this.set_language(language))
       })
    }
    set_language(language){
    if(language.id==='English'){
    	this.setState({language:'en'})
        Meteor.call('DefaultLanguage.update', 'en')
    }
      else if(language.id==='Marathi'){
      this.setState({language:'mr'})
        Meteor.call('DefaultLanguage.update', 'mr')
    }
    }
    //get strings/labels for selected language
    get_string(stringFor){
    let language=''
    if(this.state.language===''){
    if(this.props.location.state)
    language =  this.props.location.state.language
    else
    language='en'
    }
    else
    language=this.state.language
      return (Translate.find({stringFor}).fetch()[0]?Translate.find({stringFor}).fetch()[0].langArray[language]:undefined)
   }

//function that handles submit event from login form
	on_submit(e){
		e.preventDefault();

		let email =  this.refs.number.value.trim()
		let password = this.refs.password.value.trim();


		Meteor.loginWithPassword({email}, password, (err)=>{
			if(err){
				this.setState({error: err.reason});
			}
			else
			{
				this.setState({error:''});
				
			}
		});

	}


	render(){
		return(
		<div>
	<Header auth="unauth-user" language={this.state.language}/>
		<div className="boxed-view">
		<div className="boxed-view__box">
		<h1>{this.get_string('Login')}!</h1>
		{this.state.error?<p>{this.state.error}</p>:undefined}
		<form onSubmit={this.on_submit.bind(this)} className="boxed-view__form">
			<input type="tel" ref="number" placeholder={this.get_string("Enter a Valid Number")} pattern="[0-9]{10}" title="10 digit mobile number"/>
			<input type="password" ref="password" placeholder={this.get_string("Enter Password")}/>
			<button className="button">{this.get_string('Login')}</button>
		</form>
		<Link to={{pathname: '/register',state: {language: this.state.language}}}>{this.get_string('Register here')}! </Link>
		
		</div>
		</div>
		<Footer/>
		</div>
		)
	}
};

export default createContainer(()=>{
	Meteor.subscribe('translate')
  return { 
  translate:Translate.find({}).fetch(),
  }
}, Login)