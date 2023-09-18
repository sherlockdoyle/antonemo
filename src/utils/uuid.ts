let id = 0;
export default function uuid(prefix: string) {
  return `${prefix}:${id++}`;
}
