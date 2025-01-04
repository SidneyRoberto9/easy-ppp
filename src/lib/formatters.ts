const compactNumberFormatter = new Intl.NumberFormat(undefined, {
  notation: 'compact',
});

const formatCompactNumber = (number: number) => compactNumberFormatter.format(number);

export { formatCompactNumber };
