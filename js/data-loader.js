async function loadSiteData() {
  try {
    const r = await fetch('admin/data.php?action=full&_t=' + Date.now());
    return await r.json();
  } catch(e) {
    console.warn('Failed to load site data:', e);
    return null;
  }
}
