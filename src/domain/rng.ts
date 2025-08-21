export class RNG {
  // Return a random decimal number in [0, 1)
  public nextFloat(): number {
    return Math.random();
  }

  // Return a random integer in [0, max)
  public nextInt(max: number): number {
    const value = this.nextFloat() * max;
    return Math.floor(value);
  }

  // Shuffle an array randomly (in-place)
  public shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = this.nextInt(i + 1);
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }
}