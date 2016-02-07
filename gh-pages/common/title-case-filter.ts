export var titlecase = function(): (text: string) => string {
  return function(text: string): string {
    if (typeof text !== 'string') {
      throw new TypeError(`Expected string ,got ${typeof text}`);
    }
    return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
  };
};
