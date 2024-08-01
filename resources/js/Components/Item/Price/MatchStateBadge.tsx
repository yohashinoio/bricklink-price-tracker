import { MatchState } from "@/Pages/Item/Index";
import { Badge } from "@mantine/core";

export const MatchStateBadge: React.FC<{
    match_state: MatchState | null;
}> = ({ match_state }) => {
    const color = (() => {
        if (match_state === null) return "gray";

        if (match_state.price_quantity_matched) return "green";

        if (match_state.price_matched) return "orange";

        return "red";
    })();

    const text = (() => {
        if (match_state === null) return "Not configured";

        if (match_state.price_quantity_matched) return "All matched";

        if (match_state.price_matched) return "Price matched";

        return "Not matched";
    })();

    return <Badge color={color}>{text}</Badge>;
};
