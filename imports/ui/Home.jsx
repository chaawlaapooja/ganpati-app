import React, { Component } from 'react';
import Header from './Header';
import GanpatiList from './GanpatiList'
import {createContainer} from 'meteor/react-meteor-data';
import {DefaultLanguage} from '/imports/api/defaultLanguage';

export class Home extends Component{
	
	render(){
	let language=''
	DefaultLanguage.find({ID:"1"}).fetch()[0]?
			language = (DefaultLanguage.find({ID:"1"}).fetch()[0].DefaultLanguage):undefined
	return(
		<div>
		<Header auth="auth-user" language={language}/>
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
}, Home)