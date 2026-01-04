import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FuelType } from 'src/generated/prisma/enums';

@Injectable()
export class CardsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCards(userId: string) {
    console.log('Fetching all cards');
    try {
      const cards = await this.prisma.card.findMany({
        where: { user_id: userId },
        orderBy: {
          created_at: 'asc', // oldest (first created) first
        },
      });

      console.log('Fetched cards:', cards);
      return cards;
    } catch (error) {
      console.error('Error fetching cards:', error);
      throw error;
    }
    // return this.prisma.card.findMany();
  }

  async createCard(dto: any, userId: string) {
    const cardExists = await this.prisma.card.findFirst({
      where: { card_name: dto.card_name, user_id: userId },
    });

    if (cardExists) {
      throw new ConflictException(
        'Card with this title already exists for this user.',
      );
    }

    return this.prisma.card.create({
      data: { ...dto, user_id: userId },
    });
  }

  async deleteCard(cardId: string, userId: string) {
    const card = await this.prisma.card.findUnique({
      where: { id: cardId, user_id: userId },
    });

    if (!card) {
      throw new ConflictException('Card not found.');
    }

    return this.prisma.card.delete({
      where: { id: cardId },
    });
  }

  async topupCard(cardId: string, userId: string, amount: number) {
    const card = await this.prisma.card.findUnique({
      where: { id: cardId, user_id: userId },
    });

    if (!card) {
      throw new ConflictException('Card not found.');
    }

    const newBalance = card.balance.add(amount);

    await this.prisma.transaction.create({
      data: {
        card_id: cardId,
        amount: amount,
        new_balance: newBalance,
        transaction_type: 'topup',
      },
    });

    return this.prisma.card.update({
      where: { id: cardId },
      data: { balance: newBalance },
    });
  }

  async spendFromCard(
    cardId: string,
    userId: string,
    amount: number,
    fuel_price: number,
    fuel_type: string,
  ) {
    const card = await this.prisma.card.findUnique({
      where: { id: cardId, user_id: userId },
    });

    console.log(fuel_type);
    if (!card) {
      throw new ConflictException('Card not found.');
    }

    if (card.balance.lte(amount)) {
      throw new BadRequestException(
        'Insufficient funds. Please top up your card.',
      );
    }

    const liters = amount / fuel_price;

    const newBalance = card.balance.sub(amount);

    await this.prisma.card.update({
      where: { id: cardId },
      data: { balance: newBalance },
    });

    const transaction = await this.prisma.transaction.create({
      data: {
        card_id: cardId,
        amount: amount,
        liters: liters,
        fuel_price: fuel_price,
        new_balance: newBalance,
        fuel_type: FuelType[fuel_type as keyof typeof FuelType],
        transaction_type: 'spend',
      },
    });

    return transaction;
  }

  async getCardTransactions(cardId: string, userId: string) {
    const card = await this.prisma.card.findUnique({
      where: { id: cardId, user_id: userId },
    });

    if (!card) {
      throw new ConflictException('Card not found.');
    }

    const latestSpendTransaction = await this.prisma.transaction.findFirst({
      where: {
        card_id: cardId,
        transaction_type: 'spend',
      },
      select: {
        fuel_price: true,
      },
      orderBy: {
        transaction_date: 'desc',
      },
    });

    const latestFuelPrice = latestSpendTransaction
      ? latestSpendTransaction.fuel_price
      : null;

    const transactions = await this.prisma.transaction.findMany({
      where: { card_id: cardId },
      orderBy: { created_at: 'desc' },
    });

    // console.log('Fetched transactions for card:', transactions);

    return { latestFuelPrice, transactions, card };
  }

  async getCardSummary(
    cardId: string,
    userId: string,
    startDate: string,
    endDate: string,
  ) {
    const card = await this.prisma.card.findUnique({
      where: { id: cardId, user_id: userId },
    });

    if (!card) {
      throw new ConflictException('Card not found.');
    }

    const result = await this.prisma.transaction.aggregate({
      _sum: {
        amount: true,
        liters: true,
      },
      where: {
        card_id: cardId,
        transaction_type: 'spend',
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalLiters = result._sum.liters || 0;

    const totalSpends = result._sum.amount || 0;

    console.log(totalSpends);
    return {
      cardInfo: card,
      totalSpent: totalSpends,
      totalLiters: totalLiters,
    };
  }
}
