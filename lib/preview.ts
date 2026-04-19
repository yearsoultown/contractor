/**
 * Renders a live contract preview by substituting Go template placeholders
 * ({{.FieldName}}) with current form values.
 */
export function renderPreview(htmlBody: string, formData: Record<string, string>): string {
  return htmlBody.replace(/\{\{\.(\w+)\}\}/g, (_, key: string) => {
    const value = formData[key];
    if (value) {
      return `<strong style="color:#0052FF">${value}</strong>`;
    }
    return `<span style="display:inline-block;min-width:72px;height:0.85em;background:#e2e8f0;border-radius:3px;vertical-align:middle"></span>`;
  });
}