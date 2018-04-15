const hbs = require('express-hbs');
hbs.registerHelper('ifneq', function(options) {
        return (options.hash.expected != options.hash.val) ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper('ifeq', function(options) {
        return (options.hash.expected == options.hash.val) ? options.fn(this) : options.inverse(this);
});
