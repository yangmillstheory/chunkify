.filter('code', () => {
  const code_by_action = {
    map(chunkified = false) {
      let setup = `
let mapper = (item, index) => {
  return simulateWork(index) + 1
};`;
      if (chunkified) {
        return `
${setup}
return chunkify.map(RANGE, mapper, {chunk, delay})`;
      } else {
        return `
${setup}
return RANGE.map(mapper))`;
      }
    },
    reduce(chunkified = false) {
      let setup = `
let reducer = (memo, item, index) => {
  return memo + simulateWork(index);
};
let memo = 0;`;
      if (chunkified) {
        return `
${setup}
return chunkify.reduce(RANGE, reducer, {memo, chunk, delay})`;
      } else {
        return `
${setup}
return RANGE.reduce(reducer, memo)`;
      }
    },
    each(chunkified = false) {
      let setup = `
let eachFn = (index) => {
  simulateWork(index)
};`;
      if (chunkified) {
        return `
${setup}
return chunkify.each(RANGE, eachFn, {chunk, delay})`;
      } else {
        return `
${setup}
return RANGE.forEach(eachFn)`;
      }
    },
    range(chunkified = false) {
      let setup = `
let loopFn = (index) => {
  simulateWork(index)
};`;
      if (chunkified) {
        return `
${setup}
return chunkify.range(loopFn, RANGE.length, {chunk, delay})`;
      } else {
        return `
${setup}
for (let index = 0; index < RANGE.length; index++) {
  loopFn(index)
}`;
      }
    }
  };
  return state => {
    if (state.selected === null) {
      return `
Hover over an action button on the left sidebar.`;
    } else {
      let {selected, chunkified} = state;
      return `
// action: ${selected}
// chunkified: ${chunkified}
${code_by_action[selected](chunkified)}
`;
    }
  };
})
