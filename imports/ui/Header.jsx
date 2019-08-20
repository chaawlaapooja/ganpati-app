import React, { Component } from 'react';
import Accounts from './Accounts'
import {Link, browserHistory} from 'react-router'
import {Cart} from '/imports/api/cart';
import Modal from 'react-awesome-modal';
import {createContainer} from 'meteor/react-meteor-data';
import {Translate} from '/imports/api/translate';
import {DefaultLanguage} from '/imports/api/defaultLanguage';

export class Header extends Component {
constructor(props){
		super(props);

	    this.state = {
	      
        modalCart:false,
        total:0,
        language:'',
        modalConfirm:false
	    };

    }
    close_modal() {
        this.setState({
            modalCart :false,
            modalConfirm:false
        });
  	}
	componentDidMount(){
	let cartbtn = document.querySelector('.cartbtn')
    if(cartbtn)
    cartbtn.addEventListener('click', ()=>{
    this.setState({
            modalCart : true
        });
    this.getTotal()
    })
     let languages = (document.querySelectorAll('.lang'))
      languages.forEach(language=>{
        language.addEventListener("click", ()=>this.set_language(language))
       })

	}
  //get strings/labels for selected language
    get_string(stringFor){
    let language=''
    if(this.props.language)
    language =  this.props.language
    else
    language='en'
      return (Translate.find({stringFor}).fetch()[0]?Translate.find({stringFor}).fetch()[0].langArray[language]:undefined)
   }
  onCashClick(){
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
        Meteor.call('orders.insert',g,mop,sum,'0', '---','waiting','cash', Meteor.userId(),(err,res)=>{
        if(err)alert('error')
        else{
        Meteor.call('cart.removeAll',Meteor.userId());
        let msg = this.get_string('Order added successfully')
        alert(msg)
        this.setState({modalCart:false,modalConfirm:false})
        }
        })
  }
  onConfirmOrder(){
    this.setState({
            modalConfirm : true
        });
  }
  set_language(language){
    if(language.id==='English'){
        Meteor.call('DefaultLanguage.update', 'en')
    }
      else if(language.id==='Marathi'){
        Meteor.call('DefaultLanguage.update', 'mr')
    }
    }
    
  
	getTotal(){
  let mrp = document.querySelectorAll('.mrp')
  let sum = 0
  mrp.forEach(function(m){
  sum=sum+parseInt(m.id)
  })
  this.setState({total:sum})
  }
  renderCartItems(){
  return this.props.cartitems.map(cartitem => {
      let {_id, ganpatiId,image, mrp} = cartitem
      return (
      <tr key={_id}>
      <td className="gid">{ganpatiId}</td>
      <td><img src={image} height="100" width="100"/></td>
      <td className="mrp" id={mrp}>{mrp}
      <span className="btn btn-danger pull-right" onClick={()=>{
      Meteor.call('cart.remove', cartitem, (err,res)=>{
      if(res)
      this.getTotal()
      })
      
      }
      }>X</span>
      </td>
      </tr>
    );
      
    });

  }
  onLanClick(){
  let ls = document.querySelector('.dropdown')
  ls.classList.toggle="dropdown open"
  }
	render(){
  let pwd=document.querySelector('#login-buttons-open-change-password')
  if(pwd){
  pwd.innerHTML=this.get_string('Change password')
  document.querySelector('#login-buttons-logout').innerHTML=this.get_string('Sign out')
  document.querySelector('.login-close-text').innerHTML=this.get_string('CLOSE')
  }
  
		if(this.props.auth==='unauth-user')
		return(
    <div>
		<nav className="navbar navbar-inverse navbar-fixed-top" style={{padding:0+'px'}}>
		  <div className="container-fluid">
		    <div className="navbar-header">
        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>                        
      </button>
		      <Link to="/" className="navbar-brand">{this.get_string('Chintamani Arts')}</Link>
		    </div>
        <div className="collapse navbar-collapse" id="myNavbar">
        <ul className="nav navbar-nav">
            <li><Link to={{pathname: '/about',state: {language: this.props.language}}}>{this.get_string('About Chintamani')}</Link></li>
        </ul>
		    <ul className="nav navbar-nav navbar-right">
        <li className="dropdown" onClick={()=>{this.onLanClick()}}>
        <a className="dropdown-toggle" data-toggle="dropdown"><i className="fa fa-language">
        {this.get_string('Language')}<span className="caret"></span></i></a>
        <ul className="dropdown-menu">
          <li><a className="lang" id="English">{this.get_string('English')}
          </a></li>
          <li><a className="lang" id="Marathi">
          {this.get_string('Marathi')}</a></li>
        </ul>
        </li>
		      <li><Link to={{pathname: '/register',state: {language: this.props.language}}}><span className="glyphicon glyphicon-user"></span>{this.get_string('Register')}</Link></li>
      <li><Link to={{pathname: '/login',state: {language: this.props.language}}}><span className="glyphicon glyphicon-log-in"></span>{this.get_string('Login')}</Link></li>
		    </ul>
		  </div>
      </div>
		</nav>
    <br/>
    </div>
		)
		else if(this.props.auth==="auth-user")
		return(
		<div>
		<Modal visible={this.state.modalCart} width="500" effect="fadeInUp" onClickAway={() => this.close_modal()} >
                    <div className="modal-content">
                    <div className="modal-header mh" style={{color: "white"}}>
                    <button type="button" className="close" onClick={() => this.close_modal()}>&times;</button>
                    <h4 className="modal-title" style={{color: "white"}}>{this.get_string('Cart Items')}</h4>
                    </div>
                    <div className="modal-body">
                      {this.props.cartitems.length===0?<p>{this.get_string('You have no items in cart')}</p>:
                      <div><table className="table table-striped table-bordered table-hover">
                      <tbody>
                      <tr>
                      <th>{this.get_string('Ganpati ID')}</th>
                      <th>{this.get_string('Ganpati')}</th>
                      <th>{this.get_string('Price')}</th>
                      </tr>
                      {this.renderCartItems()}
                      </tbody>
                      </table>
                      <label>{this.get_string('Total')} : Rs. {this.state.total}</label><br/>
                      <button className="btn btn-success btn-block" onClick={()=>this.onConfirmOrder()}>{this.get_string('Confirm Order')}</button>
                      
                      </div>
                      }

                    </div>
                    <div className="modal-footer mh" >
                      <button type="button" className="btn btn-default" onClick={() => this.close_modal()} >{this.get_string('CLOSE')}</button>
                    </div>
                    </div>
          </Modal>
          <Modal visible={this.state.modalConfirm} width="500" effect="fadeInUp" onClickAway={() => this.close_modal()} >
                    <div className="modal-content">
                    <div className="modal-header mh" style={{color: "white"}}>
                    <button type="button" className="close" onClick={() => this.close_modal()}>&times;</button>
                    <h4 className="modal-title" style={{color: "white"}}>{this.get_string('Confirm Order')}</h4>
                    </div>
                    <div className="modal-body">
                      <p>{this.get_string('How do you want to pay?')}</p>
                      <button className="btn btn-primary pull-left" onClick={()=>this.onCashClick()} style={{backgroundColor:'#00b9f5',border: 1+'px solid #00b9f5'}}>{this.get_string('Cash')}</button><br/><br/>
                      <br/>
                      <a href="https://securegw.paytm.in/link/44453/LL_7181327"
        target='_blank' rel='im-checkout' data-behaviour='remote'
        data-style='light' data-text="Pay with Paytm" style={{borderRadius: 2+'px',display: 'inline-block',border: 1+'px solid #e6ebf3', paddingTop: 0+'px',paddingLeft: 23+'px',paddingBottom: 0+'px',paddingRight: 23+'px',color: '#182233',fontSize: 12+'px',textDecoration: 'none',height: 32+'px',lineHeight: 28+'px', background: '#00b9f5', color: '#ffffff', border: 1+'px solid #00b9f5'}} onClick={()=>window.location.href='/myorders'}>
        <span>Pay  with</span>
            <img style={{marginLeft: 6+'px', verticalAlign:'sub',width: 50+'px'}}
                 src="https://static1.paytm.in/1.4/plogo/paytmlogo-white.png" /></a> {this.get_string(`and enter Order ID in 'My orders'`)}
                    </div>
                    <div className="modal-footer mh" >
                      <button type="button" className="btn btn-default" onClick={() => this.close_modal()} >{this.get_string('CLOSE')}</button>
                    </div>
                    </div>
          </Modal>
			<nav className="navbar navbar-inverse navbar-fixed-top">
			  <div className="container-fluid">
			    <div className="navbar-header">
          <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>                        
      </button>
			      <Link to="/" className="navbar-brand">{this.get_string('Chintamani Arts')}</Link>
			    </div>
          <div className="collapse navbar-collapse" id="myNavbar">
          
			    <ul className="nav navbar-nav">
			      <li><Link to={{pathname: '/myorders',state: {language: this.props.language}}}>{this.get_string('My Orders')}</Link></li>
			      <li><Link to={{pathname: '/profile',state: {language: this.props.language}}}>{this.get_string('Profile')}</Link></li>
				</ul>
			    <ul className="nav navbar-nav navbar-right">
			    	<li><button className="btn btn-info btn-md cartbtn"><i className="glyphicon glyphicon-shopping-cart" aria-hidden="true">{this.get_string('Cart')}</i></button></li>
            <li className="dropdown" onClick={()=>{this.onLanClick()}}>
        <a className="dropdown-toggle" data-toggle="dropdown"><i className="fa fa-language">
        {this.get_string('Language')}<span className="caret"></span></i></a>
        <ul className="dropdown-menu" >
          <li className="l"><a className="lang" id="English">{this.get_string('English')}
          </a></li>
          <li className="l"><a className="lang" id="Marathi">
          {this.get_string('Marathi')}</a></li>
        </ul>
        </li>
			      <li><Accounts/></li>
			    </ul>
			  </div>
        </div>
			</nav><br/><br/><br/>
			</div>
		)
		else if(this.props.auth==='admin')
		return(
    <div>
			<nav className="navbar navbar-inverse navbar-fixed-top">
			  <div className="container-fluid">
			    <div className="navbar-header">
          <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>                        
      </button>
			      <Link to="/" className="navbar-brand">Chintamani Arts</Link>
			    </div>
          <div className="collapse navbar-collapse" id="myNavbar">
			    <ul className="nav navbar-nav">
			      <li><Link to={{pathname: '/ganpati',state: {language: this.props.language}}}> {this.get_string('Ganpati')}</Link></li>
				  <li><Link to="/merchantorders"> {this.get_string('Orders')}</Link></li>
			    </ul>
			    <ul className="nav navbar-nav navbar-right">
            <li className="dropdown" onClick={()=>{this.onLanClick()}}>
        <a className="dropdown-toggle" data-toggle="dropdown"><i className="fa fa-language">
        {this.get_string('Language')}<span className="caret"></span></i></a>
        <ul  className="dropdown-menu">
          <li><a className="lang" id="English">{this.get_string('English')}
          </a></li>
          <li><a className="lang" id="Marathi">
          {this.get_string('Marathi')}</a></li>
        </ul>
        </li>
			      <li><Accounts/></li>
			    </ul>
			  </div>
        </div>
			</nav>
      <br/><br/><br/>
      </div>
		)
	}
}

export default createContainer(()=>{
	Meteor.subscribe('translate')
  Meteor.subscribe('cart-items');
 return { 
  cartitems : Cart.find({}).fetch(),
  translate:Translate.find({}).fetch(),
  }
}, Header)