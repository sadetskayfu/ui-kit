import { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { Icon } from "@/shared/ui/Icon";

const meta: Meta<typeof Button> = {
  title: "shared/Button",
  component: Button,
  args: {
    children: 'Click me',
    variant: "filled",
    color: "primary",
    size: "medium",
  },
  argTypes: {
    onClick: { action: "clicked" },
  }
}

export default meta;

type Story = StoryObj<typeof Button>

export const Default: Story = {

};

export const WithStartIcon: Story = {
    args: {
        StartIcon: <Icon variant="gear"/>
    }
};

export const WithEndIcon: Story = {
    args: {
        EndIcon: <Icon variant="gear"/>
    }
};

export const Disabled: Story = {
  args: {
    disabled: true,
  }
};

export const LinkButton: Story = {
  args: {
    to: '/example'
  }
};

export const ExternalLinkButton: Story = {
  args: {
    href: "https://example.com",
  }
};
