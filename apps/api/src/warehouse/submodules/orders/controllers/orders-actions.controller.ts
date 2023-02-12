import { Controller, Patch, Body, UseGuards } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { UUID } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';

import { ReceiveItemsDto } from '../../../dto';
import { InsufficientQuantityException } from '../../../errors';

@Controller('warehouse/orders/actions')
@UseGuards(PoliciesGuard)
export class OrdersActionsController {
  constructor(private prismaService: PrismaService) {}

  @Patch('receive-items')
  @CheckPolicies((ability) => ability.can('receive-items', 'order'))
  async receiveItems(@Body() receiveItemsDto: ReceiveItemsDto): Promise<void> {
    await this.prismaService.$transaction(async (tx) => {
      const order = await tx.order.findUniqueOrThrow({
        where: { id: receiveItemsDto.order },
        include: { items: { include: { supply: true } }, supplier: true },
      });

      const targets = order.items.map((item) => {
        const received = receiveItemsDto.received.reduce<Record<UUID, number>>(
          (prev, target) => {
            const item = order.items.find((item) => item.id === target.item);

            if (!item) return prev;

            return {
              ...prev,
              [target.item]: target.quantity,
            };
          },
          {}
        );

        const remaining =
          item.quantity -
          item.received.reduce((total, current) => total + current, 0);

        return {
          item,
          supply: item.supply,
          received: received[item.id] ?? 0,
          remaining,
        };
      });

      for await (const target of targets) {
        if (target.received > target.remaining)
          throw new InsufficientQuantityException({
            supply: target.supply.name,
            remaining: target.remaining,
            requested: target.item.quantity,
          });

        const allItemsDelivered = target.remaining - target.received === 0;

        const someItemDelivered =
          target.item.quantity !== target.remaining - target.received;

        await tx.orderItem.update({
          where: { id: target.item.id },
          data: {
            received: { push: target.received },

            deliveryStatus: allItemsDelivered
              ? 'COMPLETED'
              : someItemDelivered
              ? 'PARTIAL'
              : 'PENDING',

            supply: {
              update: {
                quantity: {
                  increment: target.received,
                },
              },
            },
          },
        });
      }

      const allItemsDelivered = targets.every(
        (target) => target.remaining - target.received === 0
      );

      const someItemDelivered = targets.every(
        (target) => target.item.quantity !== target.remaining - target.received
      );

      await tx.order.update({
        where: { id: order.id },
        data: {
          deliveryAt: { push: new Date() },
          status: allItemsDelivered
            ? 'COMPLETED'
            : someItemDelivered
            ? 'PARTIAL'
            : 'PENDING',
        },
      });

      await tx.inventoryMovement.create({
        data: {
          type: 'INPUT',
          order: { connect: { id: order.id } },
          items: {
            createMany: {
              skipDuplicates: true,
              data: targets.map((target) => ({
                quantity: target.received,
                supplyId: target.supply.id,
              })),
            },
          },
        },
      });
    });
  }
}

export default OrdersActionsController;
