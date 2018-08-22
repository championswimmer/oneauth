/**
 * Created by championswimmer on 13/03/17.
 */

module.exports = {
    prefixHttp: function (url) {
        if (url.substr(0, 4) !== "http") {
            url = "http://" + url
        }
        return url
    },

    isURL: function (url) {
        const regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/
        return regex.test(url)
    }
}