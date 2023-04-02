import { Controller, Patch, Body, UseGuards } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { UUID } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';

import { InsufficientQuantityException } from '../../../errors';

import { DispatchItemsDto } from '../dto';

@Controller('warehouse/requests/actions')
@UseGuards(PoliciesGuard)
export class SuppliesRequestsActionsController {
  constructor(private prismaService: PrismaService) {}

  @Patch('dispatch-items')
  @CheckPolicies((ability) => ability.can('dispatch-items', 'supplyRequest'))
  async dispatchItems(
    @Body() dispatchItemsDto: DispatchItemsDto
  ): Promise<void> {
    await this.prismaService.$transaction(async (tx) => {
      const request = await tx.supplyRequest.findUniqueOrThrow({
        where: { id: dispatchItemsDto.request },
        include: { items: { include: { supply: true } }, requestedBy: true },
      });

      const targets = request.items.map((item) => {
        const received = dispatchItemsDto.received.reduce<Record<UUID, number>>(
          (prev, target) => {
            const item = request.items.find((item) => item.id === target.item);

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

        await tx.supplyRequestItem.update({
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
                  decrement: target.received,
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

      await tx.supplyRequest.update({
        where: { id: request.id },
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
          type: 'OUTPUT',
          concept: request.description,
          request: { connect: { id: request.id } },
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

export default SuppliesRequestsActionsController;
