import type { Meta, StoryObj } from "@storybook/sveltekit";

import FeaturedVideo from "./FeaturedVideo.svelte";

const meta = {
  title: "Home/FeaturedVideo",
  component: FeaturedVideo,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof FeaturedVideo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
