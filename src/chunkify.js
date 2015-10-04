function* chunkify(start, final, chunk, delay) {
  for (let index = start; index < final; index++) {
    if ((index > start) && (index % (start + chunk) === 0)) {
      yield new Promise(resolve => setTimeout(resolve, delay))
    }
    yield index
  }
}

export default {
  range: ({start, final, chunk, delay}) => {
    return chunkify(start, final, chunk, delay)
  }
}