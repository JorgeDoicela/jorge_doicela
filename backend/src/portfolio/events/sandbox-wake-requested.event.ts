export class SandboxWakeRequestedEvent {
  constructor(
    public readonly name?: string,
    public readonly contact?: string,
    public readonly note?: string,
    public readonly clientIp?: string,
    public readonly createdAt: Date = new Date(),
  ) {}
}
