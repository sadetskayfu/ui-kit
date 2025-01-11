import { Meta, StoryObj } from "@storybook/react";
import { IconButton } from "@/shared/ui/IconButton";
import { Alert } from "./Alert";
import { Heart, XMark } from "@/shared/assets/icons";

const meta: Meta<typeof Alert> = {
  title: "shared/Alert",
  component: Alert,
  args: {
    children: 'Hello world, i am alert',
    variant: "filled",
    severity: 'info',
    borderRadius: 'small',
  },
}

export default meta;

type Story = StoryObj<typeof Alert>

export const DefaultAlert: Story = {

};

export const AlertWithTitle: Story = {
  args: {
    title: 'Title',
    children: 'Alert with title'
  }
};

export const AlertWithAction: Story = {
  args: {
    Action: <IconButton size="small-xx" color="custom-color" variant="clear"><XMark /></IconButton>,
    children: 'Alert with action button'
  }
};

export const AlertWithIcon: Story = {
  args: {
    Icon: <Heart size="small"/>,
    children: 'Alert with icon'
  }
};
