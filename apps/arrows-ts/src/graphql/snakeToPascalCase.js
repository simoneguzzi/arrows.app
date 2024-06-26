export default function snakeToPascalCase(relName = '') {
  const prefixedLowerCase = relName.toLowerCase().replace(/[^a-z0-9_]/g, '');
  return prefixedLowerCase
    .split('_')
    .filter((part) => !!part)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');
}
