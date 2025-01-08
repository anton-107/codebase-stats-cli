export function log(arg1: string, arg2: object | string | null) {
  if (arg2 === null) {
    // eslint-disable-next-line no-console
    console.log(arg1);
    return;
  }
  // eslint-disable-next-line no-console
  console.log(arg1, arg2);
}
