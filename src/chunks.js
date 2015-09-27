function* chunks(start, final, chunk) {
  for (let index = start; index < final; index++) {
    yield {
      index,
      pause: ((index > start) && ((index + 1) % (start + chunk) === 0))
    };
  }
}

export default {
  range: ({start, final, chunk}) => {
    return chunks(start, final, chunk)
  }
}