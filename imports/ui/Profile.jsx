import Header from './Header'
import React, { Component } from 'react';
import {Orders} from '/imports/api/orders';
import {createContainer} from 'meteor/react-meteor-data';
import {Translate} from '/imports/api/translate';
import Footer from './Footer'

export class Profile extends Component{
constructor(props){
		super(props);

	    this.state = {
        user:'',
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
	formSubmit(e){
			e.preventDefault();
			Meteor.users.update({_id:Meteor.userId()},
				 {$set:{
			profile:
			{
			name:this.refs.name.value.trim(), address:this.refs.address.value.trim()
			}
			
			}},(err,res)=>{
			if(res){
				alert('Details saved!');
				this.refs.name.value='';
				this.refs.number.value='';
				this.refs.address.value=''
			}
			})
	}
	
	render(){
	let user = []
	if(Meteor.users.find().fetch().length!==0){
	 user = Meteor.users.find().fetch()[0]
	 if(this.refs.address){
	 this.refs.address.value=user.profile.address
	 this.refs.address.readOnly=false
	 }
	 }

	return(
		<div>
		<Header auth="auth-user" language={this.state.language}/>
		<div className="boxed-view">
		<div className="boxed-view__box">
		<h3>{this.get_string('Your Profile')}!</h3>
		<form onSubmit={this.formSubmit.bind(this)} className="boxed-view__form">
			<input type="tel" ref="number" placeholder="Enter a Valid Number" pattern="[0-9]{10}" title="10 digit mobile number" defaultValue={user.length!==0?user.emails[0].address:undefined} readOnly required/>
			<input type="text" ref="name" placeholder='Name' pattern="[a-zA-Z].{2,}" title="Enter three or more characters" defaultValue={user.length!==0?user.profile.name:undefined} required/>
			<textarea ref="address" cols="30" rows="4" id="textareaid" placeholder='Address'></textarea>
			<button className="button">{this.get_string('Save Details')}</button>
		</form>
		</div>
		</div>
		<Footer/>
		</div>
		)
	}
}

export default createContainer(()=>{
	Meteor.subscribe('translate')
  	Meteor.subscribe('orders')
	return { orders : Orders.find({}).fetch(),
	translate:Translate.find({}).fetch(),
	users:Meteor.users.find().fetch()
   };
}, Profile)

