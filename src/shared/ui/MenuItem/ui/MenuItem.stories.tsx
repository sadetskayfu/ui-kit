import { Meta, StoryObj } from "@storybook/react";
import { MenuItem } from "./MenuItem";
import { Arrow, Envelope, Gear } from "@/shared/assets/icons";

const meta: Meta<typeof MenuItem> = {
  title: "shared/MenuItem",
  component: MenuItem,
  args: {
    role: 'menuitem',
  },
  argTypes: {
    onClick: { action: "clicked" },
  }
}

export default meta;

type Story = StoryObj<typeof MenuItem>

export const Default: Story = {
    args: {
        label: 'Default'
    }
};

export const WithStartIcon: Story = {
    args: {
        StartIcon: <Gear />,
        label: 'With start icon'
    }
}

export const WithEndIcon: Story = {
    args: {
        EndIcon: <Arrow />,
        label: 'With end icon'
    }
}

export const WithStartAndEndIcon: Story = {
    args: {
        label: 'With description',
        description: 'Text text text text1 text 32 text 44 text pppppp dddd text 45',
        StartIcon: <Envelope />,
        EndIcon: <Arrow />
     }
}

export const LinkMenuItem: Story = {
  args: {
    to: '/example',
    label: 'I am link',
  }
};

export const ExternalLinkMenuItem: Story = {
  args: {
    href: "https://example.com",
    label: 'I am external link'
  }
};




