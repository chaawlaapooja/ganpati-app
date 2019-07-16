import { Mongo } from 'meteor/mongo'

Meteor.methods({
	'ganpati.insert' : function(id, image,mrp, stock,booked){
		return Ganpati.insert({id, image,mrp, stock, booked})
	},
	'ganpati.update':function(_id, id,image, mrp,stock){
		return Ganpati.update({_id},{$set:{id,image, mrp,stock}})
	},
	'ganpati.remove':function(ganpati){
		return Ganpati.remove(ganpati)
	},
	'ganpati.updateBookingStatus':function(id){
		return Ganpati.update({id},{$inc:{stock:-1, booked:1}})
	},
	'ganpati.updateBookingStatusToFalse':function(id){
		return Ganpati.update({id},{$set:{booked:false}})
	}
})

export const Ganpati = new Mongo.Collection('ganpatis')