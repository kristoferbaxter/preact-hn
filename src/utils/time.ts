const nearest = (count: number, units: string): string => {
  return (count = ~~count), 1 !== count && (units += 's'), count + ' ' + units;
};

export default (time: number): string => {
  const delta: number = Date.now() / 1000 - time;

  if (delta < 3600) {
    return nearest(delta / 60, 'minute');
  }
  if (delta < 86400) {
    return nearest(delta / 3600, 'hour');
  }
  return nearest(delta / 86400, 'day');
};
