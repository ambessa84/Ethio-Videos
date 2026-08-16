<script lang="ts">
  import { localizedLabels } from "$lib/i18n";

  let { data, form } = $props();
  let labels = $derived(localizedLabels[data.lang]);
</script>

<svelte:head>
  <title>{labels.newsletter} | EthioVideos</title>
</svelte:head>

<h1>{labels.newsletter}</h1>
<p class="muted">{labels.newsletterCopy}</p>

{#if form?.message}
  <div class="alert">{labels.newsletterInvalidEmail}</div>
{/if}

{#if form?.success}
  <div class="success">{labels.newsletterSubscribed}</div>
{/if}

<form method="POST" class="form section">
  <div class="form-row">
    <label class="label" for="email">Email</label>
    <input class="input" id="email" name="email" type="email" required />
  </div>

  <div class="form-row">
    <label class="label" for="language">{labels.preferredLanguage}</label>
    <select class="select" id="language" name="language">
      <option value="">{labels.noLanguagePreference}</option>
      <option value="en">{labels.english}</option>
      <option value="fr">{labels.french}</option>
      <option value="am">{labels.amharic}</option>
    </select>
  </div>

  <button class="button" type="submit">{labels.subscribe}</button>
</form>
