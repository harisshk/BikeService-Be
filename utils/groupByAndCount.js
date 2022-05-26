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
    return (result)
};

module.exports = { groupByAndCount }