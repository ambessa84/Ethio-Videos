<script lang="ts">
  import LoginPage from "../../login/+page.svelte";

  let props = $props();
</script>

<LoginPage {...props} />
