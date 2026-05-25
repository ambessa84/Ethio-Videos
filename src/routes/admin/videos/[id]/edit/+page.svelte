<script lang="ts">
  let { data, form } = $props();

  let video = $derived(data.video);
  let aiMetadata = $derived(data.aiMetadata);
  let aiMetadataLanguage = $derived(data.aiMetadataLanguage);
  let aiSlug = $derived(aiMetadata?.slug ?? video.slug);
  let aiShortSummary = $derived(
    aiMetadata?.shortSummary ?? video.aiShortSummary,
  );
  let aiLongSummary = $derived(aiMetadata?.longSummary ?? video.aiLongSummary);
  let aiSeoTitle = $derived(aiMetadata?.seoTitle ?? video.aiSeoTitle);
  let aiSeoDescription = $derived(
    aiMetadata?.seoDescription ?? video.aiSeoDescription,
  );
  let aiDetectedLanguage = $derived(
    aiMetadata?.detectedLanguage ?? video.aiLanguage,
  );
  let aiCategorySuggestion = $derived(
    aiMetadata?.categorySuggestion ?? video.aiCategorySuggestion,
  );
  let aiConfidence = $derived(aiMetadata?.confidence ?? video.aiConfidence);
  let aiNeedsHumanReview = $derived(
    aiMetadata?.needsHumanReview ?? video.aiNeedsHumanReview,
  );
  let aiStatus = $derived(aiMetadata?.status ?? video.aiStatus);
  let aiError = $derived(aiMetadata?.error ?? video.aiError);
  let aiKeyPoints = $derived(
    parseJsonArray(aiMetadata?.keyPoints ?? video.aiKeyPoints),
  );
  let aiTags = $derived(parseJsonArray(aiMetadata?.tags ?? video.aiTags));
  let aiKeyPointsText = $derived(aiKeyPoints.join("\n"));
  let aiTagsText = $derived(aiTags.join(", "));
  let publicTags = $derived(
    video.tags?.map((videoTag) => videoTag.tag.name).join(", ") ?? "",
  );
  let hasAiShortSummary = $derived(Boolean(aiShortSummary?.trim()));
  let hasAiTags = $derived(aiTags.length > 0);
  let aiGeneratedAt = $derived(
    aiMetadata?.generatedAt
      ? new Date(aiMetadata.generatedAt).toLocaleString()
      : video.aiGeneratedAt
        ? new Date(video.aiGeneratedAt).toLocaleString()
        : "-",
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
      <label class="label" for="tags">Tags</label>
      <input
        class="input"
        id="tags"
        name="tags"
        value={publicTags}
        placeholder="reprise, amharic, diaspora"
      />
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

  <div class="pills">
    {#each ["fr", "en", "am"] as language}
      <a
        class:active={aiMetadataLanguage === language}
        class="pill"
        href={`?aiLanguage=${language}`}>{language}</a
      >
    {/each}
  </div>

  <div class="grid" style="gap: 0.75rem">
    <p>
      <strong>Metadata language:</strong>
      {aiMetadataLanguage}
    </p>
    <p>
      <strong>Status:</strong>
      {aiStatus}
    </p>
    <p>
      <strong>Generated:</strong>
      {aiGeneratedAt}
    </p>
    <p>
      <strong>Needs human review:</strong>
      {aiNeedsHumanReview ? "Yes" : "No"}
    </p>
    <p>
      <strong>Confidence:</strong>
      {aiConfidence ?? "-"}
    </p>
  </div>

  {#if aiError}
    <div class="alert">{aiError}</div>
  {/if}

  <form method="POST" action="?/saveAiSummary" class="form">
    <input type="hidden" name="aiMetadataLanguage" value={aiMetadataLanguage} />

    <div class="form-row">
      <label class="label" for="aiSlug">Localized slug</label>
      <input class="input" id="aiSlug" name="aiSlug" value={aiSlug} />
    </div>

    <div class="form-row">
      <label class="label" for="aiShortSummary">Short summary</label>
      <textarea
        class="textarea"
        id="aiShortSummary"
        name="aiShortSummary"
        rows="4">{aiShortSummary || ""}</textarea
      >
    </div>

    <div class="form-row">
      <label class="label" for="aiLongSummary">Long summary</label>
      <textarea
        class="textarea"
        id="aiLongSummary"
        name="aiLongSummary"
        rows="7">{aiLongSummary || ""}</textarea
      >
    </div>

    <div class="form-row">
      <label class="label" for="aiKeyPoints">Key points</label>
      <textarea
        class="textarea"
        id="aiKeyPoints"
        name="aiKeyPoints"
        rows="5">{aiKeyPointsText}</textarea
      >
    </div>

    <div class="form-row">
      <label class="label" for="aiTags">Tags</label>
      <input class="input" id="aiTags" name="aiTags" value={aiTagsText} />
    </div>

    <div class="form-row">
      <label class="label" for="aiSeoTitle">SEO title</label>
      <input
        class="input"
        id="aiSeoTitle"
        name="aiSeoTitle"
        value={aiSeoTitle || ""}
      />
    </div>

    <div class="form-row">
      <label class="label" for="aiSeoDescription">SEO description</label>
      <textarea
        class="textarea"
        id="aiSeoDescription"
        name="aiSeoDescription"
        rows="3">{aiSeoDescription || ""}</textarea
      >
    </div>

    <div class="form-row">
      <label class="label" for="aiLanguage">Detected language</label>
      <select class="select" id="aiLanguage" name="aiLanguage">
        <option value="">Not defined</option>
        <option value="am" selected={aiDetectedLanguage === "am"}>am</option>
        <option value="om" selected={aiDetectedLanguage === "om"}>om</option>
        <option value="ti" selected={aiDetectedLanguage === "ti"}>ti</option>
        <option value="en" selected={aiDetectedLanguage === "en"}>en</option>
        <option value="fr" selected={aiDetectedLanguage === "fr"}>fr</option>
        <option value="unknown" selected={aiDetectedLanguage === "unknown"}
          >unknown</option
        >
      </select>
    </div>

    <div class="form-row">
      <label class="label" for="aiCategorySuggestion">Suggested category</label>
      <select
        class="select"
        id="aiCategorySuggestion"
        name="aiCategorySuggestion"
      >
        <option value="">Not defined</option>
        {#each ["News", "Music", "Drama", "Comedy", "Religion", "Diaspora", "Business", "Culture", "Sport", "Other"] as category}
          <option
            value={category}
            selected={aiCategorySuggestion === category}>{category}</option
          >
        {/each}
      </select>
    </div>

    <div class="form-row">
      <label class="label" for="aiConfidence">Confidence</label>
      <input
        class="input"
        id="aiConfidence"
        name="aiConfidence"
        type="number"
        min="0"
        max="1"
        step="0.01"
        value={aiConfidence ?? ""}
      />
    </div>

    <label>
      <input
        type="checkbox"
        name="aiNeedsHumanReview"
        checked={aiNeedsHumanReview}
      />
      Needs human review
    </label>

    <button class="button" type="submit">Save AI metadata</button>
  </form>

  <form method="POST" action="?/generateAiSummary" class="form section">
    <div class="form-row">
      <label class="label" for="outputLanguage">Output language</label>
      <select class="select" id="outputLanguage" name="outputLanguage">
        <option value="fr" selected={aiMetadataLanguage === "fr"}>fr</option>
        <option value="en" selected={aiMetadataLanguage === "en"}>en</option>
        <option value="am" selected={aiMetadataLanguage === "am"}>am</option>
      </select>
    </div>

    <button class="button" type="submit">Generate AI Summary</button>
  </form>

  <form method="POST" action="?/applyAiSummary" class="form">
    <input type="hidden" name="aiMetadataLanguage" value={aiMetadataLanguage} />
    <button
      class="button secondary"
      type="submit"
      disabled={!hasAiShortSummary}
    >
      Copy AI short summary to public summary
    </button>
  </form>

  <form method="POST" action="?/applyAiTags" class="form">
    <input type="hidden" name="aiMetadataLanguage" value={aiMetadataLanguage} />
    <button class="button secondary" type="submit" disabled={!hasAiTags}>
      Copy AI tags to public tags
    </button>
  </form>
</section>
