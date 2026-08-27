import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from '../entities/blog-post.entity';
import { CreateBlogPostDto } from '../dto/create-blog-post.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost, 'softwareConnection')
    private readonly blogRepository: Repository<BlogPost>,
  ) {}

  async findAll(
    search?: string,
    series?: string,
    lang?: string,
  ): Promise<BlogPost[]> {
    const qb = this.blogRepository.createQueryBuilder('blog');

    if (lang) {
      qb.andWhere('blog.language = :lang', { lang });
    }

    if (search) {
      qb.andWhere(
        '(blog.title LIKE :search OR blog.excerpt LIKE :search OR blog.tags LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (series) {
      qb.andWhere('blog.series = :series', { series });
    }

    qb.orderBy('blog.createdAt', 'DESC');
    return qb.getMany();
  }

  async findOne(idOrSlug: string, lang?: string): Promise<BlogPost> {
    const isId = !isNaN(Number(idOrSlug));
    let post: BlogPost | null = null;

    if (isId) {
      post = await this.blogRepository.findOne({
        where: { id: Number(idOrSlug) },
      });
    } else {
      if (lang) {
        post = await this.blogRepository.findOne({
          where: { slug: idOrSlug, language: lang },
        });
      }
      if (!post) {
        post = await this.blogRepository.findOne({ where: { slug: idOrSlug } });
      }
    }

    if (!post) {
      throw new NotFoundException(
        `Artículo de blog "${idOrSlug}" no encontrado`,
      );
    }

    post.views += 1;
    await this.blogRepository.save(post);
    return post;
  }

  async create(createBlogPostDto: CreateBlogPostDto): Promise<BlogPost> {
    const post = this.blogRepository.create(createBlogPostDto);
    return this.blogRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    await this.blogRepository.delete(id);
  }
}
