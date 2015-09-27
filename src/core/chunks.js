function* chunks(chunk, range) {
  for (let index = 0; index < range; index++) {
    var ok_chunk;
    if (index) {
      ok_chunk = (index + 1) % chunk === 0;
    } else {
      ok_chunk = false;
    }
    yield {index, ok_chunk}
  }
}

export default {
  of: ({chunk, range}) => {
    return chunks(chunk, range)
  }
}