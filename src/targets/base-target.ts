export abstract class BaseTarget<Fields> {
  private _fields = new Map<string, any>();

  constructor(protected baseScore: number = 0) {}

  public get score() {
    return this.baseScore + this.calculateScore();
  }

  public get<Key extends keyof Fields>(key: Key): Fields[Key] {
    return this._fields.get(key as any) ?? null;
  }

  public set<Key extends keyof Fields>(key: Key, value?: Fields[Key]): Fields[Key] {
    return this._fields.set(key as any, value ?? null).get(key as any);
  }

  public has<Key extends keyof Fields>(key: Key): boolean {
    return this._fields.has(key as any);
  }

  /**
   * Calculate the score of the login target.
   * This can be used to compare LoginTargets by their likelihood of being
   * the correct login form. Higher number is better.
   *
   * @returns The calculated score.
   */
  protected abstract calculateScore(): number;
}
