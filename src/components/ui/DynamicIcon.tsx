import { icons } from "lucide-react";
import type { LucideProps } from "lucide-react";
import { memo } from "react";

interface DynamicIconProps extends Omit<LucideProps, 'ref'> {
  name: string;
  fallback?: keyof typeof icons;
}

const DynamicIcon = memo(({ name, fallback = "TrendingUp", ...props }: DynamicIconProps) => {
  // Convert kebab-case or snake_case to PascalCase
  const formatIconName = (iconName: string): string => {
    return iconName
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  };

  const formattedName = formatIconName(name);
  const IconComponent = icons[formattedName as keyof typeof icons] || icons[fallback];
  
  return <IconComponent {...props} />;
});

DynamicIcon.displayName = 'DynamicIcon';

export default DynamicIcon;