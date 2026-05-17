<script lang="ts">
  let { children } = $props();
</script>

<div class="admin-layout">
  <aside>
    <h2>Admin</h2>
    <nav class="admin-nav">
      <a href="/admin">Dashboard</a>
      <a href="/admin/videos">Videos</a>
      <a href="/admin/videos/new">Add video</a>
      <a href="/admin/categories">Categories</a>
      <a href="/admin/channels">Channels</a>
      <a href="/admin/suggestions">Suggestions</a>
      <form method="POST" action="/admin/logout">
        <input type="hidden" name="redirectTo" value="/admin/login" />
        <button type="submit">Logout</button>
      </form>
    </nav>
  </aside>

  <section>
    {@render children()}
  </section>
</div>
