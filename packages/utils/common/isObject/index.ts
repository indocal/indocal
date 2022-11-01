export function isObject(target: unknown): target is object {
  return target !== null && typeof target === 'object';
}

export default isObject;
