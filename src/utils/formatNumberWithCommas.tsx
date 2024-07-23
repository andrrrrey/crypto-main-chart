export function formatNumberWithCommas(value: number | string): string {
    const numberValue = typeof value === 'number' ? value : Number(value);
    return numberValue.toLocaleString('en-US');
  }