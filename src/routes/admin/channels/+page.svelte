<script lang="ts">
  let { data, form } = $props();
</script>

<h1>Channels</h1>

<p><a class="button" href="/admin/channels/new">Add channel</a></p>

{#if form?.message}
  <div class={form.imported !== undefined ? 'success' : 'alert'}>
    {form.message}
  </div>
{/if}

<div class="section" style="overflow-x:auto">
  <table class="table">
    <thead>
      <tr>
        <th>Channel</th>
        <th>YouTube ID</th>
        <th>Uploads playlist</th>
        <th>Auto import</th>
        <th>Defaults</th>
        <th>Last import</th>
        <th>Videos</th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each data.channels as channel}
        <tr>
          <td>
            <strong>{channel.title}</strong>
            <div class="muted">{channel.status}</div>
          </td>
          <td>{channel.youtubeChannelId}</td>
          <td>{channel.uploadsPlaylistId || '-'}</td>
          <td>{channel.autoImportEnabled ? 'Yes' : 'No'}</td>
          <td>
            <div>{channel.defaultCategory?.name || 'No category'}</div>
            <div class="muted">
              {channel.defaultLanguage || 'No language'} · {channel.defaultStatus}
            </div>
          </td>
          <td>
            {channel.lastImportedAt
              ? new Date(channel.lastImportedAt).toLocaleString()
              : '-'}
          </td>
          <td>{channel._count.videos}</td>
          <td><a href={`/channel/${channel.slug}`}>View</a></td>
          <td>
            <form method="POST" action="?/import">
              <input type="hidden" name="channelId" value={channel.id} />
              <button class="button secondary" type="submit">
                Import latest videos
              </button>
            </form>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
