import mjml2html from 'mjml';

import { AuthenticatedUser, ResetPasswordToken } from '../../../types';

export type RestorePasswordEmailTemplateParams = {
  user: AuthenticatedUser;
  reset_token: ResetPasswordToken;
  redirectUrl: string;
};

export const restorePasswordEmailTemplate = ({
  user,
  reset_token,
  redirectUrl,
}: RestorePasswordEmailTemplateParams): string => {
  const url = new URL(redirectUrl);

  url.searchParams.append('reset_token', reset_token.token);

  const output = mjml2html(`
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-text>
              <h1>Restablecer contraseña</h1>
              <p>Hola ${user.name},</p>
              <p>Has solicitado restablecer tu contraseña.</p>
              <p>Para restablecer tu contraseña, haz click en el siguiente enlace:</p>

              <p><a href=${url.toString()}>Restablecer contraseña</a><p>

              <p>Si no has solicitado restablecer tu contraseña, ignora este correo.</p>

              <i>Este enlace expirará en 1 hora.</i>
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `);

  return output.html;
};

export default restorePasswordEmailTemplate;
