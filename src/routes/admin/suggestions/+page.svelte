<script lang="ts">
  let { data } = $props();
</script>

<h1>Video suggestions</h1>

<div class="section" style="overflow-x:auto">
  <table class="table">
    <thead>
      <tr>
        <th>URL</th>
        <th>Category</th>
        <th>Language</th>
        <th>Email</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {#each data.suggestions as suggestion}
        <tr>
          <td>
            <a href={suggestion.youtubeUrl} target="_blank" rel="noopener noreferrer">
              {suggestion.youtubeUrl}
            </a>
            {#if suggestion.message}
              <div class="muted">{suggestion.message}</div>
            {/if}
          </td>
          <td>{suggestion.category || '-'}</td>
          <td>{suggestion.language || '-'}</td>
          <td>{suggestion.email || '-'}</td>
          <td>{suggestion.status}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
