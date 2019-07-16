import { Meteor } from 'meteor/meteor';
import {Ganpati} from '/imports/api/ganpatis';
import {Cart} from '/imports/api/cart';
import {Orders} from '/imports/api/orders';
import {Translate} from '/imports/api/translate';
import {DefaultLanguage} from '/imports/api/defaultLanguage';


Meteor.startup(() => {
  Meteor.publish('ganpatis' ,function(){
    return Ganpati.find({},{sort:{_id:-1}})
  });
  Meteor.publish('cart-items', function(){
    return Cart.find({bookedBy:Meteor.userId()})
  });
  Meteor.publish('orders', function(){
    return Orders.find({bookedBy:Meteor.userId()})
  });
  Meteor.publish('allorders', function(){
    return Orders.find({})
  });
  Meteor.publish('users', function(){
    return Meteor.users.find({})
  });
  Meteor.publish('translate', function(){
    return Translate.find({})
  });
  Meteor.publish('defaultLanguage', function(){
    return DefaultLanguage.find({})
  });
});
