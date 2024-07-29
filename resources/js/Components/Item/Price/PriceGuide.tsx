import { NewBadge } from "@/Pages/Item/NewBadge";
import { UsedBadge } from "@/Pages/Item/UsedBadge";
import { PriceGuide } from "@/types/item";
import { Group, Text } from "@mantine/core";
import React from "react";

type Props = {
    price_guide: PriceGuide;
};

export const PriceGuideText: React.FC<Props> = ({ price_guide }) => {
    return (
        <Group>
            <Group gap={6}>
                <NewBadge />
                <Text>
                    {price_guide.min_price_of_new} {price_guide.currency_code}
                </Text>
            </Group>
            <Group gap={6}>
                <UsedBadge />
                <Text>
                    {price_guide.min_price_of_used} {price_guide.currency_code}
                </Text>
            </Group>
        </Group>
    );
};
