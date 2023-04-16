import INDOCAL from '@indocal/services';

const INDOCAL_API_TOKEN = process.env.INDOCAL_API_TOKEN;
const NEXT_PUBLIC_INDOCAL_API_TOKEN = process.env.NEXT_PUBLIC_INDOCAL_API_TOKEN;

export const indocal = new INDOCAL({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  token: INDOCAL_API_TOKEN || NEXT_PUBLIC_INDOCAL_API_TOKEN,
});

export default indocal;
