import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ContactMessage } from '../entities/contact-message.entity';
import { CreateContactMessageDto } from '../dto/create-contact-message.dto';
import { ContactMessageCreatedEvent } from '../events/contact-message-created.event';

@Injectable()
export class ContactMessagesService {
  private readonly logger = new Logger(ContactMessagesService.name);

  constructor(
    @InjectRepository(ContactMessage, 'portfolioConnection')
    private readonly contactMessageRepository: Repository<ContactMessage>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    createContactMessageDto: CreateContactMessageDto,
  ): Promise<ContactMessage> {
    const contactMessage = this.contactMessageRepository.create({
      ...createContactMessageDto,
      subject:
        createContactMessageDto.subject?.trim() || 'Consulta de Portafolio',
    });
    const saved = await this.contactMessageRepository.save(contactMessage);

    this.logger.log(
      `Mensaje #${saved.id} de "${saved.name}" persistido en portfolio.sqlite. Emitiendo evento de dominio.`,
    );

    // Emisión desacoplada de evento de dominio
    this.eventEmitter.emit(
      'contact.message.created',
      new ContactMessageCreatedEvent(
        saved.id,
        saved.name,
        saved.email,
        saved.subject,
        saved.message,
        saved.createdAt,
        saved.phone,
        saved.serviceType,
      ),
    );

    return saved;
  }

  async findAll(): Promise<ContactMessage[]> {
    return this.contactMessageRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}
