<script lang="ts">
  import { avatarOptions } from "$lib/user-profile";

  let { data, form } = $props();
  const values = $derived((form?.values ?? {}) as Record<string, string>);
  const otpEmail = $derived((form?.email ?? values.email ?? "") as string);
</script>

<svelte:head>
  <title>Create account | EthioVideos</title>
</svelte:head>

<section class="account-page">
  <div class="account-heading">
    <h1>Create account</h1>
    <p class="muted">Create your EthioVideos profile.</p>
  </div>

  {#if form?.message}
    <div class={form.success ? "success" : "alert"}>{form.message}</div>
  {/if}

  {#if data.socialProviders.length}
    <div class="social-panel">
      {#each data.socialProviders as provider}
        <form method="POST" action="?/social">
          <input type="hidden" name="providerId" value={provider.id} />
          <input type="hidden" name="redirectTo" value="/profile" />
          <button class="button secondary" type="submit">
            Continue with {provider.label}
          </button>
        </form>
      {/each}
    </div>
  {/if}

  {#if form?.success && otpEmail}
    <form method="POST" action="?/verify" class="otp-form">
      <input type="hidden" name="providerId" value="email-otp" />
      <input type="hidden" name="redirectTo" value="/profile" />
      <label class="form-row">
        <span class="label">Email</span>
        <input class="input" type="email" name="email" value={otpEmail} readonly />
      </label>
      <label class="form-row">
        <span class="label">Validation code</span>
        <input
          class="input"
          name="code"
          inputmode="numeric"
          autocomplete="one-time-code"
          minlength="6"
          maxlength="6"
          required
        />
      </label>
      {#if form.debugCode}
        <p class="muted">Development code: {form.debugCode}</p>
      {/if}
      <button class="button" type="submit">Validate email</button>
    </form>
  {/if}

  <form method="POST" class="profile-form">
    <div class="form-grid">
      <label class="form-row">
        <span class="label">First name</span>
        <input
          class="input"
          name="firstName"
          autocomplete="given-name"
          value={values.firstName ?? ""}
          required
        />
      </label>

      <label class="form-row">
        <span class="label">Last name</span>
        <input
          class="input"
          name="lastName"
          autocomplete="family-name"
          value={values.lastName ?? ""}
          required
        />
      </label>
    </div>

    <div class="form-grid">
      <label class="form-row">
        <span class="label">Birth date</span>
        <input
          class="input"
          type="date"
          name="birthDate"
          value={values.birthDate ?? ""}
        />
      </label>

      <label class="form-row">
        <span class="label">Email</span>
        <input
          class="input"
          type="email"
          name="email"
          autocomplete="email"
          value={values.email ?? ""}
          required
        />
      </label>
    </div>

    <label class="form-row">
      <span class="label">Address</span>
      <input
        class="input"
        name="address"
        autocomplete="street-address"
        value={values.address ?? ""}
      />
    </label>

    <div class="form-grid">
      <label class="form-row">
        <span class="label">Username</span>
        <input
          class="input"
          name="username"
          autocomplete="nickname"
          value={values.username ?? ""}
          required
        />
      </label>

      <label class="form-row">
        <span class="label">Avatar</span>
        <select class="select" name="avatar" value={values.avatar ?? "classic"}>
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
        value={values.image ?? ""}
      />
    </label>

    <button class="button" type="submit">Create account</button>
  </form>
</section>

<style>
  .account-page {
    display: grid;
    gap: 1.5rem;
    margin-inline: auto;
    max-width: 760px;
    padding-block: 2rem;
  }

  .account-heading {
    display: grid;
    gap: 0.5rem;
  }

  .account-heading h1 {
    font-size: clamp(2rem, 4vw, 3rem);
    line-height: 1;
    margin: 0;
  }

  .profile-form {
    background: var(--ev-white);
    border: 1px solid var(--ev-border);
    border-radius: 8px;
    display: grid;
    gap: 1rem;
    padding: clamp(1rem, 3vw, 1.5rem);
  }

  .otp-form {
    background: var(--ev-white);
    border: 1px solid var(--ev-border);
    border-radius: 8px;
    display: grid;
    gap: 1rem;
    padding: clamp(1rem, 3vw, 1.5rem);
  }

  .social-panel {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  }

  .social-panel form,
  .social-panel button {
    width: 100%;
  }

  .form-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
