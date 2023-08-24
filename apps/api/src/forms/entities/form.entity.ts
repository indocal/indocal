import { Exclude } from 'class-transformer';
import { Form, FormStatus, FormVisibility } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class FormEntity implements Entity, Form {
  constructor(form: Form) {
    Object.assign(this, form);
  }

  id: UUID;
  slug: string;
  title: string;
  description: string | null;
  status: FormStatus;
  visibility: FormVisibility;

  @Exclude()
  groupId: UUID;

  createdAt: Date;
  updatedAt: Date;
}

export default FormEntity;
