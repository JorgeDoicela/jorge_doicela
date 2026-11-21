import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { DataSource, Repository } from 'typeorm';
import { ForumService } from './forum.service';
import { ForumTopic } from '../entities/forum-topic.entity';
import { ForumReply } from '../entities/forum-reply.entity';
import { ForumPollOption } from '../entities/forum-poll-option.entity';

interface MockManager {
  findOne: jest.Mock;
  find: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
  increment: jest.Mock;
  delete: jest.Mock;
  createQueryBuilder: jest.Mock;
}

describe('ForumService', () => {
  let service: ForumService;
  let mockManager: MockManager;
  let mockDataSource: { transaction: jest.Mock };
  let mockTopicRepo: Partial<Record<keyof Repository<ForumTopic>, jest.Mock>>;
  let mockReplyRepo: Partial<Record<keyof Repository<ForumReply>, jest.Mock>>;
  let mockPollOptionRepo: Partial<
    Record<keyof Repository<ForumPollOption>, jest.Mock>
  >;

  beforeEach(() => {
    mockManager = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn((_entity: unknown, data: Record<string, unknown>) => ({
        ...data,
      })),
      save: jest.fn((entity: Record<string, unknown>) =>
        Promise.resolve({ id: 10, ...entity }),
      ),
      increment: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      createQueryBuilder: jest.fn(),
    };

    mockDataSource = {
      transaction: jest.fn((cb: (m: MockManager) => Promise<unknown>) =>
        cb(mockManager),
      ),
    };

    mockTopicRepo = {
      findOne: jest.fn(),
      increment: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    mockReplyRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      increment: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    mockPollOptionRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    service = new ForumService(
      mockDataSource as unknown as DataSource,
      mockTopicRepo as unknown as Repository<ForumTopic>,
      mockReplyRepo as unknown as Repository<ForumReply>,
      mockPollOptionRepo as unknown as Repository<ForumPollOption>,
    );
  });

  describe('createReply', () => {
    it('creates a reply with hashed deleteToken, omits hash in response, and increments repliesCount', async () => {
      mockManager.findOne.mockResolvedValueOnce({
        id: 1,
        isClosed: false,
      });

      const result = await service.createReply({
        topicId: 1,
        content: '  Respuesta técnica detallada  ',
        author: '  Jorge  ',
      });

      expect(result.id).toBe(10);
      expect(result.content).toBe('Respuesta técnica detallada');
      expect(result.author).toBe('Jorge');
      expect(typeof result.deleteToken).toBe('string');
      expect(result.deleteToken).toHaveLength(48);
      expect('deleteTokenHash' in result).toBe(false);

      const createCalls = mockManager.create.mock.calls as Array<
        [unknown, { deleteTokenHash: string }]
      >;
      const createdArg = createCalls[0][1];
      const expectedHash = createHash('sha256')
        .update(result.deleteToken)
        .digest('hex');
      expect(createdArg.deleteTokenHash).toBe(expectedHash);
      expect(mockManager.increment).toHaveBeenCalledWith(
        ForumTopic,
        { id: 1 },
        'repliesCount',
        1,
      );
    });

    it('rejects creating a reply on a closed topic', async () => {
      mockManager.findOne.mockResolvedValueOnce({ id: 1, isClosed: true });

      await expect(
        service.createReply({ topicId: 1, content: 'Intento en cerrado' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects invalid parentId not belonging to topic', async () => {
      mockManager.findOne
        .mockResolvedValueOnce({ id: 1, isClosed: false })
        .mockResolvedValueOnce(null);

      await expect(
        service.createReply({
          topicId: 1,
          parentId: 999,
          content: 'Respuesta huérfana',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteReply', () => {
    const setupReplySelectQb = (reply: Partial<ForumReply> | null) => {
      const selectQb = {
        addSelect: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(reply),
      };
      const updateQb = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(undefined),
      };
      mockManager.createQueryBuilder
        .mockReturnValueOnce(selectQb)
        .mockReturnValueOnce(updateQb);
      return { selectQb, updateQb };
    };

    it('throws ForbiddenException when deleteToken is missing', async () => {
      await expect(service.deleteReply(10)).rejects.toThrow(ForbiddenException);
      expect(mockDataSource.transaction).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when reply does not exist', async () => {
      setupReplySelectQb(null);
      await expect(service.deleteReply(99, 'some-token')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws BadRequestException when topic is closed', async () => {
      const token = 'valid-token-value';
      const hash = createHash('sha256').update(token).digest('hex');
      setupReplySelectQb({
        id: 10,
        topicId: 1,
        deleteTokenHash: hash,
        topic: { id: 1, isClosed: true } as ForumTopic,
      });

      await expect(service.deleteReply(10, token)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws ForbiddenException for seeded replies without deleteTokenHash', async () => {
      setupReplySelectQb({
        id: 1,
        topicId: 1,
        deleteTokenHash: null,
        topic: { id: 1, isClosed: false } as ForumTopic,
      });

      await expect(service.deleteReply(1, 'forged-token')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('throws ForbiddenException when deleteToken does not match hash', async () => {
      const hash = createHash('sha256').update('real-token').digest('hex');
      setupReplySelectQb({
        id: 10,
        topicId: 1,
        deleteTokenHash: hash,
        topic: { id: 1, isClosed: false } as ForumTopic,
      });

      await expect(service.deleteReply(10, 'wrong-token')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('deletes reply and all nested descendants recursively and decrements repliesCount', async () => {
      const token = 'owner-secret-token';
      const hash = createHash('sha256').update(token).digest('hex');
      const { updateQb } = setupReplySelectQb({
        id: 10,
        topicId: 1,
        deleteTokenHash: hash,
        topic: { id: 1, isClosed: false } as ForumTopic,
      });

      mockManager.find.mockResolvedValueOnce([
        { id: 10, parentId: null },
        { id: 11, parentId: 10 },
        { id: 12, parentId: 11 },
        { id: 13, parentId: null },
      ]);

      const result = await service.deleteReply(10, token);

      expect(result).toEqual({ success: true, deletedCount: 3 });
      expect(mockManager.delete).toHaveBeenCalledWith(ForumReply, [10, 11, 12]);
      expect(updateQb.update).toHaveBeenCalledWith(ForumTopic);
      expect(updateQb.execute).toHaveBeenCalled();
    });
  });

  describe('votePollOption & unvotePollOption', () => {
    it('switches vote atomically when previousOptionId is provided', async () => {
      mockManager.findOne
        .mockResolvedValueOnce({ id: 1, isClosed: false })
        .mockResolvedValueOnce({ id: 2, topicId: 1, votes: 3 });

      const decrementQb = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(undefined),
      };
      mockManager.createQueryBuilder.mockReturnValueOnce(decrementQb);
      mockManager.find.mockResolvedValueOnce([
        { id: 1, topicId: 1, votes: 4, displayOrder: 1 },
        { id: 2, topicId: 1, votes: 4, displayOrder: 2 },
      ]);

      const result = await service.votePollOption(1, 2, 1);

      expect(decrementQb.execute).toHaveBeenCalled();
      expect(mockManager.increment).toHaveBeenCalledWith(
        ForumPollOption,
        { id: 2 },
        'votes',
        1,
      );
      expect(result).toHaveLength(2);
    });

    it('rejects unvotePollOption on closed topic', async () => {
      mockTopicRepo.findOne!.mockResolvedValueOnce({ id: 1, isClosed: true });

      await expect(service.unvotePollOption(1, 2)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
