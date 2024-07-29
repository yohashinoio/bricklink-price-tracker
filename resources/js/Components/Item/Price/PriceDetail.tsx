import { NewBadge } from "@/Pages/Item/NewBadge";
import { UsedBadge } from "@/Pages/Item/UsedBadge";
import { PriceGuide } from "@/types/item";
import {
    Popover,
    Stack,
    Title,
    Flex,
    Text,
    ActionIcon,
    Group,
} from "@mantine/core";
import { IconCoins } from "@tabler/icons-react";
import React from "react";

type Props = {
    price_guide: PriceGuide;
};

export const PriceDetail: React.FC<Props> = ({ price_guide }) => {
    return (
        <Popover width={200} position="bottom" withArrow shadow="md">
            <Popover.Target>
                <ActionIcon
                    size="lg"
                    variant="default"
                    aria-label={"Price Detail"}
                >
                    <IconCoins
                        style={{ width: "70%", height: "70%" }}
                        stroke={1.5}
                    />
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
                <Stack gap={0}>
                    <Title order={4} lineClamp={1} mb={2}>
                        Min Price
                    </Title>
                    <Group gap={6}>
                        <NewBadge ml={3} />
                        <Text>
                            {price_guide.min_price_of_new}{" "}
                            {price_guide.currency_code}
                        </Text>
                    </Group>
                    <Group gap={6}>
                        <UsedBadge />
                        <Text>
                            {price_guide.min_price_of_used}{" "}
                            {price_guide.currency_code}
                        </Text>
                    </Group>
                    <Title order={4} lineClamp={1} mt={8} mb={2}>
                        Max Price
                    </Title>
                    <Group gap={6}>
                        <NewBadge ml={3} />
                        <Text>
                            {price_guide.max_price_of_new}{" "}
                            {price_guide.currency_code}
                        </Text>
                    </Group>
                    <Group gap={6}>
                        <UsedBadge />
                        <Text>
                            {price_guide.max_price_of_used}{" "}
                            {price_guide.currency_code}
                        </Text>
                    </Group>
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
};
