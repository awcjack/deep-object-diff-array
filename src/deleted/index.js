import _ from "lodash"
import { isEmpty, isObject, properObject } from '../utils';

const deletedDiff = (lhs, rhs, simpleArray = true) => {
  if (lhs === rhs || !isObject(lhs) || !isObject(rhs)) return {};

  const l = properObject(lhs);
  const r = properObject(rhs);

  return Object.keys(l).reduce((acc, key) => {
    if (r.hasOwnProperty(key)) {
      if (Array.isArray(l[key]) && Array.isArray(r[key])) {
        const oldFields = _.uniq(_.difference(l[key], r[key]))
        if (oldFields.length === 0) {
          return acc
        }
        if (simpleArray) {
          return { ...acc, [key]: { before: _.uniq(_.difference(l[key], r[key])) } }
        }
        const oldFieldsIndices = _.map(oldFields, o => ({
          content: o,
          indices: []
        }))
        for (let i = 0; i < l[key].length; i++) {
          const index = _.findIndex(oldFields, o => _.isEqual(o, l[key][i]))
          if (index !== -1) {
            oldFieldsIndices[index].indices.push(i)
          }
        }
        return { ...acc, [key]: { before: oldFieldsIndices } }
      }
      const difference = deletedDiff(l[key], r[key], simpleArray);

      if (isObject(difference) && isEmpty(difference)) return acc;

      return { ...acc, [key]: difference };
    }
    if (typeof l[key] === "object" && r[key] === undefined) {
      if (Array.isArray(l[key])) {
        return { ...acc, [key]: { before: l[key] } };
      }
      const difference = deletedDiff(l[key], {});
      if (isObject(difference) && isEmpty(difference)) return acc;

      return { ...acc, [key]: difference };
    }

    return { ...acc, [key]: { before: l[key] ,after: undefined } };
  }, {});
};

export default deletedDiff;
