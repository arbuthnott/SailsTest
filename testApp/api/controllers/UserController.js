/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    
    'new' : function (req, res) {
        res.view(); // returns the 'new' view by default?
    },
    
    create : function (req, res, next) {
        User.create(req.body, function(err, user) {
            if (err) {
                return next(err);
            }
            // show the new user
            res.json(user);
        });
    }
	
};

