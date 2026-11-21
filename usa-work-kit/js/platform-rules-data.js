/* Local, curated catalog. No automatic downloads or user-data transmission. */
(function(root){'use strict';
const LAST_REVIEWED='2026-11-21';
const rules=[
  {
    "id": "ic-account-use",
    "platform": "Instacart",
    "severity": "critical",
    "status": "pending",
    "label": "hypothesis",
    "confidence": "low",
    "version": "platform-rules-v1",
    "lastReviewed": null,
    "source": {
      "name": "Instacart Shopper Application Terms and Conditions",
      "url": "https://www.instacart.com/shoppers-terms",
      "scope": "Instacart shoppers; US; consult applicable agreement",
      "verified": false
    },
    "texts": {
      "pt": "Compartilhamento, contas múltiplas, software externo e manipulação: confirme a regra aplicável e suas consequências.",
      "es": "Compartir cuentas, cuentas múltiples, software externo y manipulación: confirma la regla y sus consecuencias.",
      "en": "Account sharing, multiple accounts, external software and manipulation: confirm the applicable rule and consequences."
    },
    "stage": "not-documented",
    "priorNotice": "not-documented",
    "appealPath": "",
    "match": {
      "answers": [
        "sharedCredentials",
        "multipleAccountsNotice",
        "automation"
      ],
      "eventKinds": []
    },
    "reviewNote": "A combinação e a consequência automática fornecidas precisam de fonte shopper específica; não usar página de consumidores."
  },
  {
    "id": "ic-device-switch",
    "platform": "Instacart",
    "severity": "critical",
    "status": "pending",
    "label": "hypothesis",
    "confidence": "low",
    "version": "platform-rules-v1",
    "lastReviewed": null,
    "source": {
      "name": "Instacart Shopper Application Terms and Conditions",
      "url": "https://www.instacart.com/shoppers-terms",
      "scope": "Instacart shoppers; US; consult applicable agreement",
      "verified": false
    },
    "texts": {
      "pt": "Confirme a orientação de concluir o pedido no aparelho que o aceitou; usar outro aparelho não comprova troca durante o pedido.",
      "es": "Confirma la instrucción de completar el pedido en el dispositivo que lo aceptó; otro dispositivo no demuestra un cambio durante el pedido.",
      "en": "Confirm the guidance to finish on the accepting device; using another device does not prove a mid-order switch."
    },
    "stage": "not-documented",
    "priorNotice": "not-documented",
    "appealPath": "",
    "match": {
      "answers": [
        "thirdPartyDevice"
      ],
      "eventKinds": []
    },
    "reviewNote": "Fonte corporativa localizada mas redirecionou para site europeu; URL específica ainda pendente."
  },
  {
    "id": "ic-identity",
    "platform": "Instacart",
    "severity": "high",
    "status": "pending",
    "label": "hypothesis",
    "confidence": "low",
    "version": "platform-rules-v1",
    "lastReviewed": null,
    "source": {
      "name": "Instacart Shopper Application Terms and Conditions",
      "url": "https://www.instacart.com/shoppers-terms",
      "scope": "Instacart shoppers; US; consult applicable agreement",
      "verified": false
    },
    "texts": {
      "pt": "Confirme os requisitos de identidade e antecedentes. Uma solicitação de selfie não significa falha.",
      "es": "Confirma los requisitos de identidad y antecedentes. Una solicitud de selfie no significa un fallo.",
      "en": "Confirm identity and background requirements. A selfie request does not mean verification failed."
    },
    "stage": "verification",
    "priorNotice": "not-documented",
    "appealPath": "",
    "match": {
      "answers": [
        "identityCheck"
      ],
      "eventKinds": [
        "verification"
      ]
    },
    "reviewNote": "Fonte precisa confirmar processo e alcance; não equiparar pedido de verificação a infração."
  },
  {
    "id": "ic-process",
    "platform": "Instacart",
    "severity": "low",
    "status": "pending",
    "label": "hypothesis",
    "confidence": "low",
    "version": "platform-rules-v1",
    "lastReviewed": null,
    "source": {
      "name": "Instacart Shopper Application Terms and Conditions",
      "url": "https://www.instacart.com/shoppers-terms",
      "scope": "Instacart shoppers; US; consult applicable agreement",
      "verified": false
    },
    "texts": {
      "pt": "Confirme na notificação os avisos e o caminho de contestação; não presumir aviso prévio obrigatório.",
      "es": "Confirma en la notificación los avisos y la vía de apelación; no presupongas un aviso previo obligatorio.",
      "en": "Check the notice for warnings and appeal instructions; do not assume mandatory advance notice."
    },
    "stage": "not-documented",
    "priorNotice": "not-documented",
    "appealPath": "",
    "match": {
      "answers": [
        "warning",
        "securityNotice"
      ],
      "eventKinds": []
    },
    "reviewNote": "Não usar o procedimento Financial Risk de contas de clientes como procedimento universal de shoppers."
  },
  {
    "id": "dd-contract",
    "platform": "DoorDash",
    "severity": "high",
    "status": "verified",
    "label": "official",
    "confidence": "official",
    "version": "platform-rules-v1",
    "lastReviewed": LAST_REVIEWED,
    "source": {
      "name": "DoorDash Dasher Contract Violations FAQs",
      "url": "https://help.doordash.com/en-us/dashers/article/dasher-contract-violations-faqs",
      "scope": "US Dashers; local exceptions may apply",
      "verified": true
    },
    "texts": {
      "pt": "Violações contratuais podem gerar aviso no app e oportunidade de detalhar o caso; repetição ou gravidade podem levar à desativação.",
      "es": "Las infracciones contractuales pueden generar un aviso y permitir detalles; la repetición o gravedad puede llevar a la desactivación.",
      "en": "Contract violations can trigger an app notice and a chance to add details; repeated or severe incidents may lead to deactivation."
    },
    "stage": "app-notice",
    "priorNotice": "yes",
    "appealPath": "",
    "match": {
      "answers": [
        "warning",
        "complaint",
        "cancellation"
      ],
      "eventKinds": [
        "violation",
        "warning"
      ]
    },
    "reviewNote": "Inclui entrega não concluída, loja declarada fechada indevidamente, Red Card e cancelamento induzido. Não é garantia para casos graves."
  },
  {
    "id": "dd-severe",
    "platform": "DoorDash",
    "severity": "critical",
    "status": "pending",
    "label": "hypothesis",
    "confidence": "low",
    "version": "platform-rules-v1",
    "lastReviewed": null,
    "source": {
      "name": "DoorDash Dasher Contract Violations FAQs",
      "url": "https://help.doordash.com/en-us/dashers/article/dasher-contract-violations-faqs",
      "scope": "US Dashers; local exceptions may apply",
      "verified": false
    },
    "texts": {
      "pt": "Violência, assédio, direção insegura, álcool/drogas e discriminação: confirmar consequências e eventual ação imediata.",
      "es": "Violencia, acoso, conducción insegura, alcohol/drogas y discriminación: confirma consecuencias y posible acción inmediata.",
      "en": "Violence, harassment, unsafe driving, alcohol/drugs and discrimination: verify consequences and possible immediate action."
    },
    "stage": "not-documented",
    "priorNotice": "not-documented",
    "appealPath": "",
    "match": {
      "answers": [],
      "eventKinds": []
    },
    "reviewNote": "Fonte da política de acesso de Dashers precisa ser confirmada, não DashForce."
  },
  {
    "id": "dd-fraud",
    "platform": "DoorDash",
    "severity": "critical",
    "status": "pending",
    "label": "hypothesis",
    "confidence": "low",
    "version": "platform-rules-v1",
    "lastReviewed": null,
    "source": {
      "name": "DoorDash Dasher Contract Violations FAQs",
      "url": "https://help.doordash.com/en-us/dashers/article/dasher-contract-violations-faqs",
      "scope": "US Dashers; local exceptions may apply",
      "verified": false
    },
    "texts": {
      "pt": "Fraude, manipulação de GPS, informações falsas e contas múltiplas: confirmar consequências específicas.",
      "es": "Fraude, manipulación GPS, información falsa y cuentas múltiples: confirma las consecuencias específicas.",
      "en": "Fraud, GPS manipulation, false information and multiple accounts: confirm the specific consequences."
    },
    "stage": "not-documented",
    "priorNotice": "not-documented",
    "appealPath": "",
    "match": {
      "answers": [
        "fakeGPS",
        "multipleAccountsNotice"
      ],
      "eventKinds": []
    },
    "reviewNote": "Não afirmar banimento sumário universal sem a política correspondente."
  },
  {
    "id": "dd-automation",
    "platform": "DoorDash",
    "severity": "high",
    "status": "pending",
    "label": "hypothesis",
    "confidence": "low",
    "version": "platform-rules-v1",
    "lastReviewed": null,
    "source": {
      "name": "DoorDash Dasher Contract Violations FAQs",
      "url": "https://help.doordash.com/en-us/dashers/article/dasher-contract-violations-faqs",
      "scope": "US Dashers; local exceptions may apply",
      "verified": false
    },
    "texts": {
      "pt": "Confirme as proibições de scrapers e robôs; interrompa usos incompatíveis com as regras.",
      "es": "Confirma las prohibiciones de scrapers y bots; interrumpe usos incompatibles con las reglas.",
      "en": "Confirm scraper and robot restrictions; stop uses incompatible with platform rules."
    },
    "stage": "not-documented",
    "priorNotice": "not-documented",
    "appealPath": "",
    "match": {
      "answers": [
        "automation",
        "autoAccept"
      ],
      "eventKinds": []
    },
    "reviewNote": "Não aplicar termos de consumidores da Austrália a Dashers dos EUA."
  },
  {
    "id": "dd-metrics",
    "platform": "DoorDash",
    "severity": "medium",
    "status": "pending",
    "label": "hypothesis",
    "confidence": "low",
    "version": "platform-rules-v1",
    "lastReviewed": null,
    "source": {
      "name": "DoorDash Dasher Contract Violations FAQs",
      "url": "https://help.doordash.com/en-us/dashers/article/dasher-contract-violations-faqs",
      "scope": "US Dashers; local exceptions may apply",
      "verified": false
    },
    "texts": {
      "pt": "Confirme os mínimos de avaliação e conclusão e os avisos aplicáveis ao seu mercado.",
      "es": "Confirma los mínimos de valoración y finalización y los avisos aplicables a tu mercado.",
      "en": "Confirm rating/completion minimums and notices applicable to your market."
    },
    "stage": "not-documented",
    "priorNotice": "not-documented",
    "appealPath": "",
    "match": {
      "answers": [
        "warning"
      ],
      "eventKinds": []
    },
    "reviewNote": "Sem cadastrar limite numérico ou promessa de e-mail prévio."
  },
  {
    "id": "dd-appeal",
    "platform": "DoorDash",
    "severity": "low",
    "status": "verified",
    "label": "official",
    "confidence": "official",
    "version": "platform-rules-v1",
    "lastReviewed": LAST_REVIEWED,
    "source": {
      "name": "DoorDash Dasher Contract Violations FAQs",
      "url": "https://help.doordash.com/en-us/dashers/article/dasher-contract-violations-faqs",
      "scope": "US Dashers; local exceptions may apply",
      "verified": true
    },
    "texts": {
      "pt": "Siga o link do e-mail de desativação ou o botão Start appeal no app, quando disponibilizado.",
      "es": "Sigue el enlace del correo de desactivación o el botón Start appeal de la app, cuando esté disponible.",
      "en": "Follow the deactivation email link or the in-app Start appeal button, when available."
    },
    "stage": "appeal",
    "priorNotice": "not-documented",
    "appealPath": "email-link-or-in-app-start-appeal",
    "match": {
      "answers": [],
      "eventKinds": []
    },
    "reviewNote": "Correção da exclusividade do e-mail no texto fornecido; suporte comum não substitui o canal de recurso."
  },
  {
    "id": "dd-count-unknown",
    "platform": "DoorDash",
    "severity": "low",
    "status": "pending",
    "label": "hypothesis",
    "confidence": "low",
    "version": "platform-rules-v1",
    "lastReviewed": null,
    "source": {
      "name": "DoorDash Dasher Contract Violations FAQs",
      "url": "https://help.doordash.com/en-us/dashers/article/dasher-contract-violations-faqs",
      "scope": "US Dashers; local exceptions may apply",
      "verified": false
    },
    "texts": {
      "pt": "Não há número de violações confirmado nesta base para prever desativação da DoorDash; não aplicar a regra da Grubhub.",
      "es": "Esta base no confirma un número de infracciones para predecir desactivación en DoorDash; no apliques la regla de Grubhub.",
      "en": "This catalog does not confirm a DoorDash violation threshold; do not apply Grubhub’s rule."
    },
    "stage": "not-documented",
    "priorNotice": "not-documented",
    "appealPath": "",
    "match": {
      "answers": [
        "warning"
      ],
      "eventKinds": [
        "violation"
      ]
    },
    "reviewNote": "Hipótese de baixa confiança; sem contador, limite ou etapas inferidas."
  },
  {
    "id": "ub-sharing",
    "platform": "Uber Eats",
    "severity": "critical",
    "status": "verified",
    "label": "official",
    "confidence": "official",
    "version": "platform-rules-v1",
    "lastReviewed": LAST_REVIEWED,
    "source": {
      "name": "Uber US — Deactivations: Losing Account Access",
      "url": "https://www.uber.com/us/en/drive/driver-app/deactivation-review/",
      "scope": "US drivers and delivery people; eligibility and local exceptions differ",
      "verified": true
    },
    "texts": {
      "pt": "Nos EUA, compartilhar a conta e usar documentos falsos são práticas proibidas.",
      "es": "En EE. UU., compartir cuentas y usar documentos falsos son prácticas prohibidas.",
      "en": "In the US, account sharing and false documents are prohibited."
    },
    "stage": "not-documented",
    "priorNotice": "not-documented",
    "appealPath": "",
    "match": {
      "answers": [
        "sharedCredentials",
        "multipleAccountsNotice"
      ],
      "eventKinds": []
    },
    "reviewNote": ""
  },
  {
    "id": "ub-identity",
    "platform": "Uber Eats",
    "severity": "high",
    "status": "verified",
    "label": "official",
    "confidence": "official",
    "version": "platform-rules-v1",
    "lastReviewed": LAST_REVIEWED,
    "source": {
      "name": "Uber US — Deactivations: Losing Account Access",
      "url": "https://www.uber.com/us/en/drive/driver-app/deactivation-review/",
      "scope": "US drivers and delivery people; eligibility and local exceptions differ",
      "verified": true
    },
    "texts": {
      "pt": "Há verificações de identidade e antecedentes; falhas podem retirar acesso. Antecedentes têm processo de elegibilidade específico.",
      "es": "Hay controles de identidad y antecedentes; los fallos pueden quitar acceso. Los antecedentes tienen un proceso específico de elegibilidad.",
      "en": "Identity/background checks can affect access; background failures have a separate eligibility process."
    },
    "stage": "verification",
    "priorNotice": "not-documented",
    "appealPath": "",
    "match": {
      "answers": [
        "identityCheck"
      ],
      "eventKinds": [
        "verification"
      ]
    },
    "reviewNote": "Pedido de verificação não é falha. Não prometer Review Center para todo caso de antecedentes."
  },
  {
    "id": "ub-manipulation",
    "platform": "Uber Eats",
    "severity": "critical",
    "status": "verified",
    "label": "official",
    "confidence": "official",
    "version": "platform-rules-v1",
    "lastReviewed": LAST_REVIEWED,
    "source": {
      "name": "Uber US — Deactivations: Losing Account Access",
      "url": "https://www.uber.com/us/en/drive/driver-app/deactivation-review/",
      "scope": "US drivers and delivery people; eligibility and local exceptions differ",
      "verified": true
    },
    "texts": {
      "pt": "Dispositivos, apps ou programas não autorizados que manipulem a plataforma ou o GPS podem causar perda de acesso.",
      "es": "Dispositivos, apps o programas no autorizados que manipulen la plataforma o GPS pueden causar pérdida de acceso.",
      "en": "Unauthorized devices, apps or programs manipulating the platform or GPS may lead to loss of access."
    },
    "stage": "not-documented",
    "priorNotice": "not-documented",
    "appealPath": "",
    "match": {
      "answers": [
        "fakeGPS",
        "automation",
        "autoAccept"
      ],
      "eventKinds": []
    },
    "reviewNote": ""
  },
  {
    "id": "ub-delivery-fraud",
    "platform": "Uber Eats",
    "severity": "high",
    "status": "verified",
    "label": "official",
    "confidence": "official",
    "version": "platform-rules-v1",
    "lastReviewed": LAST_REVIEWED,
    "source": {
      "name": "Uber US — Deactivations: Losing Account Access",
      "url": "https://www.uber.com/us/en/drive/driver-app/deactivation-review/",
      "scope": "US drivers and delivery people; eligibility and local exceptions differ",
      "verified": true
    },
    "texts": {
      "pt": "Declarar entrega sem realizá-la, reter comida e prolongar tempo intencionalmente são situações de possível fraude.",
      "es": "Declarar entregas no realizadas, retener comida y prolongar el tiempo intencionalmente son posibles fraudes.",
      "en": "Undelivered completed orders, retained food and intentional time inflation are potential fraud situations."
    },
    "stage": "not-documented",
    "priorNotice": "not-documented",
    "appealPath": "",
    "match": {
      "answers": [],
      "eventKinds": []
    },
    "reviewNote": "Não deduzir fraude de atrasos ou problemas técnicos relatados pelo usuário."
  },
  {
    "id": "ub-other",
    "platform": "Uber Eats",
    "severity": "high",
    "status": "pending",
    "label": "hypothesis",
    "confidence": "low",
    "version": "platform-rules-v1",
    "lastReviewed": null,
    "source": {
      "name": "Uber US — Deactivations: Losing Account Access",
      "url": "https://www.uber.com/us/en/drive/driver-app/deactivation-review/",
      "scope": "US drivers and delivery people; eligibility and local exceptions differ",
      "verified": false
    },
    "texts": {
      "pt": "Confirme regras de promoções, taxas, seguro, discriminação e avaliação; não há limite único nesta base.",
      "es": "Confirma reglas de promociones, cargos, seguro, discriminación y valoración; esta base no fija un límite único.",
      "en": "Check promotion, fee, insurance, discrimination and rating rules; this catalog sets no universal limit."
    },
    "stage": "not-documented",
    "priorNotice": "not-documented",
    "appealPath": "",
    "match": {
      "answers": [
        "warning"
      ],
      "eventKinds": []
    },
    "reviewNote": "Regra composta fornecida inclui fraude de seguro ainda não confirmada nesta revisão."
  },
  {
    "id": "ub-process",
    "platform": "Uber Eats",
    "severity": "medium",
    "status": "verified",
    "label": "official",
    "confidence": "official",
    "version": "platform-rules-v1",
    "lastReviewed": LAST_REVIEWED,
    "source": {
      "name": "Uber US — Deactivations: Losing Account Access",
      "url": "https://www.uber.com/us/en/drive/driver-app/deactivation-review/",
      "scope": "US drivers and delivery people; eligibility and local exceptions differ",
      "verified": true
    },
    "texts": {
      "pt": "A Uber informa risco de perda de acesso quando possível; pode agir sem aviso por segurança ou lei. A revisão no app tem exceções.",
      "es": "Uber informa del riesgo cuando es posible; puede actuar sin aviso por seguridad o ley. La revisión en la app tiene excepciones.",
      "en": "Uber gives advance notice when possible; safety/legal cases may have none. In-app review has exceptions."
    },
    "stage": "appeal",
    "priorNotice": "not-documented",
    "appealPath": "in-app-review-center-where-eligible",
    "match": {
      "answers": [
        "warning",
        "securityNotice"
      ],
      "eventKinds": []
    },
    "reviewNote": "Não há garantia de aviso em todos os casos; antecedentes podem ser perda de elegibilidade."
  },
  {
    "id": "ub-bot-timing",
    "platform": "Uber Eats",
    "severity": "low",
    "status": "pending",
    "label": "hypothesis",
    "confidence": "low",
    "version": "platform-rules-v1",
    "lastReviewed": null,
    "source": {
      "name": "Uber US — Deactivations: Losing Account Access",
      "url": "https://www.uber.com/us/en/drive/driver-app/deactivation-review/",
      "scope": "US drivers and delivery people; eligibility and local exceptions differ",
      "verified": false
    },
    "texts": {
      "pt": "O prazo e o processo exato de punição de bots de aceite não estão confirmados nesta base; não use automação incompatível.",
      "es": "Esta base no confirma el plazo ni proceso exacto de sanción de bots de aceptación; evita automatización incompatible.",
      "en": "This catalog does not confirm auto-accept bot enforcement timing; stop incompatible automation."
    },
    "stage": "not-documented",
    "priorNotice": "not-documented",
    "appealPath": "",
    "match": {
      "answers": [
        "autoAccept"
      ],
      "eventKinds": []
    },
    "reviewNote": "Hipótese de baixa confiança. Sem prazo ou nível seguro de uso."
  },
  {
    "id": "gh-violations",
    "platform": "Grubhub",
    "severity": "high",
    "status": "verified",
    "label": "official",
    "confidence": "official",
    "version": "platform-rules-v1",
    "lastReviewed": LAST_REVIEWED,
    "source": {
      "name": "Grubhub Delivery Partner Deactivation Policy",
      "url": "https://driver-support.grubhub.com/hc/en-us/articles/31896441462548-Delivery-Partner-Deactivation-Policy",
      "scope": "US delivery partners; local exceptions may apply",
      "verified": true
    },
    "texts": {
      "pt": "Violações geram aviso no app e e-mail. A política prevê expiração em 90 dias; condições da conta e regras locais importam.",
      "es": "Las infracciones generan avisos en la app y correo. La política prevé expiración en 90 días; importan el estado de cuenta y reglas locales.",
      "en": "Violations trigger app/email notices. Policy provides 90-day expiry; account status and local rules matter."
    },
    "stage": "app-notice",
    "priorNotice": "yes",
    "appealPath": "",
    "match": {
      "answers": [
        "warning"
      ],
      "eventKinds": [
        "violation"
      ]
    },
    "reviewNote": ""
  },
  {
    "id": "gh-rolling-90",
    "platform": "Grubhub",
    "severity": "critical",
    "status": "verified",
    "label": "official",
    "confidence": "official",
    "version": "platform-rules-v1",
    "lastReviewed": LAST_REVIEWED,
    "source": {
      "name": "Grubhub Delivery Partner Deactivation Policy",
      "url": "https://driver-support.grubhub.com/hc/en-us/articles/31896441462548-Delivery-Partner-Deactivation-Policy",
      "scope": "US delivery partners; local exceptions may apply",
      "verified": true
    },
    "texts": {
      "pt": "A política prevê perda de acesso com 3 violações em 90 dias; a ajuda também descreve pausa/bloqueio. Confira sua notificação.",
      "es": "La política prevé perder acceso con 3 infracciones en 90 días; la ayuda también describe pausa/bloqueo. Consulta tu notificación.",
      "en": "Policy provides access loss with 3 violations in 90 days; help also describes pause/blocking. Check your notice."
    },
    "stage": "accumulation",
    "priorNotice": "yes",
    "appealPath": "",
    "match": {
      "answers": [],
      "eventKinds": [
        "violation"
      ]
    },
    "period": {
      "days": 90,
      "threshold": 3,
      "kind": "violation"
    },
    "reviewNote": "Contagem é dos registros declarados, não leitura da conta. Não inferir desativação definitiva, nem aplicar à DoorDash."
  },
  {
    "id": "gh-severe",
    "platform": "Grubhub",
    "severity": "critical",
    "status": "verified",
    "label": "official",
    "confidence": "official",
    "version": "platform-rules-v1",
    "lastReviewed": LAST_REVIEWED,
    "source": {
      "name": "Grubhub Delivery Partner Deactivation Policy",
      "url": "https://driver-support.grubhub.com/hc/en-us/articles/31896441462548-Delivery-Partner-Deactivation-Policy",
      "scope": "US delivery partners; local exceptions may apply",
      "verified": true
    },
    "texts": {
      "pt": "Condutas graves, como agressão ou roubo, podem causar desativação imediata sem aguardar acúmulo de violações.",
      "es": "Conductas graves como agresión o robo pueden causar desactivación inmediata sin esperar infracciones acumuladas.",
      "en": "Severe conduct such as assault or theft may trigger immediate deactivation without waiting for accumulated violations."
    },
    "stage": "possible-immediate",
    "priorNotice": "not-documented",
    "appealPath": "",
    "match": {
      "answers": [],
      "eventKinds": []
    },
    "reviewNote": ""
  },
  {
    "id": "gh-identity",
    "platform": "Grubhub",
    "severity": "critical",
    "status": "verified",
    "label": "official",
    "confidence": "official",
    "version": "platform-rules-v1",
    "lastReviewed": LAST_REVIEWED,
    "source": {
      "name": "Grubhub Delivery Partner Deactivation Policy",
      "url": "https://driver-support.grubhub.com/hc/en-us/articles/31896441462548-Delivery-Partner-Deactivation-Policy",
      "scope": "US delivery partners; local exceptions may apply",
      "verified": true
    },
    "texts": {
      "pt": "Fraude de identidade, contas duplicadas, compartilhamento e resultados de antecedentes podem levar à perda de acesso.",
      "es": "Fraude de identidad, cuentas duplicadas, compartir cuentas y resultados de antecedentes pueden causar pérdida de acceso.",
      "en": "Identity fraud, duplicate/shared accounts and background results may cause loss of access."
    },
    "stage": "not-documented",
    "priorNotice": "not-documented",
    "appealPath": "",
    "match": {
      "answers": [
        "sharedCredentials",
        "multipleAccountsNotice"
      ],
      "eventKinds": []
    },
    "reviewNote": "Não afirmar ação imediata universal para todos os resultados de antecedentes."
  },
  {
    "id": "gh-location",
    "platform": "Grubhub",
    "severity": "high",
    "status": "verified",
    "label": "official",
    "confidence": "official",
    "version": "platform-rules-v1",
    "lastReviewed": LAST_REVIEWED,
    "source": {
      "name": "Grubhub Delivery Partner Deactivation Policy",
      "url": "https://driver-support.grubhub.com/hc/en-us/articles/31896441462548-Delivery-Partner-Deactivation-Policy",
      "scope": "US delivery partners; local exceptions may apply",
      "verified": true
    },
    "texts": {
      "pt": "Mascarar ou falsificar a localização enquanto disponível no app pode gerar violação de conta.",
      "es": "Ocultar o falsificar la ubicación mientras estás disponible en la app puede generar una infracción.",
      "en": "Masking or falsifying location while available in the app can lead to an account violation."
    },
    "stage": "not-documented",
    "priorNotice": "not-documented",
    "appealPath": "",
    "match": {
      "answers": [
        "fakeGPS"
      ],
      "eventKinds": []
    },
    "reviewNote": ""
  },
  {
    "id": "gh-rating",
    "platform": "Grubhub",
    "severity": "medium",
    "status": "verified",
    "label": "official",
    "confidence": "official",
    "version": "platform-rules-v1",
    "lastReviewed": LAST_REVIEWED,
    "source": {
      "name": "Grubhub Delivery Partner Deactivation Policy",
      "url": "https://driver-support.grubhub.com/hc/en-us/articles/31896441462548-Delivery-Partner-Deactivation-Policy",
      "scope": "US delivery partners; local exceptions may apply",
      "verified": true
    },
    "texts": {
      "pt": "Avaliação abaixo do mínimo do mercado pode gerar aviso e revisão/desativação sem melhora; não há mínimo único nesta base.",
      "es": "Valoración inferior al mínimo local puede generar aviso y revisión/desactivación sin mejora; esta base no fija un mínimo universal.",
      "en": "Below-market-minimum ratings can trigger notice and review/deactivation without improvement; no universal minimum is set here."
    },
    "stage": "notice-review",
    "priorNotice": "yes",
    "appealPath": "",
    "match": {
      "answers": [
        "warning"
      ],
      "eventKinds": []
    },
    "reviewNote": ""
  },
  {
    "id": "gh-appeal",
    "platform": "Grubhub",
    "severity": "low",
    "status": "verified",
    "label": "official",
    "confidence": "official",
    "version": "platform-rules-v1",
    "lastReviewed": LAST_REVIEWED,
    "source": {
      "name": "Grubhub Delivery Partner Deactivation Challenge Procedure",
      "url": "https://driver-support.grubhub.com/hc/en-us/articles/33198547098644-Delivery-Partner-Deactivation-Challenge-Procedure",
      "scope": "US delivery partners; follow market-specific notice",
      "verified": true
    },
    "texts": {
      "pt": "Use o formulário de contestação ou responda ao e-mail da suspensão/desativação; siga instruções e prazos do seu mercado.",
      "es": "Usa el formulario de apelación o responde al correo de suspensión/desactivación; sigue instrucciones y plazos locales.",
      "en": "Use the appeal form or reply to the suspension/deactivation email; follow market-specific instructions and deadlines."
    },
    "stage": "appeal",
    "priorNotice": "not-documented",
    "appealPath": "official-form-or-email-reply",
    "match": {
      "answers": [],
      "eventKinds": []
    },
    "reviewNote": ""
  },
  {
    "id": "general-autoaccept",
    "platform": "general",
    "severity": "high",
    "status": "pending",
    "label": "hypothesis",
    "confidence": "low",
    "version": "platform-rules-v1",
    "lastReviewed": null,
    "source": {
      "name": "Orientação fornecida pelo responsável; confirmar políticas de cada plataforma",
      "url": "",
      "scope": "General guidance; not an official cross-platform policy",
      "verified": false
    },
    "texts": {
      "pt": "Confirme a regra da plataforma e interrompa aceite automático não autorizado.",
      "es": "Confirma la regla de la plataforma y detén la aceptación automática no autorizada.",
      "en": "Check platform rules and stop unauthorized automatic acceptance."
    },
    "stage": "not-documented",
    "priorNotice": "not-documented",
    "appealPath": "",
    "match": {
      "answers": [
        "autoAccept"
      ],
      "eventKinds": []
    },
    "reviewNote": "Orientação geral; não é política oficial universal de todas as plataformas."
  },
  {
    "id": "general-location",
    "platform": "general",
    "severity": "critical",
    "status": "pending",
    "label": "hypothesis",
    "confidence": "low",
    "version": "platform-rules-v1",
    "lastReviewed": null,
    "source": {
      "name": "Orientação fornecida pelo responsável; confirmar políticas de cada plataforma",
      "url": "",
      "scope": "General guidance; not an official cross-platform policy",
      "verified": false
    },
    "texts": {
      "pt": "Não falsifique localização; confirme a política específica da plataforma.",
      "es": "No falsifiques la ubicación; confirma la política de tu plataforma.",
      "en": "Do not falsify location; check the specific platform policy."
    },
    "stage": "not-documented",
    "priorNotice": "not-documented",
    "appealPath": "",
    "match": {
      "answers": [
        "fakeGPS"
      ],
      "eventKinds": []
    },
    "reviewNote": "Orientação geral; não é política oficial universal de todas as plataformas."
  },
  {
    "id": "general-credentials",
    "platform": "general",
    "severity": "critical",
    "status": "pending",
    "label": "hypothesis",
    "confidence": "low",
    "version": "platform-rules-v1",
    "lastReviewed": null,
    "source": {
      "name": "Orientação fornecida pelo responsável; confirmar políticas de cada plataforma",
      "url": "",
      "scope": "General guidance; not an official cross-platform policy",
      "verified": false
    },
    "texts": {
      "pt": "Não compartilhe credenciais e revise acessos por canais oficiais.",
      "es": "No compartas credenciales y revisa accesos mediante canales oficiales.",
      "en": "Do not share credentials; review access through official channels."
    },
    "stage": "not-documented",
    "priorNotice": "not-documented",
    "appealPath": "",
    "match": {
      "answers": [
        "sharedCredentials",
        "toolCredentials"
      ],
      "eventKinds": []
    },
    "reviewNote": "Orientação geral; não é política oficial universal de todas as plataformas."
  }
];
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
const data=freeze({version:'platform-rules-v1',lastReviewed:LAST_REVIEWED,rules});root.PlatformRulesData=data;if(typeof module!=='undefined')module.exports=data;
})(typeof window!=='undefined'?window:globalThis);
