<script lang="ts">
  import '../app.css';

  let { children } = $props();
</script>

<div>
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="/">EthioVideos</a>

      <nav class="nav">
        <a href="/trending">Trending</a>
        <a href="/latest">Latest</a>
        <a href="/category/music">Music</a>
        <a href="/category/news">News</a>
        <a href="/submit-video">Submit</a>
      </nav>

      <form class="search-form header-search" action="/search" method="GET">
        <input class="search-input" name="q" type="search" placeholder="Search videos..." />
        <button class="button secondary" type="submit">Search</button>
      </form>
    </div>
  </header>

  <main class="container main">
    {@render children()}
  </main>

  <footer class="footer">
    <div class="container">
      <p>© 2026 EthioVideos. Videos are embedded from YouTube.</p>
      <p>
        <a href="/newsletter">Newsletter</a> ·
        <a href="/submit-video">Submit a video</a> ·
        <a href="/admin/login">Admin</a>
      </p>
    </div>
  </footer>
</div>
