// Restrição de interface, não autenticação. Sinais do navegador podem ser falsificados.
// A exceção local não identifica o dono: é apenas uma prévia no próprio computador.
(() => {
  "use strict";
  const local = ["localhost", "127.0.0.1", "[::1]", "::1"].includes(location.hostname);
  const ua = navigator.userAgent || "";
  const phoneOrTablet = /Android|iPhone|iPad|iPod|Tablet|Kindle|Silk\//i.test(ua);
  // iPadOS pode se apresentar como macOS quando solicita a versão desktop.
  const ipadDesktopMode = /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1;
  const mobileHint = navigator.userAgentData?.mobile === true;
  document.documentElement.dataset.deviceAccess =
    local || phoneOrTablet || ipadDesktopMode || mobileHint ? "allowed" : "restricted";
})();
