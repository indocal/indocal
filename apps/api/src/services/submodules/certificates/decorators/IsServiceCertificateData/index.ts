import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsServiceCertificateData(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isServiceCertificateData',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(target: any) {
          if (!target || typeof target !== 'object') return false;

          const isValid = Object.keys(target).every((key) => {
            const value = target[key];

            if (typeof value === 'string') return true;

            if (Array.isArray(value)) {
              return value.every((item) => {
                if (typeof item !== 'object') return false;

                return Object.values(item).every(
                  (value) => typeof value === 'string'
                );
              });
            }

            return false;
          });

          return isValid;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} should be a valid service certificate data object`;
        },
      },
    });
  };
}

export default IsServiceCertificateData;
