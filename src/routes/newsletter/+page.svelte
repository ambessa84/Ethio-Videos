<script lang="ts">
  let { form } = $props();
</script>

<svelte:head>
  <title>Newsletter | EthioVideos</title>
</svelte:head>

<h1>Newsletter</h1>
<p class="muted">Receive the best Ethiopian videos by email.</p>

{#if form?.message}
  <div class="alert">{form.message}</div>
{/if}

{#if form?.success}
  <div class="success">You are subscribed.</div>
{/if}

<form method="POST" class="form section">
  <div class="form-row">
    <label class="label" for="email">Email</label>
    <input class="input" id="email" name="email" type="email" required />
  </div>

  <div class="form-row">
    <label class="label" for="language">Preferred language</label>
    <select class="select" id="language" name="language">
      <option value="">No preference</option>
      <option value="en">English</option>
      <option value="fr">French</option>
      <option value="am">Amharic</option>
    </select>
  </div>

  <button class="button" type="submit">Subscribe</button>
</form>
