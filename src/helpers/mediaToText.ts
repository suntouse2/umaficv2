export default function mediaTypeToText(type: TMediaTypes) {
  switch (type) {
    case 'voice':
      return 'Голосовое сообщение';
    case 'round':
      return 'Кружочек';
    case 'auto':
      return 'Изображение/Видео';
    case 'document':
      return 'Документ';
  }
}
