import Header from './Header'
import React, { Component } from 'react';
import {Orders} from '/imports/api/orders';
import {createContainer} from 'meteor/react-meteor-data';
import {browserHistory } from 'react-router';
import Footer from './Footer'

export class MyOrders extends Component{
constructor(props){
		super(props);

	    this.state = {
        sortBy:'',
	    };

    }

	formSubmit(e){
	
			e.preventDefault();
			let or = Orders.find({orderId:this.refs.tid.value.trim()}).fetch()
			if(or.length===0){
			alert('no record found with this transaction id')
			}
			else{
			let ors = document.querySelectorAll('.orderRow')
			ors.forEach(function(o){
			o.remove()
			})
			this.refs.tid.value=''
			var table = document.getElementById("myTable");
					 table.deleteRow(-1);
					 table.innerHTML=` <tbody>
                      <tr>
                      <th>Customer Name</th>
                      <th>Customer Mobile</th>
                      <th>Address</th>
                      <th>Ganpati ID</th>
                      <th>MRPs</th>
                      <th>Total</th>
                      <th>Order ID</th>
                      <th>Payment Done</th>
                      <th>Payment Pending</th>
                      <th>Status</th>
                      <th></th>
                      <th></th>
                      </tr>
                      
                      </tbody>`
                      
					var row = table.insertRow(-1);
					row.className='orderRow'

					let user = (Meteor.users.find({_id:or[0].bookedBy}).fetch()[0])

					var cell1 = row.insertCell(0);
					var cell2 = row.insertCell(1);
					var cell3 = row.insertCell(2);
					var cell4 = row.insertCell(3);
					var cell5 = row.insertCell(4);
					var cell6 = row.insertCell(5);
					var cell7 = row.insertCell(6);
					var cell8 = row.insertCell(7);
					var cell9 = row.insertCell(8);
					var cell10 = row.insertCell(9);
					var cell11 = row.insertCell(10);
					
					cell1.innerHTML = user?user.profile.name:''
					cell2.innerHTML = user?user.emails[0].address:''
					cell3.innerHTML = user?user.profile.address:''
					cell4.innerHTML = or[0].ganpatiIds
					cell5.innerHTML = or[0].mrp
					cell6.innerHTML = or[0].total
					cell7.innerHTML = or[0].orderId
					cell8.innerHTML = or[0].paymentdone
					cell10.innerHTML = or[0].bookingStatus
					cell9.innerHTML = or[0].total-or[0].paymentdone
					let id = or[0]._id
					cell11.innerHTML=`<span class="btn btn-success pull-right searchedConfBtn">Confirm Order</span>`
					
					let conf = (document.querySelectorAll('.searchedConfBtn')[0])
					conf.addEventListener('click',()=>{
	Meteor.call('orders.confirm', id, (err,res)=>{
      if(err)
      alert('error')
      else{
      cell6.innerHTML = 'confirmed'
	cell6.className="bg-success"
      }
      })
	} )
	
					if(or[0].bookingStatus==='waiting')
					cell10.className='bg-danger'
					else
					cell10.className="bg-success"
			}
	}

