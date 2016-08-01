var passport = require('passport');
var Strategy = require('passport-http').DigestStrategy;

function init(db, col_users) {
    passport.use(new Strategy({ qop: 'auth' },
        function(username, cb) {
            col_users.findOne({ 'username': username }, function(err, user) {
                if (err) { return cb(err); }
                if (!user) { return cb(null, false); }
                return cb(null, user, user.password);
            });
        }
    ));
}
module.exports = init;
