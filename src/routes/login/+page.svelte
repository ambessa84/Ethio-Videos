<script lang="ts">
  let { data } = $props();
</script>

<svelte:head>
  <title>Connexion | EthioVideos</title>
</svelte:head>

<section class="login-page">
  <div class="login-heading">
    <h1>Connexion</h1>
    <p class="muted">Connectez-vous pour retrouver votre profil EthioVideos.</p>
  </div>

  <div class="login-panel">
    <a class="button" href="/register">Continuer avec email</a>

    {#if data.socialProviders.length}
      <div class="social-list">
        {#each data.socialProviders as provider}
          <form method="POST" action="/register?/social">
            <input type="hidden" name="providerId" value={provider.id} />
            <input type="hidden" name="redirectTo" value="/profile" />
            <button class="button secondary" type="submit">
              Continuer avec {provider.label}
            </button>
          </form>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .login-page {
    display: grid;
    gap: 1.5rem;
    margin-inline: auto;
    max-width: 520px;
    padding-block: 2rem;
  }

  .login-heading {
    display: grid;
    gap: 0.5rem;
  }

  .login-heading h1 {
    font-size: clamp(2rem, 4vw, 3rem);
    line-height: 1;
    margin: 0;
  }

  .login-panel {
    background: var(--ev-white);
    border: 1px solid var(--ev-border);
    border-radius: 8px;
    display: grid;
    gap: 1rem;
    padding: clamp(1rem, 3vw, 1.5rem);
  }

  .button {
    align-items: center;
    background: var(--ev-green);
    border: 1px solid var(--ev-green);
    border-radius: 8px;
    color: var(--ev-white);
    display: inline-flex;
    font-weight: 800;
    justify-content: center;
    min-height: 3rem;
    padding-inline: 1rem;
    text-decoration: none;
  }

  .button.secondary {
    background: var(--ev-white);
    color: var(--ev-ink);
    width: 100%;
  }

  .social-list {
    display: grid;
    gap: 0.75rem;
  }
</style>
