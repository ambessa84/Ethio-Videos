<script lang="ts">
  let { form } = $props();
</script>

<svelte:head>
  <title>Admin login | EthioVideos</title>
</svelte:head>

<h1>Admin login</h1>

{#if form?.message}
  <div class="alert">{form.message}</div>
{/if}

<form method="POST" class="form section">
  <div class="form-row">
    <label class="label" for="password">Password</label>
    <input class="input" id="password" name="password" type="password" required />
  </div>

  <button class="button" type="submit">Login</button>
</form>
