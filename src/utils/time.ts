const nearest = (count: number, units: string): string => {
  return `${Math.floor(count)} ${units}${count > 1 ? 's' : ''} ago`;
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
