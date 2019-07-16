import React from 'react';
// import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
// import './main.html';

// import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import { Tracker } from 'meteor/tracker';

import {routes, onAuthChange} from '/imports/ui/routes'

Tracker.autorun(()=>{
	const IS_AUTHENTICATED = !!Meteor.userId();
	onAuthChange(IS_AUTHENTICATED);
});

Meteor.startup(() => {
  render(routes, document.getElementById('react-target'));
});


// import App from '/imports/ui/App'
// import GanpatiList from '/imports/ui/GanpatiList'

// const routes = (
//   <Router history={browserHistory}>
//     <Route path="/" component={App}>
//     	<IndexRoute component={App}/>
//     	<Route path="/bins/:binId" component={App}/>
//     </Route>
//   </Router>
// );

// Meteor.startup(() => {
//   render(routes, document.getElementById('react-target'));
// });
