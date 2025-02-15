export default (
  fn: (...args: any[]) => any,
  delay = 200,
  immediate = false
) => {
  let timeout: number | undefined;
  return (...args: any[]) => {
    if (immediate && !timeout) fn(...args);
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
