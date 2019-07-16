import { Mongo } from 'meteor/mongo'

Meteor.methods({
	'cart.insert' : function(ganpatiId,image,mrp,bookedBy){
		return Cart.insert({ganpatiId,image,mrp,bookedBy})
	},
	'cart.remove':function(cartItem){
		return Cart.remove(cartItem)
	},
	'cart.removeAll':function(bookedBy){
		return Cart.remove({bookedBy})
	}
})

export const Cart = new Mongo.Collection('carts')