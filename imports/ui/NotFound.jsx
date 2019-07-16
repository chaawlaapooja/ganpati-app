import React, { Component } from 'react';
import {Link} from 'react-router';
import Footer from './Footer'

class NotFound extends Component{

	render(){
	return(
		<div className="boxed-view">
		<div className="boxed-view__box">
		<h2>Page Not found</h2>
		<p> Looks like you're looking for page that doesn't exist</p>
		<Link to="/">Head to Home</Link>
		</div>
		<Footer/>
		</div>
		)
	}
};

export default NotFound;