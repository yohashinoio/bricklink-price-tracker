import { Badge, BadgeProps } from "@mantine/core";

export const NewBadge: React.FC<BadgeProps> = (props) => {
    return (
        <Badge variant="default" {...props}>
            New
        </Badge>
    );
};
