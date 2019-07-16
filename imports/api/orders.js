import { Mongo } from 'meteor/mongo'

Meteor.methods({
	'orders.insert' : function(ganpatiIds, mrp, total, paymentdone, orderId, bookingStatus, paymentMode, bookedBy){
		return Orders.insert({ganpatiIds, mrp, total,paymentdone, orderId, bookingStatus,paymentMode, bookedBy})
	},
	'orders.remove':function(order){
		return Orders.remove(order)
	},
	'orders.confirm':function(_id){
		return Orders.update({_id},{$set:{bookingStatus:'confirmed'}})
	}
})

export const Orders = new Mongo.Collection('orders')