import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { PrismaService } from 'src/prisma.service';
import { CardsService } from './cards.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [CardsController],
    providers: [PrismaService, CardsService],
    exports: [CardsService],      
})
export class CardsModule {}
