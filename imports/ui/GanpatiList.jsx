import React, { Component } from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Ganpati} from '/imports/api/ganpatis';
import {Cart} from '/imports/api/cart';
import {Link} from 'react-router'
import Modal from 'react-awesome-modal';
import {browserHistory } from 'react-router';
import {Translate} from '/imports/api/translate';
import Footer from './Footer'
class GanpatiList extends Component{
	constructor(props){
		super(props);

	    this.state = {
	      sortBy:'',
        total:0
	    };

    }
    componentDidMount(){
    this.setState({language:this.props.language}) 
    
      let languages = (document.querySelectorAll('.lang'))
      languages.forEach(language=>{
        language.addEventListener("click", ()=>this.set_language(language))
       })
    }
    set_language(language){
    if(language.id==='English'){
        Meteor.call('DefaultLanguage.update', 'en')
    }
      else if(language.id==='Marathi'){
        Meteor.call('DefaultLanguage.update', 'mr')
    }
    }
    //get strings/labels for selected language
    get_string(stringFor){
    let language =  this.props.language
      return (Translate.find({stringFor}).fetch()[0]?Translate.find({stringFor}).fetch()[0].langArray[language]:undefined)
   }
    onSortChange(parameter){
    this.setState({sortBy:parameter})
    }
  	onAddToCartClick(id, image, mrp){
  		if(!Meteor.userId()){
  		window.alert(this.get_string('You need to login first'))
  		}
  		else
  		{
      Meteor.call('cart.insert', id, image, mrp, Meteor.userId(), (err, res)=>{
      if(err)
      alert('Some error occurred')
      })
      }
  	}
	renderList() {
  let ganpatis=[]
  if(this.state.sortBy==='newest')
  ganpatis=Ganpati.find({},{sort:{_id:-1}}).fetch()
  else if(this.state.sortBy==='highToLow')
  ganpatis=Ganpati.find({},{sort:{mrp:-1}}).fetch()
  else if(this.state.sortBy==='lowToHigh')
  ganpatis=Ganpati.find({},{sort:{mrp:1}}).fetch()
  else if(this.state.sortBy==='instock')
  ganpatis=Ganpati.find({booked:false}).fetch()
  else
  ganpatis=Ganpati.find({},{sort:{_id:1}}).fetch()

    return ganpatis.map(ganpati => {
      let {_id, id, mrp, image,stock, booked} = ganpati
      let cartBtn, cls=''
      if(stock===0){
      cartBtn="pull-right btn btn-primary disabled"
      cls='topleft btn btn-danger'
      }
      else 
      cartBtn="pull-right btn btn-primary"
      return (
      <div key={_id} className="img-block">
<span className={cls}>{cls?this.get_string('Out of stock'):undefined}</span>
    <img className="offerImg img-fluid" src={image} alt={id} />

    <div className="img-btns">
    <span style={{width:30+'%'}} className="pull-left btn btn-success">Rs. {mrp}</span>
    <span style={{width:30+'%'}} className="btn btn-warning">{this.get_string('ID')} : {id}</span>
    <span style={{width:30+'%'}} className={cartBtn} onClick={()=>this.onAddToCartClick(id,image, mrp)}>{this.get_string('Add to Cart')}</span>
    </div>
    </div>
    );
      
    });
  }
  close_modal() {
        this.setState({
            modalVisible : false
        });
    }
	render(){
		return(
		<div><br/><br/>
           <span style={{marginLeft:3+'%'}}><a href="tel:+918600165860"><span className="glyphicon glyphicon-earphone" aria-hidden="true"></span></a>
            <span style={{marginLeft:1+'%'}}>{this.get_string('For more details, Call on')} <a href="tel:+918446707474"><strong>+918446707474</strong>.</a></span></span>
          
    <span  className="pull-right"><label>{this.get_string('Sort by')} :</label>
    <select id="m1" style={{width:100+"%"}} ref="sort" className="form-control pull-right" onChange={()=>this.setState({sortBy:this.refs.sort.value})}>
          <option></option>
          <option value="newest">{this.get_string('Newest Arrival')}</option>     
          <option value="highToLow">{this.get_string('Price - High to Low')}</option>
          <option value="lowToHigh">{this.get_string('Price - Low to High')}</option>
          <option value="instock">{this.get_string('Available in Stock')}</option>
      </select>
      </span>
      <br/><br/><br/>
          
			<div className="containerOffer">
			    {this.renderList()}
			</div>
      <Footer/>
		</div>
		)
	}
}

export default createContainer(()=>{
	Meteor.subscribe('ganpatis');
  Meteor.subscribe('translate')
  return { ganpatis : Ganpati.find({}).fetch(),
  translate:Translate.find({}).fetch()}
}, GanpatiList)