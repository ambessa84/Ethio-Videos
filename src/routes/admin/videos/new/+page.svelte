<script lang="ts">
  let { data, form } = $props();
</script>

<h1>Add YouTube video</h1>

{#if form?.message}
  <div class="alert">{form.message}</div>
{/if}

<form method="POST" class="form section">
  <div class="form-row">
    <label class="label" for="youtubeUrl">YouTube URL</label>
    <input
      class="input"
      id="youtubeUrl"
      name="youtubeUrl"
      type="url"
      required
      placeholder="https://www.youtube.com/watch?v=..."
    />
  </div>

  <div class="form-row">
    <label class="label" for="categoryId">Category</label>
    <select class="select" id="categoryId" name="categoryId">
      <option value="">No category</option>
      {#each data.categories as category}
        <option value={category.id}>{category.name}</option>
      {/each}
    </select>
  </div>

  <div class="form-row">
    <label class="label" for="language">Language</label>
    <select class="select" id="language" name="language">
      <option value="">Not defined</option>
      <option value="am">Amharic</option>
      <option value="om">Oromo</option>
      <option value="ti">Tigrinya</option>
      <option value="en">English</option>
      <option value="fr">French</option>
    </select>
  </div>

  <div class="form-row">
    <label class="label" for="summary">Summary</label>
    <textarea class="textarea" id="summary" name="summary" rows="6"></textarea>
  </div>

  <div class="form-row">
    <label class="label" for="status">Status</label>
    <select class="select" id="status" name="status">
      <option value="DRAFT">Draft</option>
      <option value="PUBLISHED">Published</option>
    </select>
  </div>

  <label>
    <input type="checkbox" name="isFeatured" />
    Featured
  </label>

  <button class="button" type="submit">Add video</button>
</form>
