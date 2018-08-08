function redirectToEditProfile(req, res, next) {
  if (req.path == "/users/me/edit") return next();
  if (req.user && (!req.user.email || !req.user.mobile_number)) {
    return res.redirect("/users/me/edit");
  }
  return next();
}
module.exports = {
  redirectToEditProfile
};
