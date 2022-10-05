export const emptyMap = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];

export const copyArray = (original) => {
  const copy = original.map((arr) => {
    return arr.slice();
  });
  return copy;
};
