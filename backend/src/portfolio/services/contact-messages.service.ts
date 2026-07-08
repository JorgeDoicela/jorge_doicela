import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage } from '../entities/contact-message.entity';
import { CreateContactMessageDto } from '../dto/create-contact-message.dto';

@Injectable()
export class ContactMessagesService {
  constructor(
    @InjectRepository(ContactMessage, 'portfolioConnection')
    private readonly contactMessageRepository: Repository<ContactMessage>,
  ) {}

  async create(
    createContactMessageDto: CreateContactMessageDto,
  ): Promise<ContactMessage> {
    const contactMessage = this.contactMessageRepository.create(
      createContactMessageDto,
    );
    return this.contactMessageRepository.save(contactMessage);
  }

  async findAll(): Promise<ContactMessage[]> {
    return this.contactMessageRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}
