import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactMessage } from './entities/contact-message.entity';
import { PortfolioProject } from './entities/portfolio-project.entity';
import { TerminalProfile } from './entities/terminal-profile.entity';
import { PortfolioExperience } from './entities/portfolio-experience.entity';
import { PortfolioProfile } from './entities/portfolio-profile.entity';
import { PortfolioStackItem } from './entities/portfolio-stack-item.entity';
import { PortfolioEngineeringPillar } from './entities/portfolio-engineering-pillar.entity';
import { PortfolioLabChallenge } from './entities/portfolio-lab-challenge.entity';
import { PortfolioService } from './services/portfolio.service';
import { ContactMessagesService } from './services/contact-messages.service';
import { TelegramNotificationService } from './services/telegram-notification.service';
import { TelegramNotificationListener } from './listeners/telegram-notification.listener';
import { ContactThrottleGuard } from './guards/contact-throttle.guard';
import { LabsThrottleGuard } from './guards/labs-throttle.guard';
import { PortfolioGateway } from './gateways/portfolio.gateway';
import { ContactController } from './controllers/contact.controller';
import { PortfolioProjectsController } from './controllers/portfolio-projects.controller';
import { PortfolioExperienceController } from './controllers/portfolio-experience.controller';
import { PortfolioProfileController } from './controllers/portfolio-profile.controller';
import { PortfolioStackController } from './controllers/portfolio-stack.controller';
import { PortfolioEngineeringController } from './controllers/portfolio-engineering.controller';
import { PortfolioLabsController } from './controllers/portfolio-labs.controller';
import { SandboxController } from './controllers/sandbox.controller';
import { PortfolioProjectsService } from './services/portfolio-projects.service';
import { PortfolioExperienceService } from './services/portfolio-experience.service';
import { PortfolioProfileService } from './services/portfolio-profile.service';
import { PortfolioStackService } from './services/portfolio-stack.service';
import { PortfolioEngineeringService } from './services/portfolio-engineering.service';
import { PortfolioLabsService } from './services/portfolio-labs.service';

import { SandboxService } from './services/sandbox.service';
import { SandboxSecurityService } from './services/sandbox-security.service';
import { SandboxGateway } from './gateways/sandbox.gateway';

import { resolveDatabasePath } from '../common/database/database-path.util';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'portfolioConnection',
      type: 'better-sqlite3',
      database: resolveDatabasePath(
        'DATABASE_PORTFOLIO_PATH',
        'portfolio.sqlite',
      ),
      entities: [
        ContactMessage,
        PortfolioProject,
        TerminalProfile,
        PortfolioExperience,
        PortfolioProfile,
        PortfolioStackItem,
        PortfolioEngineeringPillar,
        PortfolioLabChallenge,
      ],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature(
      [
        ContactMessage,
        PortfolioProject,
        TerminalProfile,
        PortfolioExperience,
        PortfolioProfile,
        PortfolioStackItem,
        PortfolioEngineeringPillar,
        PortfolioLabChallenge,
      ],
      'portfolioConnection',
    ),
  ],
  controllers: [
    ContactController,
    PortfolioProjectsController,
    PortfolioExperienceController,
    PortfolioProfileController,
    PortfolioStackController,
    PortfolioEngineeringController,
    PortfolioLabsController,
    SandboxController,
  ],
  providers: [
    PortfolioService,
    ContactMessagesService,
    TelegramNotificationService,
    TelegramNotificationListener,
    ContactThrottleGuard,
    LabsThrottleGuard,
    PortfolioGateway,
    PortfolioProjectsService,
    PortfolioExperienceService,
    PortfolioProfileService,
    PortfolioStackService,
    PortfolioEngineeringService,
    PortfolioLabsService,
    SandboxService,
    SandboxSecurityService,
    SandboxGateway,
  ],
  exports: [
    PortfolioService,
    ContactMessagesService,
    TelegramNotificationService,
    PortfolioProjectsService,
    PortfolioExperienceService,
    PortfolioProfileService,
    PortfolioStackService,
    PortfolioEngineeringService,
    PortfolioLabsService,
    SandboxService,
    SandboxSecurityService,
  ],
})
export class PortfolioModule {}
