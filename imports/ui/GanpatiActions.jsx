import React, { Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Ganpati } from '/imports/api/ganpatis';
import Modal from 'react-awesome-modal';
import Dropzone from 'react-dropzone';
import request from 'superagent'; 

const CLOUDINARY_UPLOAD_PRESET = 'g2uqceao';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/poo12345/upload';


class GanpatiActions extends Component{
  constructor() {
        super(...arguments);
        
        this.state = {
            visible : false,
            ganpati :'',
            uploadedFileCloudinaryUrl: '',
            showImageName:'',
        };
    }
    
  //function to remove ganpati
  on_ganpati_remove(ganpati){
    Meteor.call('ganpati.remove', ganpati)
  }
  //function to edit ganpati record
  on_teacher_edit(ganpati){
    this.setState({
            visible : true, ganpati: ganpati
        });
  }
  //function to close modal
  close_modal() {
        this.setState({
            visible : false,
        });
  }
  //function to handle dropping of image in dropzone
    on_image_drop(files) {
    this.setState({
      uploadedFile: files[0]
    });

    this.handle_image_upload(files[0]);
  }
//function to handle image uploading
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
          showImageName: this.state.uploadedFile.name
        })
      }
    });
  }
  //function to handle submit edit event
  handle_edit_submit(event){
    event.preventDefault();
    let id, photoURL, mrp, stock =''
    if(this.refs.id.value==='')
      id = this.state.ganpati.id;
    else
      id = this.refs.id.value;
    
    if(this.state.uploadedFileCloudinaryUrl==='')
      photoURL = this.state.ganpati.image;
    else
      photoURL = this.state.uploadedFileCloudinaryUrl;
    if(this.refs.mrp.value==='')
      mrp = this.state.ganpati.mrp;
    else
      mrp = this.refs.mrp.value;
    if(this.refs.stock.value==='')
      stock = this.state.ganpati.stock;
    else
      stock = parseInt(this.refs.stock.value);
    Meteor.call('ganpati.update', this.state.ganpati._id,
      id, photoURL, mrp,stock,
      (error,res)=>{
        if(error){
            alert("Error updating record");
      } 
        else{
        this.refs.id.value='';
        this.refs.mrp.value='';
        this.refs.stock.value='';
        this.setState({showImageName:'', uploadedFileCloudinaryUrl:''})
        alert('Ganpati record updated succesfully');
        this.close_modal();
      }
      }
      )
  }
  //function to list all teachers
	render_rows() {
    return this.props.ganpatis.map(ganpati => {
      let { _id, id, image ,mrp,stock,booked} = ganpati;
      let bookingStatus =''
      
      return (
        <tr key={_id}>
          
          <td>{id}</td>
          <td><img src={image} height="100" width="100"/></td>
          <td>Rs. {mrp}</td>
          <td>{booked}</td>
          <td>{stock}
          
         <span className="pull-right">
          <input type="submit"  className="btn btn-primary" style={{width : 100 +"%"}} value="Edit" onClick={()=>this.on_teacher_edit(ganpati)} />
          </span></td><td style={{width : 10 +"%"}}>
          <span className="pull-right">
          <input type="submit"  className="btn btn-danger" style={{width : 100 +"%"}} value="Remove"
          onClick={()=>{
            let confirmRemove = confirm('Do you really want to remove this Ganpati?');
            if(confirmRemove===true){
              this.on_ganpati_remove(ganpati);
            }
          }} />
          </span></td>
        </tr>
      );
    });
  }

	render() {
    return (
      <div>
      <h2>Ganpati List</h2>
      <Modal visible={this.state.visible} width="500" effect="fadeInUp" onClickAway={() => this.close_modal()} >
                    <div className="modal-content">
                    <div className="modal-header mh" style={{color: "white"}}>
                    <button type="button" className="close" onClick={() => this.close_modal()}>&times;</button>
                    <h4 className="modal-title" style={{color: "white"}}>You clicked edit button</h4>
                    </div>
                    <div className="modal-body">
                      <form onSubmit={this.handle_edit_submit.bind(this)}>
                        <label >ID:</label><br/>
          <input type="text" ref="id" style={{width:40+'%'}} placeholder={this.state.ganpati.id}  />
          <br/><br/>
          
          <label >Photo :</label><br/>
          
          <Dropzone ref="photo" multiple={false} accept="image/*" onDrop={this.on_image_drop.bind(this)}>
          {this.state.uploadedFileCloudinaryUrl === '' ?
                 <img src={this.state.ganpati.image} height="200" width="200"/>
                 :
                <div>
                  <img src={this.state.uploadedFileCloudinaryUrl} height="200" width="200"/>
                  </div>
                }
            </Dropzone>{this.state.error?<span className="pull-right" style={{color:"red"}}>{this.state.error}</span>:undefined}
            <div>
              {this.state.uploadedFileCloudinaryUrl === '' ? null :
              <div>
              <p >{this.state.showImageName}</p>
              </div>
              }
            </div><br/>
            <label>MRP :</label><br/>
          <input type="number" ref="mrp" style={{width:40+'%'}} placeholder={this.state.ganpati.mrp}/>
          <br/><br/>
          <label>Stock Quantity :</label><br/>
          <input type="number" style={{width:40+'%'}} ref="stock" placeholder={this.state.ganpati.stock} min="1"/>
          <br/><br/>
          <input type="submit" className="btn btn-success"  value="Edit" />
        </form>
                    </div>
                    <div className="modal-footer mh" >
                      <button type="button" className="btn btn-default" onClick={() => this.close_modal()} >CLOSE</button>
                    </div>
                    </div>
          </Modal>
      <table className="table table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Photo</th>
            <th>MRP</th>
            <th>Booked stock</th>
            <th>Remaining stock</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {this.render_rows()}
        </tbody>
      </table>
      <h4> Total number of ganpatis : {Ganpati.find().count()}</h4>
      </div>
    );
  }
}
   


export default createContainer(() => {
  Meteor.subscribe('ganpatis');
  return { ganpatis: Ganpati.find({}).fetch()
   };
}, GanpatiActions);




