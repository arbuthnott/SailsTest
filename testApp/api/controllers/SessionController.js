/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    
    'new' : function (req, res) {
        res.view();
    },
    
    'create' : function (req, res, next) {
        if (!req.param('email') || !req.param('password')) {
            // send back to login?
            req.addFlash('invalid', 'Email and password required to sign in.');
            res.redirect('/session/new');
            return;
        }
        User.findOneByEmail(req.param('email'), function(err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.addFlash('invalid', 'No user with that email on record.');
                res.redirect('/session/new');
                return;
            }
            if (!bcrypt) { var bcrypt = require('bcrypt'); }
            bcrypt.compare(req.param('password'), user.encryptedPassword, function (err, valid) {
                if (err) {
                    return next(err);
                }
                if (!valid) {
                    req.addFlash('invalid', 'Invalid email and password combination');
                    res.redirect('/session/new');
                    return;
                }
                
                // we have a winner
                req.session.authenticated = true;
                req.session.user = user;
                
                // set to be online
                user.online = true;
                user.save(function(err, user) {
                    if (err) {
                        return next(err);
                    }
                    // report the new user online
                    sails.sockets.broadcast('userListeners', 'userUpdate', {
                        id: req.session.user.id,
                        name: req.session.user.name,
                        loggedIn: true
                    });
                    
                    if (req.session.user.admin) {
                        res.redirect('/user');
                    } else {
                        res.redirect('/user/show/' + req.session.user.id);
                    }
                });
                
                
            });
        })
    },
    
    'destroy' : function (req, res, next) {
        // change current user's status to offline
        User.update(req.session.user.id, {online : false, admin : req.session.user.admin}, function(err, users) {
            if (err) {
                return next(err);
            }
            
            // report this user offline
            sails.sockets.broadcast('userListeners', 'userUpdate', {
                id: req.session.user.id,
                name: req.session.user.name,
                loggedIn: false
            })
            
            req.session.destroy();
            res.redirect('/session/new');
        });
    }
	
};

