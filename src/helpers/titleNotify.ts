export default function titleNotify(notify: string) {
  const originalTitle = document.title;
  let blinkCount = 0;
  const blinkTitle = notify;
  if (originalTitle !== blinkTitle) {
    const intervalId = setInterval(() => {
      document.title = document.title === blinkTitle ? originalTitle : blinkTitle;
      blinkCount++;

      if (blinkCount >= 6) {
        clearInterval(intervalId);
        document.title = originalTitle;
      }
    }, 1000);
  }
}
