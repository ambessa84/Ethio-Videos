import type { Meta, StoryObj } from "@storybook/sveltekit";
import AdSlot from "./AdSlot.svelte";

const meta = {
  title: "Components/AdSlot",
  component: AdSlot,
  tags: ["autodocs"],
  args: {
    label: "Publicité",
    minHeight: "120px",
  },
} satisfies Meta<typeof AdSlot>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Placeholder: Story = {};

export const DirectSponsor: Story = {
  args: {
    providerOverride: "direct",
    directTitle: "Sponsor EthioVideos",
    directHref: "/fr/proposer-video",
  },
};
