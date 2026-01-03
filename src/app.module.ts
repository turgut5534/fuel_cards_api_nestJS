import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { CardsController } from './cards/cards.controller';
import { CardsService } from './cards/cards.service';
import { CardsModule } from './cards/cards.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [AuthModule, CardsModule,
    ThrottlerModule.forRoot([{
      ttl: 60000, // Time to live in milliseconds (1 minute)
      limit: 10,  // Maximum number of requests within the ttl
    }])
  ],
  controllers: [AppController, AuthController, CardsController],
  providers: [AppService,
    {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },
  ],
})
export class AppModule {}
