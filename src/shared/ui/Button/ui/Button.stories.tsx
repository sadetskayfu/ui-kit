import { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { Icon } from "@/shared/ui/Icon";

const meta: Meta<typeof Button> = {
  title: "shared/Button",
  component: Button,
  args: {
    variant: "filled",
    color: "primary",
    size: "medium",
    disabled: false,
  },
  argTypes: {
    onClick: { action: "clicked" },
  }
}

export default meta;

type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    children: 'Default button'
  }

};

export const WithStartIcon: Story = {
    args: {
        StartIcon: <Icon variant="gear"/>,
        children: 'With start icon'
    }
};

export const WithEndIcon: Story = {
    args: {
        EndIcon: <Icon variant="gear"/>,
        children: 'With end icon'
    }
};

export const LinkButton: Story = {
  args: {
    to: '/example',
    children: 'Link button'
  }
};

export const ExternalLinkButton: Story = {
  args: {
    href: "https://example.com",
    children: 'External link button'
  }
};
