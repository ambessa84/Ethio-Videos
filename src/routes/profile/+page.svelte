<script lang="ts">
  let { data } = $props();
  const user = $derived(data.user);
  const displayName = $derived(
    user.name || [user.firstName, user.lastName].filter(Boolean).join(" "),
  );
</script>

<svelte:head>
  <title>Profile | EthioVideos</title>
</svelte:head>

<section class="profile-page">
  <div class="profile-summary">
    <div class="avatar" aria-hidden="true">
      {#if user.image}
        <img src={user.image} alt="" />
      {:else}
        <span>{(displayName || user.email).slice(0, 1).toUpperCase()}</span>
      {/if}
    </div>
    <div>
      <h1>{displayName || user.username}</h1>
      <p class="muted">@{user.username} / {user.email}</p>
    </div>
  </div>

  <dl class="profile-details">
    <div>
      <dt>Email status</dt>
      <dd>{user.emailVerified ? "Verified" : "Not verified"}</dd>
    </div>
    <div>
      <dt>Birth date</dt>
      <dd>
        {user.birthDate
          ? new Intl.DateTimeFormat("en").format(new Date(user.birthDate))
          : "-"}
      </dd>
    </div>
    <div>
      <dt>Address</dt>
      <dd>{user.address || "-"}</dd>
    </div>
    <div>
      <dt>Avatar</dt>
      <dd>{user.avatar || "classic"}</dd>
    </div>
    <div>
      <dt>Role</dt>
      <dd>{user.role}</dd>
    </div>
  </dl>
</section>

<style>
  .profile-page {
    display: grid;
    gap: 1.5rem;
    margin-inline: auto;
    max-width: 860px;
    padding-block: 2rem;
  }

  .profile-summary {
    align-items: center;
    background: var(--ev-white);
    border: 1px solid var(--ev-border);
    border-radius: 8px;
    display: flex;
    gap: 1rem;
    padding: clamp(1rem, 3vw, 1.5rem);
  }

  .avatar {
    align-items: center;
    aspect-ratio: 1;
    background: var(--ev-ink);
    border-radius: 8px;
    color: var(--ev-white);
    display: inline-flex;
    flex: 0 0 auto;
    font-size: 2rem;
    font-weight: 800;
    justify-content: center;
    overflow: hidden;
    width: 5rem;
  }

  .avatar img {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  h1 {
    font-size: clamp(1.8rem, 4vw, 3rem);
    line-height: 1;
    margin: 0;
  }

  .profile-details {
    background: var(--ev-white);
    border: 1px solid var(--ev-border);
    border-radius: 8px;
    display: grid;
    margin: 0;
  }

  .profile-details div {
    display: grid;
    gap: 0.35rem;
    padding: 1rem;
  }

  .profile-details div + div {
    border-top: 1px solid var(--ev-border);
  }

  dt {
    color: var(--ev-muted);
    font-size: 0.82rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  dd {
    margin: 0;
  }
</style>
