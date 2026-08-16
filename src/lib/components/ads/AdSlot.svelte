<script lang="ts">
  import { browser, dev } from "$app/environment";
  import { env } from "$env/dynamic/public";

  type AdProvider = "adsense" | "direct" | "disabled";

  let {
    slot,
    label = "Advertisement",
    format = "auto",
    fullWidthResponsive = true,
    minHeight = "90px",
    directTitle = "Sponsor EthioVideos",
    directHref = "/contact",
    providerOverride,
  }: {
    slot?: string;
    label?: string;
    format?: string;
    fullWidthResponsive?: boolean;
    minHeight?: string;
    directTitle?: string;
    directHref?: string;
    providerOverride?: AdProvider;
  } = $props();

  const provider = $derived(
    (providerOverride || env.PUBLIC_AD_PROVIDER || "disabled") as AdProvider,
  );
  const clientId = $derived(env.PUBLIC_GOOGLE_ADSENSE_CLIENT_ID);
  const autoAdsEnabled = $derived(
    env.PUBLIC_GOOGLE_ADSENSE_AUTO_ADS === "true",
  );
  const isAdsenseConfigured = $derived(
    provider === "adsense" && Boolean(clientId && slot),
  );
  const showPlaceholder = $derived(
    dev ||
      provider === "disabled" ||
      (provider === "adsense" && !isAdsenseConfigured && !autoAdsEnabled),
  );

  $effect(() => {
    if (!browser || !isAdsenseConfigured) return;

    try {
      const win = window as Window & {
        adsbygoogle?: Array<Record<string, unknown>>;
      };
      win.adsbygoogle = win.adsbygoogle || [];
      win.adsbygoogle.push({});
    } catch {
      // Ad blockers or denied scripts should not break the page.
    }
  });
</script>

{#if provider === "direct"}
  <aside
    class="ad-slot direct-ad"
    style:min-height={minHeight}
    aria-label={label}
  >
    <a href={directHref}>
      <span>{label}</span>
      <strong>{directTitle}</strong>
    </a>
  </aside>
{:else if isAdsenseConfigured}
  <aside class="ad-slot" style:min-height={minHeight} aria-label={label}>
    <span class="ad-label">{label}</span>
    <ins
      class="adsbygoogle"
      style="display:block"
      data-ad-client={clientId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
    ></ins>
  </aside>
{:else if showPlaceholder}
  <aside
    class="ad-slot placeholder-ad"
    style:min-height={minHeight}
    aria-label={label}
  >
    <span class="ad-label">{label}</span>
  </aside>
{/if}

<style>
  .ad-slot {
    align-items: center;
    background: rgba(238, 243, 238, 0.72);
    border: 1px solid var(--ev-border);
    border-radius: 8px;
    color: var(--ev-muted);
    display: grid;
    font-family: var(--ev-font);
    justify-items: center;
    overflow: hidden;
    padding: 0.75rem;
    width: 100%;
  }

  .ad-label {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .placeholder-ad {
    border-style: dashed;
  }

  .direct-ad a {
    align-items: center;
    color: var(--ev-green);
    display: grid;
    gap: 0.25rem;
    justify-items: center;
    text-align: center;
    text-decoration: none;
  }

  .direct-ad strong {
    color: var(--ev-ink);
    font-size: 1rem;
  }
</style>
