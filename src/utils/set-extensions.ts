/**
 * Check if a set (`a`) is a subset of another set (`b`).
 */
export function isSubset<T>(a: Set<T>, b: Set<T>): boolean {
  return a.size <= b.size && [...a].every(x => b.has(x));
}

/**
 * Return the intersection-over-union (Jaccard index) of two sets.
 */
export function iou<T>(a: Set<T>, b: Set<T>): number {
  let intersection = 0,
    union = a.size;
  for (const c of b)
    if (a.has(c)) ++intersection;
    else ++union;
  return intersection / union;
}

/**
 * Add all items of an iterable to a set.
 */
export function addAll<T>(set: Set<T>, iterable: Iterable<T>): void {
  for (const item of iterable) set.add(item);
}
