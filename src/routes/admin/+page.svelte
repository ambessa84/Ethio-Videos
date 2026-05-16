<script lang="ts">
  let { data } = $props();
</script>

<h1>Dashboard</h1>

<div class="grid video-grid section">
  <div class="panel">
    <h2>{data.videos}</h2>
    <p>Total videos</p>
  </div>

  <div class="panel">
    <h2>{data.publishedVideos}</h2>
    <p>Published</p>
  </div>

  <div class="panel">
    <h2>{data.draftVideos}</h2>
    <p>Drafts</p>
  </div>

  <div class="panel">
    <h2>{data.suggestions}</h2>
    <p>Pending suggestions</p>
  </div>

  <div class="panel">
    <h2>{data.subscribers}</h2>
    <p>Newsletter subscribers</p>
  </div>
</div>
