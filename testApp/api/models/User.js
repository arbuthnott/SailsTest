/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  schema: true,
  attributes: {
      
      name : {
          type : 'string',
          required: true
      },
      
      title : {
          type : 'string'
      },
      
      email : {
          type : 'string',
          email: true,
          required: true,
          unique: true
      },
      
      encryptedPassword : {
          type : 'string'
      },
      
      toJSON : function() {
          var obj = this.toObject();
          delete obj.password;
          delete obj.confirmation;
          delete obj.encryptedPassword;
          delete obj._csrf;
          
          return obj;
      }
  },
    
  beforeCreate : function (values, next) {
      if (!values.password || values.password != values.confirmation) {
          return next({err: ['Password doesn\'t match Password Confirmation']});
      }
      require('bcrypt').hash(values.password, 10, function (err, encryptedPassword) {
          if (err) {
              return next(err);
          }
          values.encryptedPassword = encryptedPassword;
          next();
      });
  }
};

