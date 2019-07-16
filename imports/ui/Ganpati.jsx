import Header from './Header'
import AddGanpati from './AddGanpati'
import GanpatiActions from './GanpatiActions'
import React, { Component } from 'react';
import Footer from './Footer'

class Ganpati extends Component{

	render(){
	return(
		<div>
		<Header auth="admin" language='en'/>
		<AddGanpati />
		<GanpatiActions />
		<Footer/>
		</div>
		)
	}
};

export default Ganpati;