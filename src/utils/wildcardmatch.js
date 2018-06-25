escapeRegExp = (str) => {
    return str.replace(/[\-\[\]\/\{\}\(\)\:\+\?\.\\\^\$\|]/g, "\\$&");
},
matchURL = (urllist, target) => {
    const exp = "[^\s]+";
    for (let url of urllist) {
        let url2 = escapeRegExp(url);
        url2 = url2.replace('*',exp);
        if (target.match(new RegExp(url2))) {
            return true;
        }
    }
    return false;
}
module.exports = {
    escapeRegExp,
    matchURL
};