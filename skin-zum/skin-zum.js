(function () {
  "use strict";

  const CONFIG = {
    version: "1.0.4",
    assetsBase: "skin-zum/assets/",
    logo: "logo-zum.png",
    creditLogo: "logo-exata.png",
    whatsappIcon: "whatsapp.png",
    introCardDuration: 15000,

    links: {
      site: "https://lucaszum.com.br/",
      estoque: "https://lucaszum.com.br/estoque",
      instagram: "https://www.instagram.com/lucas_zum/",
      tiktok: "https://www.tiktok.com/@lucas.zummotors",
      whatsappGeral: "https://mgtour360.com.br/tour/whats/l/zum",
      avaliacaoGoogle: "https://search.google.com/local/writereview?placeid=ChIJmQa2QAADuwARR1DHulRlQrg"
    },

    mapaEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5633.484056279772!2d-42.0407985!3d-20.2728978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xbb030040b60699%3A0xb8426554bac75047!2sZum%20Motors!5e1!3m2!1spt-BR!2sbr!4v1787315021769!5m2!1spt-BR!2sbr",

    // Índices e IDs conferidos nas miniaturas e no mainPlayList exportado pelo 3DVista.
    ambientes: [
      {
        id: "vista-aerea",
        nome: "Vista Aérea",
        index: 0,
        pano: "panorama_20BB46BE_2BBC_D7BE_41C5_4BE70542123E",
        icon: "aerial"
      },
      {
        id: "fachada",
        nome: "Fachada",
        index: 1,
        pano: "panorama_27110995_2BBC_BA42_41C2_D93782C458D2",
        icon: "facade"
      },
      {
        id: "showroom",
        nome: "Showroom",
        index: 8,
        pano: "panorama_20BB7007_2BBD_CA4E_41B8_88179BD4096E",
        icon: "car"
      },
      {
        id: "coffee",
        nome: "Coffee",
        index: 12,
        pano: "panorama_20BC4155_2BBD_4AC2_41C2_FA15DB268AFB",
        icon: "coffee"
      },
      {
        id: "estoque",
        nome: "Estoque",
        index: 20,
        pano: "panorama_20C4472C_2BC3_5642_41B0_E0B2F1F6C432",
        icon: "stock"
      }
    ],

    vendedores: [
      {
        nome: "Vendedor Rafael",
        telefone: "5531996864246",
        link: "https://wa.me/5531996864246"
      },
      {
        nome: "Vendedor Léo",
        telefone: "5533984208590",
        link: "https://wa.me/5533984208590"
      }
    ]
  };

  const state = {
    mode: getExperienceMode(),
    activeAmbiente: CONFIG.ambientes[0].id,
    sellersOpen: false,
    modalOpen: false,
    mobileOpen: false,
    toastTimer: null,
    introCardTimer: null,
    introCardRemovalTimer: null,
    introCardDismissed: false,
    audioBoundRoot: null,
    playerControlAttempts: 0,
    previousFocus: null,
    viewportTimer: null,
    navigationToken: 0,
    tourReady: false,
    tourLifecycleBound: false,
    tourBindAttempts: 0,
    pendingAmbiente: null
  };

  const icon = {
    site:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" stroke="currentColor" stroke-width="2"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3c2.1 2.3 3.2 5.3 3.2 9s-1.1 6.7-3.2 9c-2.1-2.3-3.2-5.3-3.2-9S9.9 5.3 12 3Z" stroke="currentColor" stroke-width="2"/></svg>',
    instagram:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3.5" stroke="currentColor" stroke-width="2"/><circle cx="17" cy="7" r="1" fill="currentColor"/></svg>',
    tiktok:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 4v10.1a4.9 4.9 0 1 1-4.9-4.9" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/><path d="M15 4c.7 3.2 2.4 4.9 5 5.2" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/></svg>',
    map:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="2"/></svg>',
    star:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    fullscreen:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 4H4v4M16 4h4v4M8 20H4v-4M20 16v4h-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    audioOn:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 10v4h3l4 3V7l-4 3H5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M15 9.5a4 4 0 0 1 0 5M17.8 7a7 7 0 0 1 0 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    audioOff:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 10v4h3l4 3V7l-4 3H5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="m16 10 4 4M20 10l-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    vr:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4.5 8.5h15l1.2 6.3a2.5 2.5 0 0 1-4.5 1.9l-1.5-2.2H9.3l-1.5 2.2a2.5 2.5 0 0 1-4.5-1.9l1.2-6.3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="8.2" cy="11.8" r="1.8" stroke="currentColor" stroke-width="1.6"/><circle cx="15.8" cy="11.8" r="1.8" stroke="currentColor" stroke-width="1.6"/></svg>',
    close: '<span aria-hidden="true">×</span>',
    menu:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    environments: {
      aerial:
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" stroke="currentColor" stroke-width="1.8"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9" stroke="currentColor" stroke-width="1.8"/></svg>',
      facade:
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 21V9l8-6 8 6v12H4Z" stroke="currentColor" stroke-width="1.8"/><path d="M8 21v-7h8v7M7 10h2M11 10h2M15 10h2" stroke="currentColor" stroke-width="1.8"/></svg>',
      car:
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 11 2-5h10l2 5 2 2v5h-2v2h-3v-2H8v2H5v-2H3v-5l2-2Z" stroke="currentColor" stroke-width="1.8"/><path d="M7 14h.01M17 14h.01M5 11h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
      coffee:
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 10h12v5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5v-5Z" stroke="currentColor" stroke-width="1.8"/><path d="M17 12h1.5a2.5 2.5 0 0 1 0 5H17M8 7c0-1 1-1 1-2s-1-1-1-2M12 7c0-1 1-1 1-2s-1-1-1-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
      stock:
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m4 7 8-4 8 4v10l-8 4-8-4V7Z" stroke="currentColor" stroke-width="1.8"/><path d="m4 7 8 4 8-4M12 11v10" stroke="currentColor" stroke-width="1.8"/></svg>'
    }
  };

  function getExperienceMode() {
    const playerIsMobile = Boolean(window.TDV && TDV.PlayerAPI && TDV.PlayerAPI.mobile);
    const compactTouch = window.matchMedia
      ? window.matchMedia("(max-width: 760px), (hover: none) and (pointer: coarse)").matches
      : window.innerWidth <= 760;
    return playerIsMobile || compactTouch ? "mobile" : "desktop";
  }

  function asset(path) {
    return CONFIG.assetsBase + path;
  }

  function createEl(tag, className, html) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (html) element.innerHTML = html;
    return element;
  }

  function injectCss() {
    if (document.querySelector('link[data-zum-skin-css="true"]')) return;

    const script = document.currentScript || document.querySelector('script[src*="skin-zum.js"]');
    const href = script && script.src
      ? script.src.replace(/skin-zum\.js(\?.*)?$/, "skin-zum.css?v=" + CONFIG.version)
      : "skin-zum/skin-zum.css?v=" + CONFIG.version;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.setAttribute("data-zum-skin-css", "true");
    document.head.appendChild(link);
  }

  function init() {
    if (document.querySelector(".zum-skin")) return;

    injectCss();
    updateViewportHeight();

    const root = createEl("div", "zum-skin zum-skin--" + state.mode + " is-entering");
    root.setAttribute("aria-label", "Skin Zum Motors");
    root.dataset.version = CONFIG.version;

    root.appendChild(buildTopbar());
    root.appendChild(buildHero());
    root.appendChild(buildBottomDock());
    root.appendChild(buildControls());
    root.appendChild(buildWhatsappButton());
    root.appendChild(buildCreditLogo());
    root.appendChild(buildInteractionShield());
    root.appendChild(buildSellersPanel());
    root.appendChild(buildModal());
    if (state.mode === "mobile") root.appendChild(buildMobileMenu());
    root.appendChild(buildToast());

    document.body.appendChild(root);
    setActiveAmbiente(state.activeAmbiente, false);
    bindGlobalEvents(root);
    bindTourLifecycle();
    bindPlayerStateControls();
    syncUiState();
    startIntroCardTimer();

    window.requestAnimationFrame(function () {
      root.classList.remove("is-entering");
    });
  }

  function buildTopbar() {
    const topbar = createEl("header", "zum-topbar");
    topbar.appendChild(buildBrand());

    if (state.mode === "desktop") {
      const spacer = createEl("div", "zum-top-spacer");
      spacer.appendChild(buildTopCta());
      topbar.appendChild(spacer);

      const actions = createEl("div", "zum-top-actions");
      actions.appendChild(buildIconLink(CONFIG.links.site, "Site da Zum Motors", icon.site));
      actions.appendChild(buildIconLink(CONFIG.links.instagram, "Instagram", icon.instagram));
      actions.appendChild(buildIconLink(CONFIG.links.tiktok, "TikTok", icon.tiktok));

      const mapButton = buildIconButton("Como chegar", icon.map);
      mapButton.addEventListener("click", openMap);
      actions.appendChild(mapButton);
      actions.appendChild(buildIconLink(CONFIG.links.avaliacaoGoogle, "Avaliar no Google", icon.star, "zum-icon-btn--red"));
      topbar.appendChild(actions);
    } else {
      const actions = createEl("div", "zum-top-actions");
      const mobileToggle = buildIconButton("Abrir menu", icon.menu, "zum-mobile-toggle");
      mobileToggle.setAttribute("aria-expanded", "false");
      mobileToggle.setAttribute("aria-controls", "zum-mobile-menu");
      mobileToggle.addEventListener("click", toggleMobileMenu);
      actions.appendChild(mobileToggle);
      topbar.appendChild(actions);
    }

    return topbar;
  }

  function buildBrand() {
    const brand = createEl(
      "button",
      "zum-brand",
      '<img class="zum-brand__logo" src="' + asset(CONFIG.logo) + '" alt="Zum Motors">' +
        '<span class="zum-brand__text">' +
          '<span class="zum-brand__kicker">Tour 360°</span>' +
          '<span class="zum-brand__title">Zum Motors</span>' +
        "</span>"
    );
    brand.type = "button";
    brand.setAttribute("aria-label", "Ir para Vista Aérea");
    brand.addEventListener("click", function () {
      setActiveAmbiente(CONFIG.ambientes[0].id, true);
    });
    return brand;
  }

  function buildTopCta() {
    const actions = createEl("div", "zum-top-cta");

    const estoque = createEl("button", "zum-action-btn zum-action-btn--primary", "Ver estoque");
    estoque.type = "button";
    estoque.addEventListener("click", openEstoque);
    actions.appendChild(estoque);

    const contato = createEl("button", "zum-action-btn zum-sellers-trigger", "Falar com vendedor");
    contato.type = "button";
    contato.setAttribute("aria-expanded", "false");
    contato.addEventListener("click", openSellersPanel);
    actions.appendChild(contato);

    const mapa = createEl("button", "zum-action-btn", "Como chegar");
    mapa.type = "button";
    mapa.addEventListener("click", openMap);
    actions.appendChild(mapa);

    return actions;
  }

  function buildHero() {
    const hero = createEl(
      "section",
      "zum-hero-card",
      '<span class="zum-eyebrow">Showroom virtual</span>' +
        '<h1 class="zum-hero-title">Explore a <span>loja</span> e o estoque</h1>' +
        '<p class="zum-hero-text">Navegue pelos ambientes da Zum Motors e fale com um vendedor direto pelo WhatsApp.</p>'
    );
    hero.setAttribute("aria-label", "Apresentação do showroom virtual");
    return hero;
  }

  function startIntroCardTimer() {
    window.clearTimeout(state.introCardTimer);
    state.introCardTimer = window.setTimeout(dismissIntroCard, CONFIG.introCardDuration);
  }

  function dismissIntroCard() {
    if (state.introCardDismissed) return;
    state.introCardDismissed = true;
    window.clearTimeout(state.introCardTimer);

    const hero = document.querySelector(".zum-hero-card");
    if (!hero) return;
    hero.setAttribute("aria-hidden", "true");
    hero.classList.add("is-leaving");
    state.introCardRemovalTimer = window.setTimeout(function () {
      hero.hidden = true;
    }, 460);
  }

  function buildBottomDock() {
    const dock = createEl("nav", "zum-bottom-dock");
    dock.setAttribute("aria-label", "Navegação rápida por ambientes");

    if (state.mode === "desktop") {
      dock.appendChild(createEl("span", "zum-dock-label", "Ambientes"));
    }

    CONFIG.ambientes.forEach(function (ambiente) {
      dock.appendChild(buildAmbienteButton(ambiente));
    });
    return dock;
  }

  function buildAmbienteButton(ambiente) {
    const button = createEl(
      "button",
      "zum-pill zum-dock-btn",
      '<span class="zum-dock-icon">' + icon.environments[ambiente.icon] + "</span>" +
        '<span class="zum-dock-text">' + escapeHtml(ambiente.nome) + "</span>"
    );
    button.type = "button";
    button.dataset.ambiente = ambiente.id;
    button.dataset.pano = ambiente.pano;
    button.setAttribute("aria-label", "Abrir " + ambiente.nome);
    button.addEventListener("click", function () {
      setActiveAmbiente(ambiente.id, true);
    });
    return button;
  }

  function buildControls() {
    const controls = createEl("div", "zum-controls");

    if (state.mode === "desktop") {
      const fullscreen = buildIconButton("Tela cheia", icon.fullscreen);
      fullscreen.addEventListener("click", toggleFullscreen);
      controls.appendChild(fullscreen);

      const mapButton = buildIconButton("Como chegar", icon.map);
      mapButton.addEventListener("click", openMap);
      controls.appendChild(mapButton);

      controls.appendChild(buildIconLink(CONFIG.links.avaliacaoGoogle, "Avaliar no Google", icon.star));
    }

    controls.appendChild(buildAudioButton());
    if (state.mode === "mobile") controls.appendChild(buildVrButton());
    return controls;
  }

  function buildAudioButton() {
    const button = buildIconButton("Desligar áudio", icon.audioOn, "zum-audio-toggle");
    button.setAttribute("aria-pressed", "true");
    button.dataset.audioState = "on";
    button.addEventListener("click", toggleTourAudio);
    return button;
  }

  function buildVrButton() {
    const button = buildIconButton(
      "Ativar modo VR",
      icon.vr + '<span class="zum-vr-label" aria-hidden="true">VR</span>',
      "zum-vr-trigger"
    );
    button.dataset.vrStatus = "ready";
    button.addEventListener("click", enableTourVr);
    return button;
  }

  function buildWhatsappButton() {
    const button = createEl(
      "button",
      "zum-whatsapp-float zum-sellers-trigger",
      '<img src="' + asset(CONFIG.whatsappIcon) + '" alt="">'
    );
    button.type = "button";
    button.setAttribute("aria-label", "Abrir atendimento via WhatsApp");
    button.setAttribute("aria-expanded", "false");
    button.addEventListener("click", toggleSellersPanel);
    return button;
  }

  function buildCreditLogo() {
    const credit = createEl(
      "div",
      "zum-credit-logo",
      '<img src="' + asset(CONFIG.creditLogo) + '" alt="Exata Engenharia e Perícias">'
    );
    credit.setAttribute("aria-label", "Exata Engenharia e Perícias");
    return credit;
  }

  function buildInteractionShield() {
    const shield = createEl("button", "zum-ui-shield");
    shield.type = "button";
    shield.setAttribute("aria-label", "Fechar janela ativa");
    shield.addEventListener("click", closeAllPanels);
    return shield;
  }

  function buildSellersPanel() {
    const panel = createEl("aside", "zum-side-panel");
    panel.id = "zum-sellers-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-label", "Atendimento via WhatsApp");
    panel.setAttribute("aria-hidden", "true");
    panel.setAttribute("tabindex", "-1");
    panel.innerHTML =
      '<div class="zum-panel-head">' +
        "<div>" +
          '<h2 class="zum-panel-title">Atendimento Zum Motors</h2>' +
          '<p class="zum-panel-subtitle">Escolha um vendedor para iniciar a conversa.</p>' +
        "</div>" +
        '<button class="zum-close-btn" type="button" aria-label="Fechar atendimento">' + icon.close + "</button>" +
      "</div>";

    panel.querySelector(".zum-close-btn").addEventListener("click", closeSellersPanel);
    CONFIG.vendedores.forEach(function (vendedor) {
      panel.appendChild(buildSellerCard(vendedor));
    });
    panel.appendChild(buildSellerCard({
      nome: "WhatsApp geral",
      telefone: "Atendimento Zum Motors",
      link: CONFIG.links.whatsappGeral
    }));
    return panel;
  }

  function buildSellerCard(vendedor) {
    const card = createEl(
      "a",
      "zum-seller-card",
      '<span class="zum-seller-icon"><img src="' + asset(CONFIG.whatsappIcon) + '" alt=""></span>' +
        "<span>" +
          '<strong class="zum-seller-name">' + escapeHtml(vendedor.nome) + "</strong>" +
          '<small class="zum-seller-link">' + escapeHtml(vendedor.telefone) + "</small>" +
        "</span>"
    );
    card.href = vendedor.link;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    return card;
  }

  function buildModal() {
    const modal = createEl("section", "zum-map-modal");
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML =
      '<div class="zum-map-card" role="dialog" aria-modal="true" aria-labelledby="zum-modal-title">' +
        '<div class="zum-map-head">' +
          '<h2 class="zum-map-title" id="zum-modal-title">Como chegar</h2>' +
          '<button class="zum-close-btn" type="button" aria-label="Fechar janela">' + icon.close + "</button>" +
        "</div>" +
        '<iframe class="zum-map-frame" src="about:blank" title="Conteúdo Zum Motors" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>' +
      "</div>";

    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });
    modal.querySelector(".zum-close-btn").addEventListener("click", closeModal);
    return modal;
  }

  function buildMobileMenu() {
    const menu = createEl("nav", "zum-mobile-menu");
    menu.id = "zum-mobile-menu";
    menu.setAttribute("aria-label", "Menu da Zum Motors");
    menu.setAttribute("aria-hidden", "true");

    menu.appendChild(buildMenuButton("Ver estoque", true, function () {
      openEstoque();
    }));
    menu.appendChild(buildMenuButton("Falar com vendedor", false, function () {
      openSellersPanel();
    }, "zum-sellers-trigger"));
    menu.appendChild(buildMenuLink("Site da Zum Motors", CONFIG.links.site));
    menu.appendChild(buildMenuLink("Instagram", CONFIG.links.instagram));
    menu.appendChild(buildMenuLink("TikTok", CONFIG.links.tiktok));
    menu.appendChild(buildMenuLink("Avaliar no Google", CONFIG.links.avaliacaoGoogle, true));
    menu.appendChild(buildMenuButton("Como chegar", false, openMap));
    return menu;
  }

  function buildMenuButton(label, primary, onClick, extraClass) {
    const className = "zum-action-btn" + (primary ? " zum-action-btn--primary" : "") + (extraClass ? " " + extraClass : "");
    const button = createEl("button", className, label);
    button.type = "button";
    button.addEventListener("click", onClick);
    return button;
  }

  function buildMenuLink(label, href, primary) {
    const link = createEl("a", "zum-action-btn" + (primary ? " zum-action-btn--primary" : ""), label);
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return link;
  }

  function buildToast() {
    const toast = createEl("div", "zum-toast");
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    return toast;
  }

  function buildIconLink(href, label, svg, extraClass) {
    const link = createEl("a", "zum-icon-btn" + (extraClass ? " " + extraClass : ""), svg);
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.title = label;
    link.setAttribute("aria-label", label);
    return link;
  }

  function buildIconButton(label, svg, extraClass) {
    const button = createEl("button", "zum-icon-btn" + (extraClass ? " " + extraClass : ""), svg);
    button.type = "button";
    button.title = label;
    button.setAttribute("aria-label", label);
    return button;
  }

  function getRootPlayer() {
    const tourInstance = window.tour;
    if (!tourInstance) return null;

    try {
      if (typeof tourInstance._getRootPlayer === "function") {
        return tourInstance._getRootPlayer() || null;
      }
      if (tourInstance.player && typeof tourInstance.player.getById === "function") {
        return tourInstance.player.getById("rootPlayer") || null;
      }
    } catch (error) {
      console.error("[Zum Skin] Não foi possível acessar os controles do player", error);
    }
    return null;
  }

  function runWithRootPlayer(action, unavailableMessage) {
    let attempts = 0;
    const tryRun = function () {
      const rootPlayer = getRootPlayer();
      if (rootPlayer) {
        action(rootPlayer);
        return;
      }

      attempts += 1;
      if (attempts < 12) {
        window.setTimeout(tryRun, 160);
      } else {
        showToast(unavailableMessage);
      }
    };
    tryRun();
  }

  function toggleTourAudio() {
    runWithRootPlayer(function (rootPlayer) {
      try {
        const willMute = !readTourAudioMuted(rootPlayer);
        setTourAudioMuted(rootPlayer, willMute);
        syncAudioButton(willMute);
        showToast(willMute ? "Áudio desligado" : "Áudio ligado");
      } catch (error) {
        console.error("[Zum Skin] Falha ao alterar o áudio", error);
        showToast("Não foi possível alterar o áudio agora.");
      }
    }, "O áudio ainda está carregando. Tente novamente.");
  }

  function getTourAudioObjects(rootPlayer) {
    if (!rootPlayer || typeof rootPlayer.getByClassName !== "function") return [];
    try {
      return Array.prototype.slice.call(rootPlayer.getByClassName("MediaAudio") || []);
    } catch (error) {
      console.error("[Zum Skin] Não foi possível listar as mídias de áudio", error);
      return [];
    }
  }

  function readTourAudioMuted(rootPlayer) {
    const rootMuted = Boolean(rootPlayer.get("mute"));
    const audios = getTourAudioObjects(rootPlayer);
    const mediaMuted = audios.some(function (audio) {
      return Boolean(audio.get("mute"));
    });
    return rootMuted || mediaMuted;
  }

  function setTourAudioMuted(rootPlayer, muted) {
    rootPlayer.set("mute", muted);
    getTourAudioObjects(rootPlayer).forEach(function (audio) {
      audio.set("mute", muted);
    });

    if (!muted && typeof rootPlayer.resumeGlobalAudios === "function") {
      rootPlayer.resumeGlobalAudios();
    }
  }

  function syncAudioButton(muted) {
    document.querySelectorAll(".zum-audio-toggle").forEach(function (button) {
      button.innerHTML = muted ? icon.audioOff : icon.audioOn;
      button.classList.toggle("is-audio-off", muted);
      button.dataset.audioState = muted ? "off" : "on";
      button.setAttribute("aria-pressed", String(!muted));
      button.setAttribute("aria-label", muted ? "Ligar áudio" : "Desligar áudio");
      button.title = muted ? "Ligar áudio" : "Desligar áudio";
    });
  }

  function bindPlayerStateControls() {
    const rootPlayer = getRootPlayer();
    if (!rootPlayer) {
      state.playerControlAttempts += 1;
      if (state.playerControlAttempts < 50) window.setTimeout(bindPlayerStateControls, 200);
      return;
    }

    syncAudioButton(readTourAudioMuted(rootPlayer));
    if (state.audioBoundRoot === rootPlayer) return;

    state.audioBoundRoot = rootPlayer;
    state.playerControlAttempts = 0;
    const syncFromPlayer = function () {
      syncAudioButton(readTourAudioMuted(rootPlayer));
    };
    if (typeof rootPlayer.bind === "function") {
      rootPlayer.bind("mute_changed", syncFromPlayer, rootPlayer, true);
    }
    getTourAudioObjects(rootPlayer).forEach(function (audio) {
      if (typeof audio.bind === "function") audio.bind("mute_changed", syncFromPlayer, audio, true);
    });
  }

  function enableTourVr() {
    const button = document.querySelector(".zum-vr-trigger");
    if (button) button.dataset.vrStatus = "requested";

    runWithRootPlayer(function (rootPlayer) {
      try {
        if (typeof rootPlayer.enableVR !== "function") {
          throw new Error("Função enableVR indisponível");
        }
        rootPlayer.enableVR();
        if (button) button.dataset.vrStatus = "started";
        showToast("Iniciando modo VR…");
      } catch (error) {
        if (button) button.dataset.vrStatus = "unavailable";
        console.error("[Zum Skin] Falha ao iniciar o modo VR", error);
        showToast("O modo VR não está disponível neste aparelho.");
      }
    }, "O modo VR ainda está carregando. Tente novamente.");
  }

  function syncNativeAudioChoice(event) {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const choice = String(target.textContent || "").trim().toUpperCase();
    if (choice !== "SIM" && choice !== "NÃO") return;
    if (!/Ativar\s+áudio\?/i.test(document.body.innerText)) return;

    const muted = choice === "NÃO";
    window.setTimeout(function () {
      runWithRootPlayer(function (rootPlayer) {
        setTourAudioMuted(rootPlayer, muted);
        syncAudioButton(muted);
      }, "O áudio ainda está carregando. Tente novamente.");
    }, 80);
  }

  function setActiveAmbiente(id, navigate) {
    const ambiente = CONFIG.ambientes.find(function (item) {
      return item.id === id;
    });
    if (!ambiente) return;

    state.activeAmbiente = id;
    document.querySelectorAll(".zum-skin [data-ambiente]").forEach(function (button) {
      const active = button.dataset.ambiente === id;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-current", active ? "true" : "false");
    });

    if (navigate) goToPano(ambiente);
  }

  function goToPano(ambiente) {
    closeAllPanels(false);
    const navigationToken = ++state.navigationToken;
    state.pendingAmbiente = ambiente;
    window.dispatchEvent(new CustomEvent("zumskin:navigate", {
      detail: {
        ambiente: ambiente.id,
        nome: ambiente.nome,
        index: ambiente.index,
        pano: ambiente.pano
      }
    }));

    const navigate = function () {
      if (navigationToken !== state.navigationToken) return false;
      try {
        if (typeof window.setMediaByIndex === "function") {
          window.setMediaByIndex(ambiente.index);
          state.pendingAmbiente = null;
          return true;
        }
        if (window.tour && typeof window.tour.setMediaByIndex === "function") {
          window.tour.setMediaByIndex(ambiente.index);
          state.pendingAmbiente = null;
          return true;
        }
      } catch (error) {
        console.error("[Zum Skin] Falha ao abrir panorama", error);
      }
      return false;
    };

    if (state.tourReady && navigate()) {
      showToast("Abrindo: " + ambiente.nome);
      return;
    }

    showToast("Preparando " + ambiente.nome + "…");

    // Fallback para exportações que não expõem os eventos do player imediatamente.
    [900, 2000, 3500, 5200].forEach(function (delay) {
      window.setTimeout(function () {
        if (navigationToken !== state.navigationToken || !state.pendingAmbiente) return;
        if (navigate()) showToast("Abrindo: " + ambiente.nome);
      }, delay);
    });
  }

  function bindTourLifecycle() {
    if (state.tourLifecycleBound) return;
    state.tourBindAttempts += 1;

    const tourInstance = window.tour;
    if (!tourInstance || !window.TDV || !TDV.Tour || typeof tourInstance.bind !== "function") {
      if (state.tourBindAttempts < 50) window.setTimeout(bindTourLifecycle, 200);
      return;
    }

    state.tourLifecycleBound = true;
    const markReady = function () {
      state.tourReady = true;
      bindPlayerStateControls();
      if (!state.pendingAmbiente) return;
      const pending = state.pendingAmbiente;
      state.pendingAmbiente = null;
      window.setTimeout(function () {
        try {
          if (typeof window.setMediaByIndex === "function") {
            window.setMediaByIndex(pending.index);
            showToast("Abrindo: " + pending.nome);
          } else if (window.tour && typeof window.tour.setMediaByIndex === "function") {
            window.tour.setMediaByIndex(pending.index);
            showToast("Abrindo: " + pending.nome);
          }
        } catch (error) {
          console.error("[Zum Skin] Falha ao concluir navegação", error);
        }
      }, 80);
    };

    if (tourInstance.isInitialized) markReady();
    tourInstance.bind(TDV.Tour.EVENT_TOUR_INITIALIZED, markReady);
    tourInstance.bind(TDV.Tour.EVENT_TOUR_LOADED, markReady);
  }

  function toggleSellersPanel() {
    if (state.sellersOpen) closeSellersPanel();
    else openSellersPanel();
  }

  function openSellersPanel() {
    rememberFocus();
    closeMobileMenu(false);
    closeModal(false);
    state.sellersOpen = true;
    syncUiState();
    focusSoon(".zum-side-panel .zum-close-btn");
  }

  function closeSellersPanel(sync) {
    state.sellersOpen = false;
    if (sync !== false) syncUiState();
  }

  function openEstoque() {
    openIframeModal("Estoque Zum Motors", CONFIG.links.estoque);
  }

  function openMap() {
    openIframeModal("Como chegar", CONFIG.mapaEmbedSrc);
  }

  function openIframeModal(title, src) {
    rememberFocus();
    closeSellersPanel(false);
    closeMobileMenu(false);
    state.modalOpen = true;

    const frame = document.querySelector(".zum-map-frame");
    const titleElement = document.querySelector(".zum-map-title");
    if (titleElement) titleElement.textContent = title;
    if (frame && frame.dataset.src !== src) {
      frame.dataset.src = src;
      frame.src = src;
    }

    syncUiState();
    focusSoon(".zum-map-modal .zum-close-btn");
  }

  function closeModal(sync) {
    state.modalOpen = false;
    if (sync !== false) syncUiState();

    const frame = document.querySelector(".zum-map-frame");
    window.setTimeout(function () {
      if (!state.modalOpen && frame) {
        frame.src = "about:blank";
        delete frame.dataset.src;
      }
    }, 240);
  }

  function toggleMobileMenu() {
    if (state.mobileOpen) closeMobileMenu();
    else openMobileMenu();
  }

  function openMobileMenu() {
    rememberFocus();
    closeSellersPanel(false);
    closeModal(false);
    state.mobileOpen = true;
    syncUiState();
    focusSoon(".zum-mobile-menu .zum-action-btn");
  }

  function closeMobileMenu(sync) {
    state.mobileOpen = false;
    if (sync !== false) syncUiState();
  }

  function closeAllPanels(restoreFocus) {
    closeSellersPanel(false);
    closeMobileMenu(false);
    closeModal(false);
    syncUiState(restoreFocus !== false);
  }

  function syncUiState(restoreFocus) {
    const root = document.querySelector(".zum-skin");
    if (!root) return;

    const blocked = state.sellersOpen || state.modalOpen || state.mobileOpen;
    root.classList.toggle("has-sellers", state.sellersOpen);
    root.classList.toggle("has-modal", state.modalOpen);
    root.classList.toggle("has-mobile-menu", state.mobileOpen);
    root.classList.toggle("is-ui-blocked", blocked);
    document.body.classList.toggle("zum-pano-locked", blocked);

    const sellerPanel = root.querySelector(".zum-side-panel");
    const modal = root.querySelector(".zum-map-modal");
    const mobileMenu = root.querySelector(".zum-mobile-menu");
    const shield = root.querySelector(".zum-ui-shield");
    if (sellerPanel) sellerPanel.setAttribute("aria-hidden", String(!state.sellersOpen));
    if (modal) modal.setAttribute("aria-hidden", String(!state.modalOpen));
    if (mobileMenu) mobileMenu.setAttribute("aria-hidden", String(!state.mobileOpen));
    if (shield) shield.setAttribute("aria-hidden", String(!(state.sellersOpen || state.mobileOpen)));

    root.querySelectorAll(".zum-sellers-trigger").forEach(function (element) {
      element.setAttribute("aria-expanded", String(state.sellersOpen));
    });
    const menuToggle = root.querySelector(".zum-mobile-toggle");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", String(state.mobileOpen));
      menuToggle.setAttribute("aria-label", state.mobileOpen ? "Fechar menu" : "Abrir menu");
    }

    const viewer = document.getElementById("viewer");
    if (viewer) {
      if (blocked) viewer.setAttribute("inert", "");
      else viewer.removeAttribute("inert");
    }

    if (!blocked && restoreFocus !== false && state.previousFocus) {
      const target = state.previousFocus;
      state.previousFocus = null;
      window.setTimeout(function () {
        if (document.contains(target) && typeof target.focus === "function") target.focus();
      }, 20);
    }
  }

  function rememberFocus() {
    if (!state.previousFocus && document.activeElement instanceof HTMLElement) {
      state.previousFocus = document.activeElement;
    }
  }

  function focusSoon(selector) {
    window.setTimeout(function () {
      const element = document.querySelector(selector);
      if (element && typeof element.focus === "function") element.focus();
    }, 40);
  }

  function toggleFullscreen() {
    const documentElement = document.documentElement;
    const activeFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
    if (!activeFullscreen) {
      const request = documentElement.requestFullscreen || documentElement.webkitRequestFullscreen;
      if (request) request.call(documentElement);
      return;
    }
    const exit = document.exitFullscreen || document.webkitExitFullscreen;
    if (exit) exit.call(document);
  }

  function showToast(message) {
    const toast = document.querySelector(".zum-toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2400);
  }

  function updateViewportHeight() {
    const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    document.documentElement.style.setProperty("--zum-viewport-height", Math.round(height) + "px");
  }

  function queueViewportUpdate() {
    window.clearTimeout(state.viewportTimer);
    state.viewportTimer = window.setTimeout(updateViewportHeight, 80);
  }

  function bindGlobalEvents(root) {
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeAllPanels();
    });
    document.addEventListener("click", syncNativeAudioChoice, true);

    window.addEventListener("resize", queueViewportUpdate, { passive: true });
    window.addEventListener("orientationchange", queueViewportUpdate, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", queueViewportUpdate, { passive: true });
      window.visualViewport.addEventListener("scroll", queueViewportUpdate, { passive: true });
    }

    root.addEventListener("touchmove", function (event) {
      if (event.target.closest(".zum-side-panel, .zum-mobile-menu, .zum-map-card")) return;
      if (state.sellersOpen || state.modalOpen || state.mobileOpen) event.preventDefault();
    }, { passive: false });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
