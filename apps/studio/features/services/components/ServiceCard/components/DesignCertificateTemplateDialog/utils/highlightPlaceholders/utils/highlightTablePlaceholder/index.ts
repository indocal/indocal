import { ServiceCertificateTemplatePlaceholder } from '@indocal/services';

export function highlightTablePlaceholder(
  placeholder: ServiceCertificateTemplatePlaceholder
): string {
  const html = `<div
                  style="display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 75px;
                  border: 2px dashed black;
                  font-family: Courier-BoldOblique;
                  background-color: rgba(0, 255, 0, 0.7)"
                >
                  <h3>
                    ${placeholder.title}
                  </h3>

                  <span style="font-size: 10px; color: #333">
                    (Tabla)
                  </span>
                </div>`;

  return html;
}

export default highlightTablePlaceholder;
