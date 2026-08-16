import type { Meta, StoryObj } from "@storybook/sveltekit";

import CategoryRail from "./CategoryRail.svelte";

const meta = {
  title: "Home/CategoryRail",
  component: CategoryRail,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof CategoryRail>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
