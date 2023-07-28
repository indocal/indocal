import {
  ServiceCertificateData,
  ServiceCertificateTemplatePlaceholder,
} from '@indocal/services';

import { replaceTextColumn, replaceSignatureColumn } from './utils';

export type ReplaceTablePlaceholderParams = {
  key: string;
  data: ServiceCertificateData;
  placeholder: ServiceCertificateTemplatePlaceholder;
};

export function replaceTablePlaceholder({
  key,
  data,
  placeholder,
}: ReplaceTablePlaceholderParams): string {
  const table = data[key];

  const columns = placeholder.config?.columns;

  const replacers = {
    TEXT: replaceTextColumn,
    SIGNATURE: replaceSignatureColumn,
  };

  return Array.isArray(table) && columns
    ? `
        <table>
          <thead>
            <tr>
              ${columns.map((column) => `<th>${column.heading}</th>`).join('')}
            </tr>
          </thead>

          <tbody>
            ${table
              .map((row) => {
                const entries = Object.entries(row);

                const cells = columns.map((column) => {
                  const [, value] =
                    entries.find(([key]) => key === column.name) || [];

                  return {
                    type: column.type,
                    value: value || 'N/A',
                  };
                });

                return `
                        <tr>
                          ${cells
                            .map(
                              (cell) =>
                                `<td>${replacers[cell.type](cell.value)}</td>`
                            )
                            .join('')}
                        </tr>
                      `;
              })
              .join('')}
          </tbody>
        </table>
      `
    : `
        <table>
          <thead>
            <tr>
              <th>N/A</th>
              <th>N/A</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>N/A</td>
              <td>N/A</td>
            </tr>

            <tr>
              <td>N/A</td>
              <td>N/A</td>
            </tr>

            <tr>
              <td>N/A</td>
              <td>N/A</td>
            </tr>
          </tbody>
        </table>
      `;
}

export default replaceTablePlaceholder;
