/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    
    'new' : function (req, res) {
        //res.locals.flash = _.clone(req.session.flash); // so we can access the message on the page?
        
        //console.log("BEFORE CLEARING:\n" + JSON.stringify(req.session.flash));
        
        res.view(); // returns the 'new' view by default?
        //req.session.flash = {}; // unset any flash messages
        
        //console.log("AFTER CLEARING:\n" + JSON.stringify(req.session.flash));
    },
    
    create : function (req, res, next) {
        User.create(req.body, function(err, user) {
            if (err) {
                //console.log(JSON.stringify(err));
                //req.session.flash = {
                //    err: err
                //};
                for (var attrib in err.invalidAttributes) {
                    req.addFlash('invalid', 'Check your ' + attrib + ' entry.');
                }
                
                return res.redirect('/user/new');
            }
            // show the new user
            //req.session.flash = {}; // unset any flash messages.
            res.redirect('/user/show/' + user.id);
        });
    },
    
    show : function (req, res, next) {
        User.findOne(req.param('id'), function (err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next();
            }
            res.view({user: user});
        });
    },
    
    index : function (req, res, next) {
        User.find(function(err, users) {
            if (err) {
                return next(err);
            }
            res.view({users: users});
        });
    },
    
    edit : function (req, res, next) {
        User.findOne(req.param('id'), function (err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next();
            }
            res.view({user: user});
        });
    },
    
    update : function (req, res, next) {
        User.update(req.param('id'), req.body, function (err, updated) {
            if (err) {
                for (var attrib in err.invalidAttributes) {
                    req.addFlash('invalid', 'Check your ' + attrib + ' entry.');
                }
                return res.redirect('/user/edit/' + req.param('id'));
            }
            
            res.redirect('/user/show/' + updated[0].id);
        });
    },
    
    destroy : function (req, res, next) {
        User.findOne(req.param('id'), function (err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next('User doesn\'t exist');
            }
            User.destroy(user.id, function(err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/user');
            });
        });
    }
	
};

