import React from 'react';
import Header from './Header.jsx';
import GanpatiList from './GanpatiList.jsx';
import {createContainer} from 'meteor/react-meteor-data';
import {DefaultLanguage} from '/imports/api/defaultLanguage';

export class AdminPanel extends React.Component{
render(){

return(
  <div>
  	<Header auth="admin" language='en'/>
    <GanpatiList language='en'/>
  </div>
  )
  }
};

export default createContainer(()=>{
	Meteor.subscribe('defaultLanguage')
  	return { 
  defaultLanguage:DefaultLanguage.find({}).fetch()
  }
}, AdminPanel);
