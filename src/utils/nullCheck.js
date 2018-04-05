module.exports = {
    hasNull: function(target) {
            console.log(target);
        for (var member in target) {
            if (target[member] === null || target[member] === undefined || target[member] === '' )
                return true;
        }
        return false;
    }
};
