import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsUserRolePermissions(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isUserRolePermissions',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(target: any) {
          if (!target || typeof target !== 'object') return false;

          const isValid = Object.keys(target).every((key) => {
            const scope = target[key];

            const isValidRecord =
              typeof scope === 'object' &&
              Object.values(scope).every(
                (action) => typeof action === 'boolean'
              );

            return isValidRecord;
          });

          return isValid;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} should be a valid user role permissions object`;
        },
      },
    });
  };
}

export default IsUserRolePermissions;
