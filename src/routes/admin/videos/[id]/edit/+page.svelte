<script lang="ts">
  let { data, form } = $props();

  let video = $derived(data.video);
</script>

<h1>Edit video</h1>

{#if form?.message}
  <div class="alert">{form.message}</div>
{/if}

{#if form?.success}
  <div class="success">Saved.</div>
{/if}

<div class="two-col section">
  <form method="POST" action="?/save" class="form">
    <div class="form-row">
      <label class="label" for="title">Title</label>
      <input
        class="input"
        id="title"
        name="title"
        value={video.title}
        required
      />
    </div>

    <div class="form-row">
      <label class="label" for="slug">Slug</label>
      <input class="input" id="slug" name="slug" value={video.slug} />
    </div>

    <div class="form-row">
      <label class="label" for="categoryId">Category</label>
      <select class="select" id="categoryId" name="categoryId">
        <option value="">No category</option>
        {#each data.categories as category}
          <option
            value={category.id}
            selected={video.categoryId === category.id}>{category.name}</option
          >
        {/each}
      </select>
    </div>

    <div class="form-row">
      <label class="label" for="language">Language</label>
      <select class="select" id="language" name="language">
        <option value="">Not defined</option>
        <option value="am" selected={video.language === "am"}>Amharic</option>
        <option value="om" selected={video.language === "om"}>Oromo</option>
        <option value="ti" selected={video.language === "ti"}>Tigrinya</option>
        <option value="en" selected={video.language === "en"}>English</option>
        <option value="fr" selected={video.language === "fr"}>French</option>
      </select>
    </div>

    <div class="form-row">
      <label class="label" for="summary">Summary</label>
      <textarea class="textarea" id="summary" name="summary" rows="8"
        >{video.summary || ""}</textarea
      >
    </div>

    <div class="form-row">
      <label class="label" for="status">Status</label>
      <select class="select" id="status" name="status">
        <option value="DRAFT" selected={video.status === "DRAFT"}>Draft</option>
        <option value="PUBLISHED" selected={video.status === "PUBLISHED"}
          >Published</option
        >
        <option value="ARCHIVED" selected={video.status === "ARCHIVED"}
          >Archived</option
        >
      </select>
    </div>

    <label>
      <input type="checkbox" name="isFeatured" checked={video.isFeatured} />
      Featured
    </label>

    <button class="button" type="submit">Save</button>
  </form>

  <aside>
    <div class="video-player">
      <iframe
        src={`https://www.youtube.com/embed/${video.youtubeVideoId}`}
        title={video.title}
        allowfullscreen
      ></iframe>
    </div>

    <p class="muted">
      <a href={`/video/${video.slug}`} target="_blank" rel="noopener noreferrer"
        >View public page</a
      >
      ·
      <a
        href={`https://www.youtube.com/watch?v=${video.youtubeVideoId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        YouTube
      </a>
    </p>

    <form method="POST" action="?/delete">
      <button class="button secondary" type="submit">Delete video</button>
    </form>
  </aside>
</div>
