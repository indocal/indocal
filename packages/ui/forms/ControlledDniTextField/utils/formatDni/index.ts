export function formatDni(dni: string, target: 'UI' | 'DB'): string {
  switch (target) {
    case 'UI': {
      let formatted = '';

      for (let index = 0; index < dni.length; index++) {
        switch (index) {
          case 3:
            formatted += '-';
            break;

          case 10:
            formatted += '-';
            break;
        }

        formatted += dni[index];
      }

      return formatted;
    }

    case 'DB': {
      const formatted = dni.split('-').join('');

      return formatted;
    }

    default:
      return dni;
  }
}

export default formatDni;
