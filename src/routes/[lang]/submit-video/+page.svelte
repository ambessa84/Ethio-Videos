<script lang="ts">
  import { localizedLabels } from "$lib/i18n";

  let { data, form } = $props();
  let labels = $derived(localizedLabels[data.lang]);
</script>

<svelte:head>
  <title>{labels.submitVideo} | EthioVideos</title>
</svelte:head>

<h1>{labels.submitVideo}</h1>
<p class="muted">{labels.submitVideoCopy}</p>

{#if form?.message}
  <div class="alert">{labels.submitVideoInvalidUrl}</div>
{/if}

{#if form?.success}
  <div class="success">{labels.submitVideoSuccess}</div>
{/if}

<form method="POST" class="form section">
  <div class="form-row">
    <label class="label" for="youtubeUrl">{labels.youtubeUrl}</label>
    <input
      class="input"
      id="youtubeUrl"
      name="youtubeUrl"
      type="url"
      required
    />
  </div>

  <div class="form-row">
    <label class="label" for="category">{labels.category}</label>
    <input
      class="input"
      id="category"
      name="category"
      placeholder={labels.categoryPlaceholder}
    />
  </div>

  <div class="form-row">
    <label class="label" for="language">{labels.language}</label>
    <select class="select" id="language" name="language">
      <option value="">{labels.notSure}</option>
      <option value="am">{labels.amharic}</option>
      <option value="om">{labels.oromo}</option>
      <option value="ti">{labels.tigrinya}</option>
      <option value="en">{labels.english}</option>
      <option value="fr">{labels.french}</option>
    </select>
  </div>

  <div class="form-row">
    <label class="label" for="email">{labels.optionalEmail}</label>
    <input class="input" id="email" name="email" type="email" />
  </div>

  <div class="form-row">
    <label class="label" for="message">{labels.optionalMessage}</label>
    <textarea class="textarea" id="message" name="message" rows="5"></textarea>
  </div>

  <button class="button" type="submit">{labels.submit}</button>
</form>
