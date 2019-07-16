import Header from './Header'
import React, { Component } from 'react';
import {Orders} from '/imports/api/orders';
import {createContainer} from 'meteor/react-meteor-data';
import {Translate} from '/imports/api/translate';
import Footer from './Footer'

export class MyOrders extends Component{
constructor(props){
		super(props);

	    this.state = {
        sortBy:'',
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
			let gids=(document.querySelectorAll('.gid'))
			let g=[]
			let mop=[]
			gids.forEach(function(gid){
			g.push(gid.innerHTML+', ')
			})
			let mrp = document.querySelectorAll('.mrp')
			  let sum = 0
			  mrp.forEach(function(m){
			  mop.push('Rs.' +m.id+', ')
			  sum=sum+parseInt(m.id)
			  })
			  Meteor.call('orders.insert',g,mop,sum,this.refs.paymentdone.value, this.refs.tid.value,'waiting','paytm', Meteor.userId(),(err,res)=>{
			  if(err)alert('error')
			  else{
			  Meteor.call('cart.removeAll',Meteor.userId());
			  this.refs.tid.value=''
			  this.refs.paymentdone.value=''

			  }
			  })
	}
	renderOrders(){
	let orders=[]
	if(this.state.sortBy==='confirmed')
	orders=Orders.find({bookingStatus:'confirmed'}).fetch()
	else if(this.state.sortBy==='waiting')
	orders=Orders.find({bookingStatus:'waiting'}).fetch()
  else if(this.state.sortBy==='cash')
  orders=Orders.find({paymentMode:'cash'}).fetch()
  else if(this.state.sortBy==='paytm')
  orders=Orders.find({paymentMode:'paytm'}).fetch()
	else
	orders=Orders.find({}).fetch()
	return orders.map(order => {
      let {_id, ganpatiIds,mrp, total,orderId,paymentdone,paymentMode,bookingStatus} = order
      let bgcolor=''
      if(bookingStatus==='waiting')
      bgcolor="bg-danger"
      else
      bgcolor="bg-success"
      return (
      <tr key={_id}>
      <td>{ganpatiIds}</td>
      <td>{mrp}</td>
      <td>Rs. {total}</td>
      <td>{orderId}</td>
      <td>{paymentdone}</td>
      <td>{total-paymentdone}</td>
      <td>{this.get_string(paymentMode)}</td>
      <td className={bgcolor}>{bookingStatus}
      
      
      <span className="btn btn-danger pull-right" onClick={()=>{
      let confirmRemove = confirm(this.get_string('Do you really want to remove this order')+'?');
            if(confirmRemove===true)
      Meteor.call('orders.remove', order, (err,res)=>{
      if(err)
      alert('error')
      })
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
		<Header auth="auth-user" language={this.state.language}/>
		<form onSubmit={this.formSubmit.bind(this)}>
		<span><input type="text" style={{width:30+'%'}} ref="tid" placeholder={this.get_string("Enter order ID")} required/>
		<input type="number" style={{width:30+'%', marginLeft:5+'%'}} ref="paymentdone" placeholder={this.get_string("Enter Payment Amount")} required/>
		<button style={{width:10+'%', marginLeft:2+'%'}} type="submit" value="/" className="btn btn-success"><i className="glyphicon glyphicon-arrow-right" aria-hidden="true"></i></button>
		</span>
		</form>
		<span  className="pull-right"><label>{this.get_string('Sort by')} :</label>
    <select id="m1" style={{width:100+"%"}} ref="sort" className="form-control pull-right" onChange={()=>this.setState({sortBy:this.refs.sort.value})}>
          <option></option>
          <option value="confirmed">{this.get_string('Confirmed Orders')}</option>     
          <option value="waiting">{this.get_string('Waiting Orders')}</option>
          <option value="cash">{this.get_string('Cash Orders')}</option>
          <option value="paytm">{this.get_string('Paytm Orders')}</option>
      </select>
      </span>
		{this.props.orders.length===0?<p>{this.get_string('You have no placed orders')}</p>:
                      <table className="table table-striped table-bordered table-hover">
                      <tbody>
                      <tr>
                      <th>{this.get_string('Ganpati ID')}</th>
                      <th>{this.get_string('Price')}</th>
                      <th>{this.get_string('Total')}</th>
                      <th>{this.get_string('Order ID')}</th>
                      <th>{this.get_string('Paid Amount')}</th>
                      <th>{this.get_string('Pending Amount')}</th>
                      <th>{this.get_string('Payment Mode')}</th>
                      <th>{this.get_string('Status')}</th>
                      </tr>
                      {this.renderOrders()}
                      </tbody>
                      </table>
		}
    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
    <br/><Footer/>
		</div>
		)
	}
}


export default createContainer(()=>{
	Meteor.subscribe('translate')
  	Meteor.subscribe('orders')
	return { orders : Orders.find({}).fetch(),
	translate:Translate.find({}).fetch(),
   };
}, MyOrders)
