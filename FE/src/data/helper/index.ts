export const convertToVietnamTime = (utcDate: string) => {
  const date = new Date(utcDate);
  // Định dạng riêng cho ngày và giờ
  const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
  };

  const formattedDateTime = date.toLocaleString('vi-VN', options);

  const [datePart, timePart] = formattedDateTime.split(' ');
 

  return `${timePart} ${datePart}`.replace(/\//g, '/');
};
export const convertDateInput = (dateString: string) => {
  const [day, month, yearAndTime] = dateString.split('/');
  const [year, time] = yearAndTime.split(' ');
  return `${month}/${day}/${year} ${time}`;
};
