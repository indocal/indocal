export const restorePasswordEmailTemplate = (
  email: string,
  password: string
): string => {
  const logo = '/assets/images/logos/logo--full.png';
  const escapedEmail = `${email.replace(/\./g, '&#8203;.')}`;

  return `
    <html>
      <head>
        <title>Recuperar contraseña</title>

        <style>
          hr {
            margin: 1em;
            border-color: lightgrey;
          }

          .container {
            margin: 2em;
            text-align: center;
          }

          .header {
            display: grid;
            place-content: center;
            place-items: center;
          }

          .logo {
            display: block;
            width: 200px;
            height: auto;
          }

          .warn {
            font-size: larger;
            font-weight: bold;
            color: darkorange;
          }

          .footer {
            padding: 2em;
            font-size: x-small;
            font-weight: bold;
            color: graytext;
          }
        </style>
      </head>

      <body>
        <div class="container">
          <header class="header">
            <strong class="logo">
              <img src=${logo} />
            </strong>
          </header>

          <hr />

          <main>
            <h1>Solicitud de recuperación de contraseña</h1>

            <p class="credentials">
              Su usuario es: <strong>${escapedEmail}</strong>

              <br />

              Su contraseña es: <strong>${password}</strong>
            </p>

            <p class="warn">Si no solicitó este correo electrónico, puede ignorarlo con seguridad.</p>
          </main>

          <hr />

          <footer class="footer">
            <strong>
              © ${new Date().getFullYear()} - Todos los derechos reservados
            </strong>
          </footer>
        </div>
      </body
    </html>
  `;
};

export default restorePasswordEmailTemplate;
