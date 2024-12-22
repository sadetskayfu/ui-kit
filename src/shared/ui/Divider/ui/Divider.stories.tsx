import { Meta, StoryObj } from "@storybook/react";
import { Divider } from "./Divider";

const meta: Meta<typeof Divider> = {
  title: "shared/Divider",
  component: Divider,
  args: {
    orientation: 'horizontal',
  },
}

export default meta;
type Story = StoryObj<typeof Divider>

export const DefaultDiv: Story = {

};


