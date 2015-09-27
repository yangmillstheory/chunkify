function* chunks(chunk, range) {
  for (let index = 0; index < range; index++) {
    yield {
      index,
      pause: (index > 0 && (index + 1) % chunk === 0)
    };
  }
}

export default {
  of: ({chunk, range}) => {
    return chunks(chunk, range)
  }
}