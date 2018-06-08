const hbs = require('express-hbs');
const debug = require('debug')('oauth:utils:handlebars')
hbs.registerHelper('ifneq', function(options) {
        return (options.hash.expected != options.hash.val) ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper('ifeq', function(options) {
        return (options.hash.expected == options.hash.val) ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper('formatDate', function (date) {
    debug(date)
    let dateObject = new Date(date)
    let dateString = dateObject.getDate() + "/" + dateObject.getMonth() +"/"+ dateObject.getFullYear()
    return dateString;
})
