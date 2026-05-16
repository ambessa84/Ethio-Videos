<script lang="ts">
  let { data, form } = $props();
</script>

<h1>Categories</h1>

{#if form?.message}
  <div class="alert">{form.message}</div>
{/if}

{#if form?.success}
  <div class="success">Category created.</div>
{/if}

<form method="POST" action="?/create" class="form section">
  <div class="form-row">
    <label class="label" for="name">Name</label>
    <input class="input" id="name" name="name" required />
  </div>

  <div class="form-row">
    <label class="label" for="description">Description</label>
    <textarea class="textarea" id="description" name="description" rows="3"></textarea>
  </div>

  <button class="button" type="submit">Create category</button>
</form>

<div class="section" style="overflow-x:auto">
  <table class="table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Slug</th>
        <th>Videos</th>
      </tr>
    </thead>
    <tbody>
      {#each data.categories as category}
        <tr>
          <td>{category.name}</td>
          <td>{category.slug}</td>
          <td>{category._count.videos}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
