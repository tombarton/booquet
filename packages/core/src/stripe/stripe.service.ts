import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '@common/services/prisma.service';
import { ConfigService } from '@nestjs/config';
import { OrderStatus, OrderItem, Order, Product } from '@prisma/client';
import { BasketInput } from './dto/basket.input';

type OrderItemWithoutOrderId = Omit<OrderItem, 'id' | 'orderId'>;

interface OrderArgs {
  items: OrderItemWithoutOrderId[];
  total: number;
  userId?: string;
}

type BasketItem = Product & { quantity: number };

@Injectable()
export class StripeService {
  stripeAPI: Stripe;

  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService
  ) {
    this.stripeAPI = new Stripe(this.configService.get('STRIPE_API_KEY'), {
      apiVersion: '2020-08-27',
    });
  }

  async createPayment({ items }: BasketInput) {
    // @TODO: Everything to do with a user's basket.

    if (!items?.length) {
      throw new BadRequestException('No items found in basket.');
    }

    // Find the associated products in the DB.
    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: items.map(i => i.id),
        },
      },
    });

    // Create an array of basket itens.
    const basketItems = items.reduce<BasketItem[]>((acc, item) => {
      const product = products.find(p => p.id === item.id);

      if (!product) return acc;

      return acc.concat({
        ...product,
        quantity: item.quantity,
      });
    }, []);

    // Calculate the basket total.
    const basketTotal = basketItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Create the barebones order.
    const order = await this.createOrder({
      items: basketItems.map<OrderItemWithoutOrderId>(i => ({
        title: i.title,
        image: '',
        price: i.price,
        quantity: i.quantity,
      })),
      total: basketTotal,
    });

    // Create the payment intent with the order ID attached.
    const paymentIntent = await this.createPaymentIntent(basketTotal, order.id);

    return paymentIntent.client_secret;
  }

  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'payment_intent.payment_failed':
        // TODO: Figure out what we want to do in case of failure.
        break;
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const chargeIds = paymentIntent.charges.data.map(c => c.id);

        await this.prisma.order.update({
          where: { id: parseInt(paymentIntent.metadata.orderId, 10) },
          data: {
            chargeId: chargeIds,
            status: 'AWAITING_CONFIRMATION',
            updatedAt: new Date().toISOString(),
          },
        });
      default:
    }
  }

  private async createOrder({
    items,
    total,
    userId,
  }: OrderArgs): Promise<Order> {
    return await this.prisma.order.create({
      data: {
        items: { create: items },
        total,
        status: OrderStatus.PENDING,
        ...(userId && { user: { connect: { id: userId } } }),
      },
    });
  }

  private async createPaymentIntent(amount: number, orderId: number) {
    return await this.stripeAPI.paymentIntents.create({
      amount,
      currency: 'gbp',
      payment_method_types: ['card'],
      capture_method: 'manual',
      metadata: {
        orderId,
      },
    });
  }
}
