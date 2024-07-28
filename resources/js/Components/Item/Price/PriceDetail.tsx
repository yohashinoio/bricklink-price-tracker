import { PriceGuide } from "@/types/item";
import { Popover, Stack, Title, Flex, Text, ActionIcon } from "@mantine/core";
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
                    <Title order={4} lineClamp={1}>
                        Min Price
                    </Title>
                    <Flex columnGap={6}>
                        <Title order={6} lineClamp={1}>
                            New
                        </Title>
                        <Text>
                            {price_guide.min_price_of_new}{" "}
                            {price_guide.currency_code}
                        </Text>
                    </Flex>
                    <Flex columnGap={6}>
                        <Title order={6} lineClamp={1}>
                            Used
                        </Title>
                        <Text>
                            {price_guide.min_price_of_used}{" "}
                            {price_guide.currency_code}
                        </Text>
                    </Flex>
                    <Title order={4} lineClamp={1}>
                        Max Price
                    </Title>
                    <Flex columnGap={6}>
                        <Title order={6} lineClamp={1}>
                            New
                        </Title>
                        <Text>
                            {price_guide.max_price_of_new}{" "}
                            {price_guide.currency_code}
                        </Text>
                    </Flex>
                    <Flex columnGap={6}>
                        <Title order={6} lineClamp={1}>
                            Used
                        </Title>
                        <Text>
                            {price_guide.max_price_of_used}{" "}
                            {price_guide.currency_code}
                        </Text>
                    </Flex>
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
};
