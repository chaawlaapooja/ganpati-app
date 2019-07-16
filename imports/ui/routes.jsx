import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import GanpatiList from './GanpatiList'
import AdminPanel from './AdminPanel'
import Ganpati from './Ganpati'
import NotFound from './NotFound'
import LandingPage from './LandingPage'
import MyOrders from './Orders'
import Login from './Login'
import Register from './Register'
import Home from './Home'
import MerchantOrders from './MerchantOrders'
import Profile from './Profile'
import About from './About'

const unauthenticatedPages = ['/register', '/login','/about'];
const authenticatedPages=['/home','/myorders','/merchantorders','/adminPanel','/ganpati','/profile']
const onEnterPublicpage=()=>{
	if(Meteor.userId()){
		if(Meteor.userId()==='7HcXqjNWTiGpuZSvZ')
		{
			browserHistory.replace('/adminPanel');
		}
		else
		{
			browserHistory.replace('/home');
		}
	}

};
const onEnterPrivatePage=()=>{
	if(!Meteor.userId()){
		browserHistory.replace('/')
	}
};
export const onAuthChange =(isAuthenticated)=>{
	const pathname = browserHistory.getCurrentLocation().pathname;
	const isUnauthenticatedPage = unauthenticatedPages.includes(pathname)
	const isAuthenticatedPage = authenticatedPages.includes(pathname);
	if(isUnauthenticatedPage && isAuthenticated){
		if(Meteor.user()){
			if(Meteor.userId()==='7HcXqjNWTiGpuZSvZ')
			{
				browserHistory.replace('/adminPanel');
			}
			else
			{
				browserHistory.replace('/home');
			}
		}
	}
	else if(isAuthenticatedPage && !isAuthenticated){
		browserHistory.replace('/')
	}
}


export const routes = (
		<Router history={browserHistory}>
		 <Route path="/" component={LandingPage} onEnter={onEnterPublicpage}/>
		 <Route path="/login" component={Login} onEnter={onEnterPublicpage} />
		 <Route path="/register" component={Register} onEnter={onEnterPublicpage} />
		 <Route path="/about" component={About} />
		 <Route path="/home" component={Home} onEnter={onEnterPrivatePage}/>
		 <Route path="/myorders" component={MyOrders} onEnter={onEnterPrivatePage}/>
		 <Route path="/merchantorders" component={MerchantOrders} onEnter={onEnterPrivatePage}/>
         <Route path="/adminPanel" component={AdminPanel} onEnter={onEnterPrivatePage} />
         <Route path="/ganpati" component={Ganpati} onEnter={onEnterPrivatePage} />
         <Route path="/profile" component={Profile} onEnter={onEnterPrivatePage} />
         <Route path="*" component={NotFound} />
</Router>
	);