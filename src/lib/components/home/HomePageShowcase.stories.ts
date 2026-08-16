import type { Meta, StoryObj } from "@storybook/sveltekit";

import HomePageShowcase from "./HomePageShowcase.svelte";

const meta = {
  title: "Home/HomePageShowcase",
  component: HomePageShowcase,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof HomePageShowcase>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FrenchHomepage: Story = {};
