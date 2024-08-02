import { PriceGuide } from "@/types/item";
import { Group, Text } from "@mantine/core";
import React from "react";
import { NewBadge } from "./NewBadge";
import { UsedBadge } from "./UsedBadge";

type Props = {
    price_guide: PriceGuide;
};

export const PriceGuideText: React.FC<Props> = ({ price_guide }) => {
    const out_of_stock_msg = "Out of stock";

    return (
        <Group>
            <Group gap={6}>
                <NewBadge />
                <Text>
                    {price_guide.min_price_of_new +
                        " " +
                        price_guide.currency_code || out_of_stock_msg}{" "}
                </Text>
            </Group>
            <Group gap={6}>
                <UsedBadge />
                <Text>
                    {price_guide.min_price_of_used +
                        " " +
                        price_guide.currency_code || out_of_stock_msg}{" "}
                </Text>
            </Group>
        </Group>
    );
};
