import INDOCAL from '@indocal/services';

export const indocal = new INDOCAL({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  token: process.env.NEXT_PUBLIC_INDOCAL_API_TOKEN,
});

export default indocal;
