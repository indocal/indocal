import Image from 'next/image';

import { logoFull, logoShort } from './assets';
import { LogoVariant } from './types';

export interface LogoProps {
  variant: LogoVariant;
}

export const Logo: React.FC<LogoProps> = ({ variant }) => (
  <Image
    priority
    layout="fill"
    alt="Logo"
    src={variant === 'full' ? logoFull : logoShort}
  />
);

export default Logo;
