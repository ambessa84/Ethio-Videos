<script lang="ts">
  import { avatarOptions } from "$lib/user-profile";

  type MissingField = {
    key: string;
    label: string;
  };

  let {
    user,
    missingFields = [],
    redirectTo = "/",
    message = "",
    success = false,
    values = {},
  }: {
    user: {
      email?: string | null;
      emailVerified?: Date | string | null;
      firstName?: string | null;
      lastName?: string | null;
      name?: string | null;
      birthDate?: Date | string | null;
      address?: string | null;
      username?: string | null;
      image?: string | null;
      avatar?: string | null;
      role?: string | null;
    };
    missingFields?: MissingField[];
    redirectTo?: string;
    message?: string;
    success?: boolean;
    values?: Record<string, string>;
  } = $props();

  const displayName = $derived(
    user.name || [user.firstName, user.lastName].filter(Boolean).join(" "),
  );
  const accountLabel = $derived(user.email ?? "Social account");
  const birthDateValue = $derived(
    values.birthDate ??
      (user.birthDate
        ? new Date(user.birthDate).toISOString().slice(0, 10)
        : ""),
  );
</script>

<section class="profile-page">
  <div class="profile-summary">
    <div class="avatar" aria-hidden="true">
      {#if user.image}
        <img src={user.image} alt="" />
      {:else}
        <span>{(displayName || accountLabel).slice(0, 1).toUpperCase()}</span>
      {/if}
    </div>
    <div>
      <h1>{displayName || user.username || "Mon profil"}</h1>
      <p class="muted">@{user.username || "pseudo"} / {accountLabel}</p>
    </div>
  </div>

  {#if message}
    <div class={success ? "success" : "alert"}>{message}</div>
  {/if}

  {#if missingFields.length}
    <section class="completion-panel" aria-labelledby="completion-title">
      <div>
        <h2 id="completion-title">Completer mon profil</h2>
        <p class="muted">
          Ajoutez les informations restantes pour personnaliser votre compte.
        </p>
      </div>
      <div class="missing-fields" aria-label="Champs manquants">
        {#each missingFields as field}
          <span>{field.label}</span>
        {/each}
      </div>
    </section>
  {/if}

  <form method="POST" class="profile-form">
    <input type="hidden" name="redirectTo" value={redirectTo} />

    <div class="form-grid">
      <label class="form-row">
        <span class="label">First name</span>
        <input
          class="input"
          name="firstName"
          autocomplete="given-name"
          value={values.firstName ?? user.firstName ?? ""}
        />
      </label>

      <label class="form-row">
        <span class="label">Last name</span>
        <input
          class="input"
          name="lastName"
          autocomplete="family-name"
          value={values.lastName ?? user.lastName ?? ""}
        />
      </label>
    </div>

    <div class="form-grid">
      <label class="form-row">
        <span class="label">Birth date</span>
        <input class="input" type="date" name="birthDate" value={birthDateValue} />
      </label>

      <label class="form-row">
        <span class="label">Email</span>
        <input class="input" type="email" value={accountLabel} readonly />
      </label>
    </div>

    <label class="form-row">
      <span class="label">Address</span>
      <input
        class="input"
        name="address"
        autocomplete="street-address"
        value={values.address ?? user.address ?? ""}
      />
    </label>

    <div class="form-grid">
      <label class="form-row">
        <span class="label">Username</span>
        <input
          class="input"
          name="username"
          autocomplete="nickname"
          value={values.username ?? user.username ?? ""}
        />
      </label>

      <label class="form-row">
        <span class="label">Avatar</span>
        <select
          class="select"
          name="avatar"
          value={values.avatar ?? user.avatar ?? "classic"}
        >
          {#each avatarOptions as avatar}
            <option value={avatar}>{avatar}</option>
          {/each}
        </select>
      </label>
    </div>

    <label class="form-row">
      <span class="label">Profile photo URL</span>
      <input
        class="input"
        type="url"
        name="image"
        autocomplete="photo"
        value={values.image ?? user.image ?? ""}
      />
    </label>

    <div class="profile-actions">
      <button class="button secondary" name="intent" value="save" type="submit">
        Enregistrer
      </button>
      <button class="button" name="intent" value="continue" type="submit">
        Enregistrer et continuer
      </button>
      {#if redirectTo !== "/"}
        <a class="skip-link" href={redirectTo}>Plus tard</a>
      {/if}
    </div>
  </form>

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

  .profile-form,
  .completion-panel,
  .profile-details {
    background: var(--ev-white);
    border: 1px solid var(--ev-border);
    border-radius: 8px;
  }

  .profile-form {
    display: grid;
    gap: 1rem;
    padding: clamp(1rem, 3vw, 1.5rem);
  }

  .completion-panel {
    background: color-mix(in srgb, var(--ev-gold) 12%, var(--ev-white));
    border-color: color-mix(in srgb, var(--ev-gold) 45%, var(--ev-border));
    display: grid;
    gap: 1rem;
    padding: clamp(1rem, 3vw, 1.5rem);
  }

  .completion-panel h2 {
    font-size: 1.35rem;
    margin: 0 0 0.35rem;
  }

  .missing-fields,
  .profile-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .missing-fields span {
    background: var(--ev-white);
    border: 1px solid var(--ev-border);
    border-radius: 999px;
    color: var(--ev-ink);
    font-size: 0.82rem;
    font-weight: 800;
    padding: 0.35rem 0.65rem;
  }

  .form-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .profile-actions {
    align-items: center;
    gap: 0.75rem;
  }

  .skip-link {
    color: var(--ev-muted);
    font-weight: 700;
    text-decoration: none;
  }

  .profile-details {
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

  @media (max-width: 640px) {
    .profile-summary {
      align-items: flex-start;
      flex-direction: column;
    }

    .form-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
