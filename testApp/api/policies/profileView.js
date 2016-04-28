/**
 * profileView
 *
 * @module      :: Policy
 * @description :: Allows profile view on own profile or any for admin users.
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  var isAdmin = req.session.authenticated && req.session.user && req.session.user.admin;
  var isOwnProfile = req.session.authenticated && req.session.user && req.session.user.id == req.param('id');
  if (isAdmin || isOwnProfile) {
    return next();
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  req.addFlash('invalid', 'Please log in as administrative user.');
  res.redirect('/session/new');
  return;
};
