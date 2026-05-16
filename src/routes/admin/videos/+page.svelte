<script lang="ts">
  let { data } = $props();
</script>

<h1>Videos</h1>

<p><a class="button" href="/admin/videos/new">Add video</a></p>

<div class="section" style="overflow-x:auto">
  <table class="table">
    <thead>
      <tr>
        <th>Video</th>
        <th>Category</th>
        <th>Status</th>
        <th>Featured</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each data.videos as video}
        <tr>
          <td>
            <strong>{video.title}</strong>
            <div class="muted">{video.channel?.title}</div>
          </td>
          <td>{video.category?.name || '-'}</td>
          <td>{video.status}</td>
          <td>{video.isFeatured ? 'Yes' : 'No'}</td>
          <td><a href={`/admin/videos/${video.id}/edit`}>Edit</a></td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
