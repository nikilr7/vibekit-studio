/**
 * Format large numbers for display
 * 1000 -> 1k
 * 1200 -> 1.2k
 * 1000000 -> 1m
 */
export function formatViewCount(count: number): string {
  if (count < 1000) {
    return count.toString();
  }

  if (count < 1000000) {
    const thousands = count / 1000;
    return thousands % 1 === 0 ? `${thousands}k` : `${thousands.toFixed(1)}k`;
  }

  const millions = count / 1000000;
  return millions % 1 === 0 ? `${millions}m` : `${millions.toFixed(1)}m`;
}

/**
 * Get view count display with icon
 */
export function getViewCountDisplay(count: number): string {
  return `👁 ${formatViewCount(count)}`;
}
