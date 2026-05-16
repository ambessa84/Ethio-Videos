<script lang="ts">
  let { form } = $props();
</script>

<svelte:head>
  <title>Submit a video | EthioVideos</title>
</svelte:head>

<h1>Submit a video</h1>
<p class="muted">Suggest a YouTube video to add to the site.</p>

{#if form?.message}
  <div class="alert">{form.message}</div>
{/if}

{#if form?.success}
  <div class="success">Thanks! Your suggestion has been received.</div>
{/if}

<form method="POST" class="form section">
  <div class="form-row">
    <label class="label" for="youtubeUrl">YouTube URL</label>
    <input class="input" id="youtubeUrl" name="youtubeUrl" type="url" required />
  </div>

  <div class="form-row">
    <label class="label" for="category">Category</label>
    <input class="input" id="category" name="category" placeholder="Music, News, Drama..." />
  </div>

  <div class="form-row">
    <label class="label" for="language">Language</label>
    <select class="select" id="language" name="language">
      <option value="">Not sure</option>
      <option value="am">Amharic</option>
      <option value="om">Oromo</option>
      <option value="ti">Tigrinya</option>
      <option value="en">English</option>
      <option value="fr">French</option>
    </select>
  </div>

  <div class="form-row">
    <label class="label" for="email">Email optional</label>
    <input class="input" id="email" name="email" type="email" />
  </div>

  <div class="form-row">
    <label class="label" for="message">Message optional</label>
    <textarea class="textarea" id="message" name="message" rows="5"></textarea>
  </div>

  <button class="button" type="submit">Submit</button>
</form>
