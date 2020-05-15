import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '@common/services/prisma.service';
import { ConfigService } from '@nestjs/config';
import { User } from '@common/models/user';
import { OrderStatus, OrderItem, Order } from '@prisma/client';
import { BasketInput } from './dto/basket.input';

type OrderItemWithoutOrderId = Omit<OrderItem, 'id' | 'orderId'>;

interface OrderArgs {
  items: OrderItemWithoutOrderId[];
  total: number;
  userId?: string;
}

interface AddIntentArgs {
  orderId: number;
  chargeId: string;
}

@Injectable()
export class StripeService {
  stripeAPI: Stripe;

  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService
  ) {
    this.stripeAPI = new Stripe(this.configService.get('STRIPE_API_KEY'), {
      apiVersion: '2020-03-02',
    });
  }

  async createPayment(basket: BasketInput, user?: User) {
    // @TODO: Work out how to do quantities in basket input.
    // @TODO: This is an initial pass. Need to think about how to prevent duplicate orders from being generated.
    // @TODO: Think about how we're going to clear up old orders.
    // @TODO: What happens in the scenario where the user goes back, adds additional items to their basket, then checks out again.
    // @TODO: Add an endpoint to wipe the user's basket.

    // Process the user basket as a priority.
    if (user) {
      // Find the user's basket.
      const basket = await this.prisma.cart.findOne({
        where: { userId: user.id },
        include: { CartItems: { include: { product: true } } },
      });

      if (!basket?.CartItems?.length) {
        throw new BadRequestException('No items found in cart for user.');
      }

      // Calculate the total order value.
      const basketTotal = basket?.CartItems.reduce((acc, item) => {
        return item.quantity * item.product.price + acc;
      }, 0);

      // Create the barebones order.
      const order = await this.createOrder({
        items: basket.CartItems.map(
          (i): OrderItemWithoutOrderId => ({
            title: i.product.name,
            image: '', // @TODO: Add image URL to order.
            price: i.product.price,
            quantity: i.quantity,
          })
        ),
        total: basketTotal,
        userId: user.id,
      });

      // Create the payment intent and pass the order ID in as metadata
      // so we can cross-reference it when the payment is confirmed.
      const paymentIntent = await this.createPaymentIntent(
        basketTotal,
        order.id
      );

      return paymentIntent.id;
    }

    // Process the basket items if provided.
    if (!basket?.items?.length) {
      throw new BadRequestException('No items found in basket.');
    }

    // Find the associated products in the DB.
    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: basket.items,
        },
      },
    });

    // Calculate the basket total.
    const basketTotal = products.reduce((total, item) => total + item.price, 0);

    // Create the barebones order.
    const order = await this.createOrder({
      items: products.map<OrderItemWithoutOrderId>((i) => ({
        title: i.name,
        image: '',
        price: i.price,
        quantity: 1,
      })),
      total: basketTotal,
    });

    // Create the payment intent with the order ID attached.
    const paymentIntent = await this.createPaymentIntent(basketTotal, order.id);

    return paymentIntent.id;
  }

  async handleWebhook(event: Stripe.Event) {
    // @TODO: Add Webhook handling logic.
    switch (event.type) {
      case 'payment_intent.payment_failed':
      case 'payment_intent.succeeded':
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

  private async addIntentToOrder({ orderId, chargeId }: AddIntentArgs) {
    return await this.prisma.order.update({
      where: { id: orderId },
      data: {
        chargeId,
      },
    });
  }

  private async createPaymentIntent(amount: number, orderId: number) {
    return await this.stripeAPI.paymentIntents.create({
      amount,
      currency: 'gbp',
      payment_method_types: ['card'], // eslint-disable-line @typescript-eslint/camelcase
      capture_method: 'manual', // eslint-disable-line @typescript-eslint/camelcase
      metadata: {
        orderId,
      },
    });
  }
}
