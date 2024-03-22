export function getChurnRate(lines: string[], cancelDate: string[]) {
  let numberOfSubscribers = 1;
  let numberOfCancel = 1;
  lines.forEach((line) => {
    const info = line.split(',');
    const startDate = info[2].split(' ')[0].split('/');
    if (
      info[3] === 'Ativa' &&
      (startDate[2] < cancelDate[2] ||
        (startDate[2] == cancelDate[2] && startDate[0] <= cancelDate[0]))
    ) {
      numberOfSubscribers += 1;
    }
    if (info[3] === 'Cancelada') {
      const cancelDateSubscriber = info[5].split(' ')[0].split('/');
      if (
        cancelDateSubscriber[0] === cancelDate[0] &&
        cancelDateSubscriber[2] === cancelDate[2]
      ) {
        numberOfCancel += 1;
      }
      if (
        cancelDateSubscriber[2] > cancelDate[2] ||
        (cancelDateSubscriber[2] == cancelDate[2] &&
          cancelDateSubscriber[0] >= cancelDate[0])
      ) {
        numberOfSubscribers += 1;
      }
    }
  });
  return numberOfCancel / numberOfSubscribers;
}
