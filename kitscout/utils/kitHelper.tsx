export function getKitId(link: string) {
  try {
    const url = new URL(link);
    return url.pathname.replace(/\/$/, "");
  } catch {
    return link;
  }
}