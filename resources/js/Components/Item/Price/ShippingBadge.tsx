import { Badge } from "@mantine/core";

export const ShippingAvailabilityBadge: React.FC<{ availability: boolean }> = ({
    availability,
}) => {
    return (
        <Badge color={availability ? "green" : "red"}>
            {availability ? "Shipping available" : "Shipping unavailable"}
        </Badge>
    );
};
