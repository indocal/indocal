import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

import {
  isValidServiceCertificateTemplateSectionPlaceholderConfig,
  isValidServiceCertificateTemplateTablePlaceholderConfig,
} from './utils';

export function IsServiceCertificateTemplatePlaceholderConfig(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isServiceCertificateTemplatePlaceholderConfig',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(target: any) {
          if (!target || typeof target !== 'object') return false;

          if ('items' in target) {
            return isValidServiceCertificateTemplateSectionPlaceholderConfig(
              target
            );
          }

          if ('columns' in target) {
            return isValidServiceCertificateTemplateTablePlaceholderConfig(
              target
            );
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid placeholder config`;
        },
      },
    });
  };
}

export default IsServiceCertificateTemplatePlaceholderConfig;