	renderOrders(){
	let orders=[]
	if(this.state.sortBy==='confirmed')
	orders=Orders.find({bookingStatus:'confirmed'}).fetch()
	else if(this.state.sortBy==='waiting')
	orders=Orders.find({bookingStatus:'waiting'}).fetch()
	else if(this.state.sortBy==='pendingAmount')
	orders=Orders.find({}).fetch().filter(o=>{
	if(o.total-parseInt(o.paymentdone)>0)
	return o 
	})
  else if(this.state.sortBy==='cash')
  orders=Orders.find({paymentMode:'cash'}).fetch()
  else if(this.state.sortBy==='paytm')
  orders=Orders.find({paymentMode:'paytm'}).fetch()
	else
	orders=Orders.find({}).fetch()
		return orders.map(order => {
      let {_id, ganpatiIds,mrp, total,orderId,paymentdone,bookingStatus, bookedBy} = order
      let user = (Meteor.users.find({_id:bookedBy}).fetch()[0])
      
      let bgcolor,btncls=''
      if(bookingStatus==='waiting'){
      bgcolor="bg-danger"
      btncls="btn btn-success pull-right"
      }
      else{
      bgcolor="bg-success"
      btncls="btn btn-success pull-right disabled"
      }
      return (
      <tr key={_id} className="orderRow">
      <td>{user?user.profile.name:''}</td>
      <td>{user?user.emails[0].address:''}</td>
      <td>{user?user.profile.address:''}</td>
      <td>{ganpatiIds}</td>
      <td>{mrp}</td>
      <td>Rs. {total}</td>
      <td>{orderId}</td>
      <td>{paymentdone}</td>
      <td>{total-paymentdone}</td>
      <td className={bgcolor}>{bookingStatus}</td><td>
      <span className={btncls} onClick={()=>{
      ganpatiIds.forEach(function(g){
      let index = g.indexOf(",")
      let s = g.slice(0,index)
      Meteor.call('ganpati.updateBookingStatus', s)
      })
      Meteor.call('orders.confirm', _id, (err,res)=>{
      if(err)
      alert('error')
      alert('order confirmed. Please dont press confirm order more than one time')
      })
      }
      }>Confirm Order</span></td><td>
      
      <span className="btn btn-danger pull-right" onClick={()=>{
      let confirmRemove = confirm('Do you really want to remove this Ganpati?');
      if(confirmRemove===true){
      ganpatiIds.forEach(function(g){
      let index = g.indexOf(",")
      let s = g.slice(0,index)
      Meteor.call('ganpati.updateBookingStatusToFalse', s)
      })
      Meteor.call('orders.remove', order, (err,res)=>{
      if(err)
      alert('error')
      })
      }
      
      }
      }>X</span>
      </td>
      </tr>
    );
      
    });
	}
	render(){
	return(
		<div>
		<Header auth="admin" language='en'/>
		<form onSubmit={this.formSubmit.bind(this)}>
		<span><input type="text" style={{width:30+'%'}} ref="tid" placeholder="Enter transaction ID" />
		<button style={{width:10+'%', marginLeft:2+'%'}} type="submit" value="/" className="btn btn-success"><i className="glyphicon glyphicon-arrow-right" aria-hidden="true"></i></button>
		</span>
		
		</form>
		<button style={{width:20+'%', marginLeft:2+'%'}} className="btn btn-info"  onClick={()=>{window.location.href='/merchantorders'}}>All results</button>
		<span  className="pull-right"><label>Sort by:</label>
    <select id="m1" style={{width:100+"%"}} ref="sort" className="form-control pull-right" onChange={()=>this.setState({sortBy:this.refs.sort.value})}>
          <option></option>
          <option value="confirmed">Confirmed orders</option>     
          <option value="waiting">Waiting Orders</option>
          <option value="pendingAmount">Pending Amount</option>
          <option value="cash">Cash Orders</option>
          <option value="paytm">Paytm Orders</option>
      </select>
      </span><br/>
		{this.props.orders.length===0?<p>You have no placed orders</p>:
                      <table id="myTable" className="table table-striped table-bordered table-hover">
                      <tbody>
                      <tr>
                      <th>Customer Name</th>
                      <th>Customer Mobile</th>
                      <th>Address</th>
                      <th>Ganpati ID</th>
                      <th>MRPs</th>
                      <th>Total</th>
                      <th>Order ID</th>
                      <th>Payment Done</th>
                      <th>Payment Pending</th>
                      <th>Status</th>
                      <th></th>
                      <th></th>
                      </tr>
                      {this.renderOrders()}
                      </tbody>
                      </table>
		}
    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
    <Footer/>

		</div>
		)
	}
}


export default createContainer(()=>{
	Meteor.subscribe('allorders')
	Meteor.subscribe('users')
	return { orders : Orders.find({}).fetch(), users:Meteor.users.find().fetch() };
}, MyOrders)
