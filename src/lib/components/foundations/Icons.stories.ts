import type { Meta, StoryObj } from "@storybook/sveltekit";

import IconsFoundation from "./IconsFoundation.svelte";

const meta = {
  title: "Foundations/Icons",
  component: IconsFoundation,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof IconsFoundation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Inventory: Story = {};
