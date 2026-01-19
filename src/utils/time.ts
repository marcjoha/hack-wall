export function parseDuration(input: string): number | null {
  const normalized = input.toLowerCase().trim();
  const match = normalized.match(/^(\d+)\s*(h|hour|hours|m|min|mins|minute|minutes|s|sec|secs|second|seconds)?$/);

  if (!match) return null;

  const value = parseInt(match[1]);
  const unit = match[2] || 'm'; // Default to minutes if no unit

  if (unit.startsWith('h')) return value * 60 * 60 * 1000;
  if (unit.startsWith('m')) return value * 60 * 1000;
  if (unit.startsWith('s')) return value * 1000;

  return value * 60 * 1000;
}

export function parseAbsoluteTime(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  const targetDate = new Date();
  targetDate.setHours(h, m, 0, 0);

  // If the time is in the past, assume it's for tomorrow
  if (targetDate.getTime() <= Date.now()) {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  return targetDate.getTime();
}
