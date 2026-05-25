<script lang="ts">
  import { page } from "$app/stores";
  import {
    defaultLanguage,
    getLocalizedCategoryPath,
    getLocalizedPath,
    getLocalizedStaticPath,
    localizedLabels,
    normalizeSiteLanguage,
    supportedLanguages,
  } from "$lib/i18n";
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
</script>

<div>
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href={`/${currentLanguage}`}>EthioVideos</a>

      <nav class="nav">
        <a href={getLocalizedStaticPath(currentLanguage, "trending")}>
          {labels.trending}
        </a>
        <a href={getLocalizedStaticPath(currentLanguage, "latest")}>
          {labels.latest}
        </a>
        <a href={getLocalizedCategoryPath(currentLanguage, "music")}>
          {labels.music}
        </a>
        <a href={getLocalizedCategoryPath(currentLanguage, "news")}>
          {labels.news}
        </a>
        <a href={getLocalizedStaticPath(currentLanguage, "submitVideo")}>
          {labels.submit}
        </a>
      </nav>

      <nav class="pills">
        {#each supportedLanguages as language}
          <a
            class:active={language === currentLanguage}
            class="pill"
            href={languagePath(language)}>{language.toUpperCase()}</a
          >
        {/each}
      </nav>

      <form
        class="search-form header-search"
        action={getLocalizedStaticPath(currentLanguage, "search")}
        method="GET"
      >
        <input
          class="search-input"
          name="q"
          type="search"
          placeholder={labels.searchPlaceholder}
        />
        <button class="button secondary" type="submit">{labels.search}</button>
      </form>
    </div>
  </header>

  <main class="container main">
    {@render children()}
  </main>

  <footer class="footer">
    <div class="container">
      <p>© 2026 EthioVideos. {labels.videosEmbedded}</p>
      <p>
        <a href={getLocalizedStaticPath(currentLanguage, "newsletter")}>
          {labels.newsletter}
        </a>
        ·
        <a href={getLocalizedStaticPath(currentLanguage, "submitVideo")}>
          {labels.submitVideo}
        </a>
        ·
        <a href="/admin/login">{labels.admin}</a>
      </p>
    </div>
  </footer>
</div>
