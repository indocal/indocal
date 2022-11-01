import { Transform } from 'class-transformer';

export function TrimParam(): PropertyDecorator {
  return Transform(({ value }) => {
    return typeof value === 'string' ? value.trim() : value;
  });
}

export default TrimParam;
