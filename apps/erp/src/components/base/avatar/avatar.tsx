import * as React from "react";
import { Avatar as UiAvatar, AvatarProps as UiAvatarProps } from "@/components/ui/avatar";

export interface AvatarProps extends UiAvatarProps {}

export const Avatar: React.FC<AvatarProps> = (props) => {
  return <UiAvatar {...props} />;
};

export default Avatar;
