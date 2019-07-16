import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent'; 
import { createContainer } from 'meteor/react-meteor-data';

const CLOUDINARY_UPLOAD_PRESET = 'xskrybbm';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/aniruddha/upload';

export class AddGanpati extends Component {

	constructor(props){
		super(props);

    this.state = {
      uploadedFileCloudinaryUrl: '',
      showImageName:'',
      error :'',
    };
	}

	//function to handle when image is dropped in dropzone
	on_image_drop(files) {
    this.setState({
      uploadedFile: files[0]
    });

    this.handle_image_upload(files[0]);
  }
  //function to handle image upload
  handle_image_upload(file) {
  	let upload = request.post(CLOUDINARY_UPLOAD_URL)
                        .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                        .field('file', file);

    upload.end((err, response) => {
      if (err) {
        alert(err);
      }

      if (response.body.secure_url !== '') {
        this.setState({
          uploadedFileCloudinaryUrl: response.body.secure_url
        });
        this.setState({
        	showImageName: this.state.uploadedFile.name, error:''
        })

      }
    });
  }

	//function that handles submit event from form
	handle_submit(event){
		
		event.preventDefault();
		if(this.state.uploadedFileCloudinaryUrl===''){
			this.setState({error:`Profile picture can't be empty. Please select profile picture`});
		}
		else{
		 Meteor.call('ganpati.insert', 
			this.refs.id.value, this.state.uploadedFileCloudinaryUrl, this.refs.mrp.value,parseInt(this.refs.stock.value), parseInt(0),
			()=>{
				this.refs.id.value='';
				this.refs.photo.value='';
				this.refs.mrp.value='';
				this.refs.stock.value='';
				this.setState({showImageName:'', uploadedFileCloudinaryUrl:'', error:''});
				alert("Ganpati added succesfully")
			}
			)
		}
	
	}
	
	render(){
		return(
			<div className="newsletter">
		<div className="container">
			<div className="col-md-6 w3agile_newsletter_left">
				<h3>Add Ganpati</h3>
			</div>
			<div className="col-md-6 w3agile_newsletter_right">
				<form onSubmit={this.handle_submit.bind(this)}>
					<label style={{color:"white"}}>ID :</label><br/>
					<input type="text" style={{width:40+'%'}} ref="id" placeholder="ID" required/>
					<br/><br/>
					
					<label style={{color:"white"}}>Photo :</label><br/>
					
					<Dropzone ref="photo" multiple={false} accept="image/*" onDrop={this.on_image_drop.bind(this)} >
					{this.state.uploadedFileCloudinaryUrl === '' ?
      					 <p style={{color:"white", paddingLeft:2+'%'}}>Drop an image of Ganpati or click to select a file to upload</p>
      					 :
				        <div>
				          <img src={this.state.uploadedFileCloudinaryUrl} height="200" width="200"/>
				          </div>
				        }
				    </Dropzone>{this.state.error?<span className="pull-right" style={{color:"red"}}>{this.state.error}</span>:undefined}
    				<div>
        			{this.state.uploadedFileCloudinaryUrl === '' ? null :
   						<div>
   						<p style={{color:"white"}}>{this.state.showImageName}</p>
			        	</div>
			        }
			      </div><br/>
			      	<label style={{color:"white"}}>MRP :</label><br/>
					<input type="number" style={{width:40+'%'}} ref="mrp" placeholder="MRP" min="1" required/>
					<br/><br/>
					<label style={{color:"white"}}>Stock Quantity :</label><br/>
					<input type="number" style={{width:40+'%'}} ref="stock" placeholder="stock" min="1" required/>
					<br/><br/>
					<input type="submit" className="btn btn-success"  value='Add' />
				</form>
			</div>
			<div className="clearfix"> </div>

		</div>
		
	</div>
			)
	}
}

export default AddGanpati;