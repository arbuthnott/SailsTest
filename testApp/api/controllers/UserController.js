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
            
            //log in this user
            req.session.authenticated = true;
            req.session.user = user;
            
            // change user to online
            user.online = true;
            
            // throw an event
            sails.sockets.broadcast('userListeners', 'userCreate', user);
            
            // persist user
            user.save(function (err, user) {
                if (err) {
                    return next(err);
                }
                res.redirect('/user/show/' + req.session.user.id);
            });
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
                console.log(err);
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
            
            // throw an event
            sails.sockets.broadcast('userListeners', 'userDelete', {
                id: req.param('id'),
                name: user.name
            });
            
            User.destroy(user.id, function(err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/user');
            });
        });
    },
    
    subscribe : function (req, res) {
        // Make sure this is a socket request (not traditional HTTP)
        if (!req.isSocket) {return res.badRequest();}
        // Have the socket which made the request join the "funSockets" room
        sails.sockets.join(req, 'userListeners');
        console.log("Just joined socked " + req.socket.id + " to the userListeners room");
        // Broadcast a "hello" message to all the fun sockets.
        // This message will be sent to all sockets in the "funSockets" room,
        // but will be ignored by any client sockets that are not listening-- i.e. that didn't call `io.socket.on('hello', ...)`
        sails.sockets.broadcast('userListeners', 'hello', {id: req.socket.id});
        // Respond to the request with an a-ok message
        return res.ok();
    }
	
};

