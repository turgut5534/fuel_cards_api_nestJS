import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { JwtAuthGuard } from 'src/middlewares/jwt-guard';
import { CreateCardDto } from './dto/create-card.dto';

@UseGuards(JwtAuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private cardService: CardsService) {}

  @Get()
  async getCards(@Req() req) {

    const userId = req.user.sub;
    return this.cardService.getCards(userId);
  }

  @Post()
  async createCard(@Body() dto: CreateCardDto, @Req() req) {
    
    const userId = req.user.sub;

    return this.cardService.createCard(dto, userId);
  }

  @Delete(':id')
  async deleteCard(@Req() req) {
    const userId = req.user.sub;
    return this.cardService.deleteCard(req.params.id, userId);
  }

  @Post(':id/topup')
  async topupCard(@Req() req, @Body() body) {
    const userId = req.user.sub;
    return this.cardService.topupCard(req.params.id, userId, body.amount);
  }

  @Post(':id/spend')
  async spendFromCard(@Req() req, @Body() body) {
    const userId = req.user.sub;
    return this.cardService.spendFromCard(
      req.params.id,
      userId,
      body.amount,
      body.fuel_price,
      body.fuel_type,
    );
  }

  @Get(':id/transactions')
  async getCardTransactions(@Req() req) {
    const userId = req.user.sub;
    return this.cardService.getCardTransactions(req.params.id, userId);
  }

  @Get(':id/summary')
  async getCardSummary(
    @Param('id') id: string,
    @Query() query: any,
    @Req() req,
  ) {
    const userId = req.user.sub;
    return this.cardService.getCardSummary(id, userId, query.start, query.end);
  }
}
