export function formatPhone(phone: string, target: 'UI' | 'DB'): string {
  switch (target) {
    case 'UI': {
      let formatted = '';

      for (let index = 0; index < phone.length; index++) {
        switch (index) {
          case 0:
            formatted += '(';
            break;

          case 3:
            formatted += ')';
            formatted += ' ';
            break;

          case 6:
            formatted += '-';
            break;
        }

        formatted += phone[index];
      }

      return formatted;
    }

    case 'DB': {
      let formatted = '';

      formatted = phone.split('-').join('');
      formatted = formatted.split(' ').join('');
      formatted = formatted.split('(').join('');
      formatted = formatted.split(')').join('');

      return formatted;
    }

    default:
      return phone;
  }
}

export default formatPhone;
