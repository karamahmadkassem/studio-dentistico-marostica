export function scrollToElement(id: string, offset = 16): void {
  const el = document.getElementById(id);
  if (!el) return;

  const headerHeight =
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 80;
  const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - offset;

  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}
