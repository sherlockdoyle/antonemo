export class Random {
  #e: number;
  constructor(seed: number = 0) {
    this.#e = seed;
  }

  #t(): number {
    // mulberry32
    this.#e = (this.#e + 0x6d2b79f5) | 0;
    let t = Math.imul(this.#e ^ (this.#e >>> 15), this.#e | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  o(arr: number[]): number {
    for (let i = 1; i < arr.length; ++i) {
      arr[i] += arr[i - 1];
    }
    const rand = this.#t() * arr[arr.length - 1];
    for (let i = 0; i < arr.length; ++i) {
      if (rand < arr[i]) {
        return i;
      }
    }
    return arr.length - 1;
  }
}
