import { PriceGuide } from "@/types/item";
import { Box, Flex, Stack, Text, Title } from "@mantine/core";
import React from "react";

type Props = {
    price_guide: PriceGuide;
};

export const PriceGuideText: React.FC<Props> = ({ price_guide }) => {
    return (
        <Stack gap={0}>
            <Title order={3} lineClamp={1}>
                Prices
            </Title>

            <Flex columnGap={16}>
                <Box>
                    <Title order={4} lineClamp={1}>
                        New
                    </Title>
                    <Text>
                        {price_guide.min_price_of_new}{" "}
                        {price_guide.currency_code}
                    </Text>
                </Box>
                <Box>
                    <Title order={4} lineClamp={1}>
                        Used
                    </Title>
                    <Text>
                        {price_guide.min_price_of_used}{" "}
                        {price_guide.currency_code}
                    </Text>
                </Box>
            </Flex>
        </Stack>
    );
};
