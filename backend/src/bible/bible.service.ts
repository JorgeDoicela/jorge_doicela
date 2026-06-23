import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Verse } from './entities/verse.entity';

@Injectable()
export class BibleService implements OnModuleInit {
  constructor(
    @InjectRepository(Verse, 'bibleConnection')
    private readonly verseRepository: Repository<Verse>,
  ) {}

  async onModuleInit() {
    const count = await this.verseRepository.count();
    if (count === 0) {
      await this.verseRepository.save([
        {
          book: 'Génesis',
          chapter: 1,
          verseNumber: 1,
          text: 'En el principio creó Dios los cielos y la tierra.',
        },
        {
          book: 'Juan',
          chapter: 3,
          verseNumber: 16,
          text: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
        },
        {
          book: 'Salmos',
          chapter: 23,
          verseNumber: 1,
          text: 'Jehová es mi pastor; nada me faltará.',
        },
      ]);
    }
  }

  async findAll(): Promise<Verse[]> {
    return this.verseRepository.find();
  }

  async findOne(id: number): Promise<Verse | null> {
    return this.verseRepository.findOneBy({ id });
  }

  async findByBook(book: string): Promise<Verse[]> {
    return this.verseRepository.findBy({ book });
  }
}
