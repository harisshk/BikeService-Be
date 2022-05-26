const PropTypes = require("prop-types");

/**
 * Group and Count
 * @param {Array} array list of elements to be grouped
 * @param {String} key group by key
 * @returns {Array} 
 */
const groupByAndCount = (array, key) => {
    var result = [];
    array.reduce((res, value) => {
        if (!res[value[key]]) {
            res[value[key]] = { [key]: value[key], qty: 0 };
            result.push(res[value[key]])
        }
        res[value[key]].qty += 1
        return res;
    }, {});
    return result;
};

groupByAndCount.prototype = {
    array: PropTypes.array.isRequired,
    key: PropTypes.string.isRequired
}

module.exports = { 
    groupByAndCount 
}