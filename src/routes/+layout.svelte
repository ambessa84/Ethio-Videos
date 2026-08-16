<script lang="ts">
  import { env } from "$env/dynamic/public";
  import { page } from "$app/stores";
  import AppHeader from "$lib/components/home/AppHeader.svelte";
  import {
    defaultLanguage,
    getLocalizedCategoryPath,
    getLocalizedPath,
    getLocalizedStaticPath,
    localizedLabels,
    normalizeSiteLanguage,
  } from "$lib/i18n";
  import "$lib/design-tokens.css";
  import "../app.css";

  let { children } = $props();
  let currentLanguage = $derived(
    normalizeSiteLanguage($page.params.lang ?? defaultLanguage),
  );
  let labels = $derived(localizedLabels[currentLanguage]);
  let languageAlternates = $derived(
    ($page.data.languageAlternates ?? {}) as Record<string, string>,
  );

  function languagePath(language: string) {
    return (
      languageAlternates[language] ??
      getLocalizedPath(normalizeSiteLanguage(language), $page.url.pathname)
    );
  }

  let navItems = $derived([
    {
      label: labels.trending,
      href: getLocalizedStaticPath(currentLanguage, "trending"),
    },
    {
      label: labels.latest,
      href: getLocalizedStaticPath(currentLanguage, "latest"),
    },
    {
      label: labels.music,
      href: getLocalizedCategoryPath(currentLanguage, "music"),
    },
    {
      label: labels.news,
      href: getLocalizedStaticPath(currentLanguage, "news"),
    },
    {
      label: labels.submit,
      href: getLocalizedStaticPath(currentLanguage, "submitVideo"),
    },
  ]);

  let languageHrefs = $derived({
    fr: languagePath("fr"),
    en: languagePath("en"),
    am: languagePath("am"),
  });
  const footerLanguages = ["fr", "en", "am"] as const;
  const shouldLoadAdsense =
    env.PUBLIC_AD_PROVIDER === "adsense" &&
    Boolean(env.PUBLIC_GOOGLE_ADSENSE_CLIENT_ID);
</script>

<svelte:head>
  {#if shouldLoadAdsense}
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.PUBLIC_GOOGLE_ADSENSE_CLIENT_ID}`}
      crossorigin="anonymous"
    ></script>
  {/if}
</svelte:head>

<div>
  <header class="site-header">
    <div class="container">
      <AppHeader
        brandHref={`/${currentLanguage}`}
        {navItems}
        searchAction={getLocalizedStaticPath(currentLanguage, "search")}
        searchLabel={labels.search}
        searchPlaceholder={labels.searchPlaceholder}
      />
    </div>
  </header>

  <main class="container main">
    {@render children()}
  </main>

  <footer class="footer">
    <div class="container footer-inner">
      <div>
        <p>© 2026 EthioVideos. {labels.videosEmbedded}</p>
        <p class="footer-links">
          <a href={getLocalizedStaticPath(currentLanguage, "newsletter")}>
            {labels.newsletter}
          </a>
          <span>/</span>
          <a href={getLocalizedStaticPath(currentLanguage, "submitVideo")}>
            {labels.submitVideo}
          </a>
          <span>/</span>
          <a href="/admin/login">{labels.admin}</a>
        </p>
      </div>

      <nav class="footer-language-switcher" aria-label="Choix de langue">
        {#each footerLanguages as language}
          <a
            class:active={language === currentLanguage}
            href={languageHrefs[language]}
            aria-current={language === currentLanguage ? "page" : undefined}
          >
            {language.toUpperCase()}
          </a>
        {/each}
      </nav>
    </div>
  </footer>
</div>
