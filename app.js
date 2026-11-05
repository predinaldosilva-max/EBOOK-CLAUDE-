(() => {
  "use strict";
  const config = window.CLAUDE_CHECKOUT || {};
  const allowed = { hotmart: ["pay.hotmart.com"], kiwify: ["pay.kiwify.com.br"] };
  let enabled = 0;
  for (const button of document.querySelectorAll("[data-checkout]")) {
    const provider = button.dataset.checkout;
    let url;
    try { url = new URL(config[provider]); } catch { continue; }
    if (!config.salesEnabled || url.protocol !== "https:" || !allowed[provider]?.includes(url.hostname) || url.username || url.password || url.port || url.pathname === "/") continue;
    button.disabled = false;
    enabled++;
    button.addEventListener("click", () => window.location.assign(url.href));
  }
  if (enabled) {
    document.querySelector("#checkout-status").textContent = "Você será direcionado ao pagamento na plataforma escolhida. Confira as condições no checkout oficial.";
  }
  function revealHash() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (target?.tagName === "DETAILS") target.open = true;
  }
  window.addEventListener("hashchange", revealHash);
  revealHash();
})();
