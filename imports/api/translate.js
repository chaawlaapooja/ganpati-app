import {Mongo} from 'meteor/mongo';

Meteor.methods({
	'translate.edit' : function(stringFor, en, fr, ar){
		Translate.update({stringFor},{$set :
			{
				
				langArray:{
					en:en,
					fr:fr,
					ar:ar
				}
				
			}
		})
	}

	
})



export const Translate = new Mongo.Collection('translate');