const hbs = require('express-hbs')
const debug = require('debug')('oauth:utils:handlebars')
hbs.registerHelper('ifneq', function (options) {
    return (options.hash.expected != options.hash.val) ? options.fn(this) : options.inverse(this)
})
hbs.registerHelper('ifeq', function (options) {
    debug('ifeq ---------- ')
    debug(options.hash)
    return (options.hash.expected == options.hash.val) ? options.fn(this) : options.inverse(this)
})
hbs.registerHelper('formatDate', function (date) {
    debug(date)
    let dateObject = new Date(date)
    let dateString = dateObject.getDate() + "/" + dateObject.getMonth() + "/" + dateObject.getFullYear()
    return dateString
})

hbs.registerHelper('for', function(from, to, incr, block) {
  var accum = '';
  for(var i = from; i <= to; i += incr)
    accum += block.fn(i);
  return accum;
});

hbs.registerHelper('ifCond', function (...args) {
    const options = args.pop()
    return args.some(x => !x) ? options.fn(this): options.inverse(this);
});
