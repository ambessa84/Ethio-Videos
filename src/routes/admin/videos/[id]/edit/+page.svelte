<script lang="ts">
  let { data, form } = $props();

  let video = $derived(data.video);
  let aiKeyPoints = $derived(parseJsonArray(video.aiKeyPoints));
  let aiTags = $derived(parseJsonArray(video.aiTags));
  let hasAiShortSummary = $derived(Boolean(video.aiShortSummary?.trim()));
  let aiGeneratedAt = $derived(
    video.aiGeneratedAt ? new Date(video.aiGeneratedAt).toLocaleString() : "-"
  );

  function parseJsonArray(value: string | null | undefined): string[] {
    try {
      const parsed = JSON.parse(value ?? "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
</script>

<h1>Edit video</h1>

{#if form?.message}
  <div class={form?.success ? "success" : "alert"}>{form.message}</div>
{/if}

{#if form?.success && !form?.message}
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

<section class="panel section">
  <h2>AI Summary</h2>

  <div class="grid" style="gap: 0.75rem">
    <p>
      <strong>Status:</strong>
      {video.aiStatus}
    </p>
    <p>
      <strong>Generated:</strong>
      {aiGeneratedAt}
    </p>
    <p>
      <strong>Needs human review:</strong>
      {video.aiNeedsHumanReview ? "Yes" : "No"}
    </p>
    <p>
      <strong>Confidence:</strong>
      {video.aiConfidence ?? "-"}
    </p>
  </div>

  {#if video.aiError}
    <div class="alert">{video.aiError}</div>
  {/if}

  <div class="form">
    <div class="form-row">
      <span class="label">Short summary</span>
      <p class="muted" style="white-space: pre-line">
        {video.aiShortSummary || "Not generated yet."}
      </p>
    </div>

    <div class="form-row">
      <span class="label">Long summary</span>
      <p class="muted" style="white-space: pre-line">
        {video.aiLongSummary || "Not generated yet."}
      </p>
    </div>

    <div class="form-row">
      <span class="label">Key points</span>
      {#if aiKeyPoints.length}
        <ul>
          {#each aiKeyPoints as point}
            <li>{point}</li>
          {/each}
        </ul>
      {:else}
        <p class="muted">No key points generated.</p>
      {/if}
    </div>

    <div class="form-row">
      <span class="label">Tags</span>
      {#if aiTags.length}
        <p>{aiTags.join(", ")}</p>
      {:else}
        <p class="muted">No tags generated.</p>
      {/if}
    </div>

    <div class="form-row">
      <span class="label">SEO title</span>
      <p class="muted">{video.aiSeoTitle || "-"}</p>
    </div>

    <div class="form-row">
      <span class="label">SEO description</span>
      <p class="muted">{video.aiSeoDescription || "-"}</p>
    </div>

    <div class="form-row">
      <span class="label">Detected language</span>
      <p class="muted">{video.aiLanguage || "-"}</p>
    </div>

    <div class="form-row">
      <span class="label">Suggested category</span>
      <p class="muted">{video.aiCategorySuggestion || "-"}</p>
    </div>
  </div>

  <form method="POST" action="?/generateAiSummary" class="form section">
    <div class="form-row">
      <label class="label" for="outputLanguage">Output language</label>
      <select class="select" id="outputLanguage" name="outputLanguage">
        <option value="fr">fr</option>
        <option value="en">en</option>
        <option value="am">am</option>
      </select>
    </div>

    <button class="button" type="submit">Generate AI Summary</button>
  </form>

  <form method="POST" action="?/applyAiSummary" class="form">
    <button class="button secondary" type="submit" disabled={!hasAiShortSummary}>
      Copy AI short summary to public summary
    </button>
  </form>
</section>
