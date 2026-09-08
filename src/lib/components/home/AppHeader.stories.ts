import type { Meta, StoryObj } from "@storybook/sveltekit";

import AppHeader from "./AppHeader.svelte";

const navItems = [
  { label: "Tendances", href: "/fr/tendances" },
  { label: "Dernieres videos", href: "/fr/dernieres-videos" },
  { label: "Musique", href: "/fr/categories/music" },
  { label: "Actualites", href: "/fr/actualites" },
];

const meta = {
  title: "Home/AppHeader",
  component: AppHeader,
  parameters: {
    layout: "padded",
  },
  args: {
    brandHref: "/fr",
    navItems,
    searchAction: "/fr/recherche",
    searchLabel: "Rechercher",
    searchPlaceholder: "Rechercher des videos...",
  },
} satisfies Meta<typeof AppHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Guest: Story = {
  args: {
    accountHref: "/login?redirectTo=%2Ffr%2Factualites",
    accountLabel: "Connexion",
    accountVariant: "guest",
  },
};

export const User: Story = {
  args: {
    accountHref: "/profile",
    accountLabel: "Compte",
    accountVariant: "user",
  },
};

export const Admin: Story = {
  args: {
    accountHref: "/profile",
    accountLabel: "Compte",
    accountVariant: "user",
    navItems: [...navItems, { label: "Proposer", href: "/fr/proposer-video" }],
  },
};
