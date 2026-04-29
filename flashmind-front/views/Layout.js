export class Layout {
  static wrap(title, content, showBack = false) {
    return `
      <div class="animate-fade">
        <div class="page-header">
          ${showBack ? `<button class="icon-btn" onclick="window.router.back()">←</button>` : ''}
          <h1>${title}</h1>
        </div>
        <div style="padding: var(--space-md)">
          ${content}
        </div>
      </div>
    `
  }
}
