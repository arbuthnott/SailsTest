/**
 * admin
 *
 * @module      :: Policy
 * @description :: Allows any admin user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  if (req.session.authenticated && req.session.user && req.session.user.admin) {
    return next();
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  req.addFlash('invalid', 'Please log in as administrative user.');
  res.redirect('/session/new');
  return;
};
