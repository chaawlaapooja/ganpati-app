import React, { Component } from 'react';
import {Link} from 'react-router';
import Header from './Header'
import {Translate} from '/imports/api/translate';
import {createContainer} from 'meteor/react-meteor-data';
import Footer from './Footer'

export class About extends Component{
	constructor(props){
		super(props);
		this.state = {
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
	render(){
	return(
	<div><Header auth="unauth-user" language={this.state.language}/>
	<br/><br/>
		<div className="container">
  <h2>{this.get_string('Chintamani Arts')}</h2>
  <div id="myCarousel" className="carousel slide" data-ride="carousel">
    <ol className="carousel-indicators">
      <li data-target="#myCarousel" data-slide-to="0" className="active"></li>
      <li data-target="#myCarousel" data-slide-to="1"></li>
      <li data-target="#myCarousel" data-slide-to="2"></li>
    </ol>

    <div className="carousel-inner">

      <div className="item active">
        <img src="https://res.cloudinary.com/luckymobile/image/upload/v1563274097/ganpati/ganesh.jpg"
         alt=" " style={{width:100+'%'}}/>
        <div className="carousel-caption">
          <h3>Ganpati Bappa</h3>
          <p>Morya!</p>
        </div>
      </div>

      <div className="item">
        <img src="https://res.cloudinary.com/poo12345/image/upload/v1562154247/soharsoft_teacher-name/bg2lcg7nr633w9vo5cbx.jpg" alt=" " style={{width:100+'%'}}/>
      </div>
    
      <div className="item">
        <img src="https://res.cloudinary.com/poo12345/image/upload/v1562154321/soharsoft_teacher-name/jkgtrc7dw6jnt8kzpkwz.jpg" alt=" " style={{width:100+'%'}}/>
        <div className="carousel-caption">
          <h3>Ganpati Bappa</h3>
          <p>Morya!</p>
        </div>
      </div>
  
    </div>

    <a className="left carousel-control" href="#myCarousel" data-slide="prev">
      <span className="glyphicon glyphicon-chevron-left"></span>
      <span className="sr-only">Previous</span>
    </a>
    <a className="right carousel-control" href="#myCarousel" data-slide="next">
      <span className="glyphicon glyphicon-chevron-right"></span>
      <span className="sr-only">Next</span>
    </a>
  </div>
  <br/><br/>
  <div className="col-md-6 w3ls_about_grid_left">
					<h3>{this.get_string('Heartily welcome to the Chintamani Arts!')}</h3><hr/><br/>
					<p>{this.get_string('It is our soulful responsibilty to deliver the best quality products at the most premium range. With our tradition of providing ganpati statues from decades, we ensure that our statues make your heart joyful. Check out our wide range of variety in statues. We customise the ganpati as per your needs.')}</p>

					<div className="col-xs-2 w3ls_about_grid_left1">
						<a href="https://www.google.com/maps/place/Papachi+Tikati,+Kolhapur,+Maharashtra+416002/@16.6979094,74.2223621,20.15z/data=!4m5!3m4!1s0x3bc1000b2688e36f:0x24747a6cc83cd4d1!8m2!3d16.6984583!4d74.2221872" target="_blank" className="google"><span className="glyphicon glyphicon-map-marker" aria-hidden="true"> </span></a>
					</div>
					<div className="col-xs-10 w3ls_about_grid_left2">
						<p><br/>{this.get_string('Reach out to us at')} : <a href="https://www.google.com/maps/place/Papachi+Tikati,+Kolhapur,+Maharashtra+416002/@16.6979094,74.2223621,20.15z/data=!4m5!3m4!1s0x3bc1000b2688e36f:0x24747a6cc83cd4d1!8m2!3d16.6984583!4d74.2221872" target="_blank" className="google"><strong>{this.get_string('Chintamani Arts, 592, D ward, Kumbhar Galli bazar gate, Behind Anand Shoe House, Papachi tikti, Kolhapur')}</strong></a></p>
					</div>
					<div className="clearfix"> </div>

					<div className="col-xs-2 w3ls_about_grid_left1">
						<a href="mailto:aniruddhakatavare2911@gmail.com"><span className="glyphicon glyphicon-envelope" aria-hidden="true"></span></a>
					</div>
					<div className="col-xs-10 w3ls_about_grid_left2">
						<p><br/>{this.get_string('Mail us on')} <a href="mailto:aniruddhakatavare2911@gmail.com"><strong>aniruddhakatavare2911@gmail.com</strong></a></p>
					</div>
					<div className="clearfix"> </div>

					<div className="col-xs-2 w3ls_about_grid_left1">
						<a href="tel:+918600165860"><span className="glyphicon glyphicon-earphone" aria-hidden="true"></span></a>
					</div>
					<div className="col-xs-10 w3ls_about_grid_left2">
						<p><br/>{this.get_string('For more details, Call on')} <a href="tel:+918446707474"><strong>+918446707474</strong>.</a></p>
					</div>
					<div className="clearfix"> </div>
					
        </div>

				<div className="col-md-6 w3ls_about_grid_right">
					<img src="https://res.cloudinary.com/poo12345/image/upload/v1561625435/soharsoft_teacher-name/msrxvealctkjlqleexgi.jpg" alt=" " className="img-responsive" />
				</div>
</div><br/>
<Footer/>
</div>

		)
	}
};

export default createContainer(()=>{
	Meteor.subscribe('translate')
  return { 
  translate:Translate.find({}).fetch(),
  }
}, About)