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
      },
      
      admin : {
          type : 'boolean',
          defaultsTo : false
      },
      
      online : {
          type : 'boolean',
          defaultsTo : false
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
    
  beforeValidate : function (values, next) {
      // awkward - have to handle admin values from routine save or updates,
      // plus the "on" property we get from a form checkbox. :P
      if (values.admin !== true && values.admin !== false) {
          values.admin = (values.admin == 'on');
      }
      next();
  },
    
  beforeCreate : function (values, next) {
      if (!values.password || values.password != values.confirmation) {
          return next({err: ['Password doesn\'t match Password Confirmation']});
      }
      // 10 rounds of hashing...
      require('bcrypt').hash(values.password, 10, function (err, encryptedPassword) {
          if (err) {
              return next(err);
          }
          values.encryptedPassword = encryptedPassword;
          next();
      });
  }
};

