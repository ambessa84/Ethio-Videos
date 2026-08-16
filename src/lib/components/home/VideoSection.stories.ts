import type { Meta, StoryObj } from "@storybook/sveltekit";

import VideoSection from "./VideoSection.svelte";

const meta = {
  title: "Home/VideoSection",
  component: VideoSection,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof VideoSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
