export class ContactMessageCreatedEvent {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly subject: string,
    public readonly message: string,
    public readonly createdAt: Date,
    public readonly phone?: string,
    public readonly serviceType?: string,
  ) {}
}
