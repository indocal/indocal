import isObject from '../isObject';

export function isDeepEqual(object: unknown, target: unknown): boolean {
  if (!isObject(object) || !isObject(target)) {
    return Object.is(object, target);
  }

  const objectKeys = Object.keys(object);
  const targetKeys = Object.keys(target);

  if (objectKeys.length !== targetKeys.length) return false;

  for (const key of objectKeys) {
    const objectValueAtKey = (object as Record<string, unknown>)[key];
    const targetValueAtKey = (target as Record<string, unknown>)[key];

    const areObjects = isObject(objectValueAtKey) && isObject(targetValueAtKey);

    if (!areObjects && !Object.is(objectValueAtKey, targetValueAtKey))
      return false;

    if (areObjects && !isDeepEqual(objectValueAtKey, targetValueAtKey))
      return false;
  }

  return true;
}

export default isDeepEqual;
