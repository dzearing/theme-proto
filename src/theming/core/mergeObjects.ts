export function mergeObjects(a: any, b: any): any {
  const result = { ...a };
  for (const key in b) {
    if (b.hasOwnProperty(key)) {
      const bval = b[key];
      if (typeof bval === 'object'
        && result.hasOwnProperty(key)
        && typeof result[key] === 'object'
      ) {
        result[key] = mergeObjects(result[key], bval);
      } else {
        result[key] = bval;
      }
    }
  }
  return result;
}