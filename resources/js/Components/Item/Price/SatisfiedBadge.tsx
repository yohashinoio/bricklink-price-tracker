import { Satisfieds } from "@/Pages/Item/Index";
import { Badge } from "@mantine/core";

export const SatisfiedBadge: React.FC<{
    satisfieds: Satisfieds | null;
}> = ({ satisfieds }) => {
    const color = (() => {
        if (satisfieds === null) return "gray";

        if (satisfieds.price_quantity_satisfied) return "green";

        if (satisfieds.price_satisfied) return "orange";

        return "red";
    })();

    const text = (() => {
        if (satisfieds === null) return "Not configured";

        if (satisfieds.price_quantity_satisfied) return "All satisfied";

        if (satisfieds.price_satisfied) return "Price satisfied";

        return "Not satisfied";
    })();

    return <Badge color={color}>{text}</Badge>;
};
