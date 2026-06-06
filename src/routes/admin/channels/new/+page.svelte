<script lang="ts">
  let { data, form } = $props();
</script>

<h1>Add YouTube channel</h1>

{#if form?.message}
  <div class="alert">{form.message}</div>
{/if}

<form method="POST" class="form section">
  <div class="form-row">
    <label class="label" for="youtubeChannelId">YouTube channel ID</label>
    <input
      class="input"
      id="youtubeChannelId"
      name="youtubeChannelId"
      required
      placeholder="UC..."
    />
  </div>

  <div class="form-row">
    <label class="label" for="defaultCategoryId">Default category</label>
    <select class="select" id="defaultCategoryId" name="defaultCategoryId">
      <option value="">No category</option>
      {#each data.categories as category}
        <option value={category.id}>{category.name}</option>
      {/each}
    </select>
  </div>

  <div class="form-row">
    <label class="label" for="defaultLanguage">Default language</label>
    <select class="select" id="defaultLanguage" name="defaultLanguage">
      <option value="">Not defined</option>
      <option value="en" selected>English</option>
      <option value="am">Amharic</option>
      <option value="om">Oromo</option>
      <option value="ti">Tigrinya</option>
      <option value="fr">French</option>
    </select>
  </div>

  <div class="form-row">
    <label class="label" for="defaultStatus">Default status</label>
    <select class="select" id="defaultStatus" name="defaultStatus">
      <option value="DRAFT">Draft</option>
      <option value="PUBLISHED">Published</option>
    </select>
  </div>

  <label>
    <input type="checkbox" name="autoImportEnabled" />
    Enable automatic imports
  </label>

  <button class="button" type="submit">Add channel</button>
</form>
