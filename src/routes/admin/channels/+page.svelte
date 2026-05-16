<script lang="ts">
  let { data } = $props();
</script>

<h1>Channels</h1>

<div class="section" style="overflow-x:auto">
  <table class="table">
    <thead>
      <tr>
        <th>Channel</th>
        <th>YouTube ID</th>
        <th>Videos</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each data.channels as channel}
        <tr>
          <td>{channel.title}</td>
          <td>{channel.youtubeChannelId}</td>
          <td>{channel._count.videos}</td>
          <td><a href={`/channel/${channel.slug}`}>View</a></td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
