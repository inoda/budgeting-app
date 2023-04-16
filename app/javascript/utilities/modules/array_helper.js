const ArrayHelper = {
  indexBy: (arr, fn) => {
    return arr.reduce((obj, v, i) => {
      obj[fn(v, i, arr)] = v;
      return obj;
    }, {});
  },
};

export default ArrayHelper;
