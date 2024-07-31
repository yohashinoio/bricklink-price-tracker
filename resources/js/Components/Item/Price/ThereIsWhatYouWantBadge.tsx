import { Badge } from "@mantine/core";

export const ThereIsWhatYouWantBadge: React.FC<{
    there_is_what_you_want: boolean;
}> = ({ there_is_what_you_want }) => {
    return (
        <Badge color={there_is_what_you_want ? "green" : "red"}>
            {there_is_what_you_want
                ? "There is what you want"
                : "There is not what you want"}
        </Badge>
    );
};
