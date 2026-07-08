import { Controller, Post, Get, Body } from '@nestjs/common';
import { ContactMessagesService } from '../services/contact-messages.service';
import { CreateContactMessageDto } from '../dto/create-contact-message.dto';
import { ContactMessage } from '../entities/contact-message.entity';

@Controller('portfolio/contact')
export class ContactController {
  constructor(
    private readonly contactMessagesService: ContactMessagesService,
  ) {}

  @Post()
  async create(
    @Body() createContactMessageDto: CreateContactMessageDto,
  ): Promise<ContactMessage> {
    return this.contactMessagesService.create(createContactMessageDto);
  }

  @Get()
  async findAll(): Promise<ContactMessage[]> {
    return this.contactMessagesService.findAll();
  }
}
