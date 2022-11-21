import Image from 'next/image';

import { logoFull, logoShort } from './assets';
import { LogoVariant } from './types';

export interface LogoProps {
  variant: LogoVariant;
}

export const Logo: React.FC<LogoProps> = ({ variant }) => (
  <Image
    priority
    alt="Logo INDOCAL"
    src={variant === 'full' ? logoFull : logoShort}
    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
  />
);

export default Logo;
