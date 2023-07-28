export function highlightInternal(internal: string): string {
  const html = `<span
                  style="font-family: Courier-BoldOblique;
                  color: white;
                  background-color: rebeccapurple"
                >${internal}</span>`;

  return html;
}

export default highlightInternal;
