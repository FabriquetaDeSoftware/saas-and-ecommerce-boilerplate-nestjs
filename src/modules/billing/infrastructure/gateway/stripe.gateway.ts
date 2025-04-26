import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { gatewayConstants } from '../../domain/constants/gateway.constant';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ISinglePurchasesRepository } from '../../domain/interfaces/repositories/single_purchases.repository.interface';

@Injectable()
export class StripeGateway {
  @Inject()
  private readonly _eventEmitter: EventEmitter2;

  @Inject('ISinglePurchasesRepository')
  private readonly _singlePurchasesRepository: ISinglePurchasesRepository;

  private readonly _stripe: Stripe;

  constructor() {
    this._stripe = new Stripe(gatewayConstants.stripe_secret_key, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  public async createOneTimePayment(
    priceId: string,
    customerId: string,
    customerEmail: string,
    productId: string,
  ): Promise<{ url: string }> {
    const session = await this._stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        customerId,
        customerEmail,
        productId,
      },
      mode: 'payment',
      success_url: gatewayConstants.success_url,
      cancel_url: gatewayConstants.cancel_url,
    });

    return { url: session.url };
  }

  public async createSubscriptionPayment(
    priceId: string,
    customerId: string,
    customerEmail: string,
    productId: string,
  ): Promise<{ url: string }> {
    const session = await this._stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        customerId,
        customerEmail,
        productId,
      },
      mode: 'subscription',
      success_url: gatewayConstants.success_url,
      cancel_url: gatewayConstants.cancel_url,
    });

    return { url: session.url };
  }

  public async handleWebhookEvent(
    payload: any,
    signature: string,
  ): Promise<void> {
    const event = this._stripe.webhooks.constructEvent(
      payload,
      signature,
      gatewayConstants.stripe_webhook_secret,
    );

    switch (event.type) {
      case 'charge.succeeded':
        console.log('Charge succeeded');
        break;

      case 'payment_intent.succeeded':
        console.log('Payment intent succeeded');
        break;

      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;

        const customerId = session.metadata?.customerId;
        const customerEmail = session.metadata?.customerEmail;
        const productId = session.metadata?.productId;
        const paymentType =
          session.mode === 'subscription' ? 'subscription' : 'single';

        this._eventEmitter.emit('checkout.session.completed.send.email', {
          customerEmail,
          paymentType,
        });

        await this._singlePurchasesRepository.saveSinglePurchaseProductToUser({
          public_user_id: 1,
          public_product_id: 2,
        });
        break;

      case 'payment_intent.created':
        console.log('Payment intent created');
        break;

      case 'charge.updated':
        console.log('Charge updated');
        break;

      case 'payment_method.attached':
        console.log('Payment method attached');
        break;

      case 'customer.created':
        console.log('Customer created');
        break;

      case 'customer.updated':
        console.log('Customer updated');
        break;

      case 'customer.subscription.updated':
        console.log('Customer subscription updated');
        break;

      case 'invoice.finalized':
        console.log('Invoice finalized');
        break;

      case 'invoice.updated':
        console.log('Invoice updated');
        break;

      case 'invoice.paid':
        console.log('Invoice paid');
        break;

      case 'invoice.payment_succeeded':
        console.log('Invoice payment succeeded');
        break;

      case 'customer.subscription.created':
        console.log('Customer subscription created');
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
}
