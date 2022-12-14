import { User as DBUserModel } from '@prisma/client';
import mjml2html from 'mjml';

export const restorePasswordEmailTemplate = (user: DBUserModel): string => {
  const logo =
    'http://localhost:5000/static/assets/images/logos/logo--full.png';

  const output = mjml2html(
    `
      <mjml>
        <mj-head>
          <mj-title>Restablecer contraseña: ${user.username}</mj-title>
        </mj-head>

        <mj-body>
          <mj-section>
            <mj-column>
              <mj-image alt="Logo del INDOCAL" src="${logo}" />
            </mj-column>
          </mj-section>

          <mj-section padding-top="0" padding-bottom="0">
            <mj-column>
              <mj-divider border-width="2px" border-color="lightgrey" />

              <mj-text align="center" font-weight="bold" font-size="16px" color="darkorange">
                Si no solicitó este correo electrónico, puede ignorarlo con seguridad.
              </mj-text>

              <mj-divider border-width="2px" border-color="lightgrey" />
            </mj-column>
          </mj-section>

          <mj-section padding="0">
            <mj-column>
              <mj-social icon-size="32px" mode="horizontal">
                <mj-social-element name="web" />
                <mj-social-element name="instagram" />
              </mj-social>

              <mj-text align="center" color="gray">
                © ${new Date().getFullYear()} INDOCAL. Todos los derechos reservados
              </mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
  );

  return output.html;
};

export default restorePasswordEmailTemplate;
