import React, { Component } from 'react';
import Header from './Header';
import GanpatiList from './GanpatiList'
import {createContainer} from 'meteor/react-meteor-data';
import {DefaultLanguage} from '/imports/api/defaultLanguage';

class LandingPage extends Component{
	render(){
	let language=''
		if(DefaultLanguage.find({ID:"1"}).fetch()[0])
			language = (DefaultLanguage.find({ID:"1"}).fetch()[0].DefaultLanguage)
	 	return(
		<div>
		<Header auth="unauth-user" language={language}/>
		<GanpatiList language={language}/>
		</div>
		)
	}
};

export default createContainer(()=>{
	Meteor.subscribe('defaultLanguage')
  	return { 
  defaultLanguage:DefaultLanguage.find({}).fetch()
  }
}, LandingPage)