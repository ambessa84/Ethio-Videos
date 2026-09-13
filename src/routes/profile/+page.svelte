<script lang="ts">
  import ProfileAccount from "$lib/components/account/ProfileAccount.svelte";

  let { data, form } = $props();
  const user = $derived(form?.user ?? data.user);
  const missingFields = $derived(form?.missingFields ?? data.missingFields ?? []);
  const redirectTo = $derived((form?.redirectTo ?? data.redirectTo) as string);
  const values = $derived((form?.values ?? {}) as Record<string, string>);
</script>

<svelte:head>
  <title>Profile | EthioVideos</title>
</svelte:head>

<ProfileAccount
  {user}
  {missingFields}
  {redirectTo}
  values={values}
  message={form?.message}
  success={Boolean(form?.success)}
/>
