import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class NodemailerService {
  transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      service: process.env.NODEMAILER_SERVICE,
      from: process.env.NODEMAILER_FROM,
      auth: {
        user: process.env.NODEMAILER_AUTH_USER,
        pass: process.env.NODEMAILER_AUTH_PASSWORD,
      },
    });
  }
}

export default NodemailerService;
