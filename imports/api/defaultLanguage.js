import {Mongo} from 'meteor/mongo';

Meteor.methods({
	'DefaultLanguage.update' : function(lang){
		DefaultLanguage.update({ID:'1'},{$set :
			{
			DefaultLanguage:lang
		}
	})
	
}
	
	
})


export const DefaultLanguage = new Mongo.Collection('defaultLanguage');