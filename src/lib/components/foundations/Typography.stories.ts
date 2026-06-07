import type { Meta, StoryObj } from "@storybook/sveltekit";

import TypographyFoundation from "./TypographyFoundation.svelte";

const meta = {
  title: "Foundations/Typography",
  component: TypographyFoundation,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof TypographyFoundation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Poppins: Story = {};
