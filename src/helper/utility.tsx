import {Share} from 'react-native';

export const validateEmail = (email: string) => {
  const expression =
    /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

  return expression.test(email);
};

export const getAge = (birthDate: string) =>
  Math.floor(
    (Date.now() - new Date(dateFormat(birthDate)).getTime()) / 3.15576e10,
  );

export const dateFormat = (date: string) => {
  let temp = date?.replace('/', '-')?.replace('/', '-')?.replace('/', '-');
  return temp;
};

export const timeDifference = (start, end) => {
  var diff = Math.abs(new Date(end) - new Date(start));

  var minutes = Math.floor(diff / 1000 / 60);

  return minutes;
};

export const shareToAny = (message: string, url: string) => {
  const shareOptions = {
    message: message,
    url,
  };

  Share.share(shareOptions);
};

export const convertToRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const intervals = [
    {label: 'yr', seconds: 31536000},
    {label: 'mo', seconds: 2592000},
    {label: 'd', seconds: 86400},
    {label: 'hr', seconds: 3600},
    {label: 'min', seconds: 60},
    {label: 's', seconds: 1},
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count}${interval.label}`;
    }
  }
  return 'just now';
};
