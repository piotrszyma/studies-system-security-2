export function randomBitString(length: number) {
  return Array.from({ length: length }).map(_ => (~~(Math.random() * 10)) % 2).join('');
}