import { Exclude } from 'class-transformer';
import { Form, FormStatus, FormVisibility } from '@prisma/client';

import { Entity, UUID } from '@/common';

export type FormWebhook = {
  name: string;
  url: string;
};

export type FormConfig = Partial<{
  webhooks: FormWebhook[];
}>;

export class FormEntity implements Entity, Form {
  constructor(form: Form) {
    Object.assign(this, form);
  }

  id: UUID;
  slug: string;
  title: string;
  description: string | null;
  config: FormConfig | null;
  status: FormStatus;
  visibility: FormVisibility;

  @Exclude()
  groupId: string;

  createdAt: Date;
  updatedAt: Date;
}

export default FormEntity;
