import { Meta, StoryObj } from "@storybook/react";
import { IconButton } from "@/shared/ui/IconButton";
import { Alert } from "./Alert";
import { Icon } from "@/shared/ui/Icon";

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

export const Default: Story = {

};

export const WithTitle: Story = {
  args: {
    title: 'Title'
  }
};

export const WithAction: Story = {
  args: {
    Action: <IconButton size="small-xx" color="custom-color" variant="clear"><Icon variant="x-mark"/></IconButton>,
  }
};

export const WithIcon: Story = {
  args: {
    Icon: <Icon size="medium" variant="heart"/>
  }
};
