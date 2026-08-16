import type { Meta, StoryObj } from "@storybook/sveltekit";

import SpacingFoundation from "./SpacingFoundation.svelte";

const meta = {
  title: "Foundations/Spacing",
  component: SpacingFoundation,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SpacingFoundation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Scale: Story = {};
