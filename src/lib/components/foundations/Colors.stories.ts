import type { Meta, StoryObj } from "@storybook/sveltekit";

import ColorsFoundation from "./ColorsFoundation.svelte";

const meta = {
  title: "Foundations/Colors",
  component: ColorsFoundation,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ColorsFoundation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Palette: Story = {};
