export function generateUUID(): string {
  let now = new Date().getTime();

  if (
    typeof performance !== 'undefined' &&
    typeof performance.now === 'function'
  ) {
    now += performance.now(); //use high-precision timer if available
  }

  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    (char) => {
      const random = (now + Math.random() * 16) % 16 | 0;

      now = Math.floor(now / 16);

      return (char === 'x' ? random : (random & 0x3) | 0x8).toString(16);
    }
  );

  return uuid;
}

export default generateUUID;
