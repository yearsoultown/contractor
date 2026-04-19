export function extractBodyContent(html: string): { head: string; body: string } {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return {
    head: headMatch ? headMatch[1] : '',
    body: bodyMatch ? bodyMatch[1] : html,
  };
}

export function reconstructHTML(head: string, body: string): string {
  return `<!DOCTYPE html><html><head>${head}</head><body>${body}</body></html>`;
}

/**
 * Extracts <style> blocks from a head string and scopes every CSS rule
 * to `scope` (e.g. ".contract-editor-content"), converting "body" selectors
 * to the scope itself. Returns a raw CSS string ready to inject.
 */
export function scopeHeadStyles(head: string, scope: string): string {
  const parts: string[] = [];
  const re = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let m;
  while ((m = re.exec(head)) !== null) {
    // Scope each rule: "selector { ... }" → "<scope> selector { ... }"
    const scoped = m[1].replace(
      /([^{};/@][^{}/]*?)\s*\{([^{}]*)\}/g,
      (_, sel: string, block: string) => {
        const scopedSel = sel
          .split(',')
          .map((s) => {
            const t = s.trim();
            if (!t) return '';
            return t === 'body' ? scope : `${scope} ${t}`;
          })
          .filter(Boolean)
          .join(', ');
        return `${scopedSel} { ${block} }`;
      },
    );
    parts.push(scoped);
  }
  return parts.join('\n');
}