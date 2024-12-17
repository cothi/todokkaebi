export class UpdateUserParam {
  constructor(
    public readonly id: string,
    public readonly email?: string,
    public readonly nickname?: string,
    public readonly birthday?: Date,
  ) {}
}
