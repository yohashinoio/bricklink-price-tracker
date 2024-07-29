import { getColorDetail, ItemForm } from "@/Components/Item/ItemForm";
import { Layout } from "@/Layouts/Layout";
import { PageProps } from "@/types";
import { Item } from "@/types/item";
import {
    ActionIcon,
    Affix,
    Box,
    Drawer,
    Flex,
    Group,
    Image,
    Paper,
    Pill,
    Stack,
    Title,
    Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconRefresh } from "@tabler/icons-react";
import { PriceGuideText } from "../../Components/Item/Price/PriceGuide";
import axios from "axios";
import parse from "html-react-parser";
import { PriceDetail } from "../../Components/Item/Price/PriceDetail";
import { PriceGraph } from "../../Components/Item/Price/PriceGraph";
import { Color } from "@/types/color";
import React from "react";

type Props = {
    watched_items: Item[];
    colors: Color[];
} & PageProps;

export default function ({ watched_items, colors, auth }: Props) {
    const [opened, { open, close }] = useDisclosure();

    const imgRef = React.createRef<HTMLImageElement>();

    console.log(watched_items);

    const onClickUpdatePrice = (item_id: number) => {
        axios
            .post(route("prices.update", item_id))
            .then(() => {
                // Refresh the page
                window.location.reload();
            })
            .catch((error) => console.log(error));
    };

    return (
        <Layout>
            {/* Drawer of the form to add a new item */}
            <Drawer
                position={"right"}
                opened={opened}
                onClose={close}
                zIndex={999} // Ensure the drawer is on top of add button
            >
                <ItemForm onComplete={() => window.location.reload()} />
            </Drawer>

            {/* Floated add button */}
            <Affix position={{ bottom: 40, right: 40 }}>
                <ActionIcon onClick={open} radius="xl" size={60}>
                    <IconPlus stroke={1.5} size={30} />
                </ActionIcon>
            </Affix>

            {/* Render items */}
            <Stack>
                {watched_items.map((item, idx) => (
                    <Paper shadow="xs" key={idx}>
                        <Flex
                            mah={200}
                            px={16}
                            py={10}
                            justify={"space-between"}
                        >
                            <Flex columnGap={20}>
                                <Box w={"200px"}>
                                    <Image
                                        ref={imgRef}
                                        fit="contain"
                                        w={"100%"}
                                        h={"100%"}
                                        src={item.item_info.image_url}
                                        alt={item.item_info.name}
                                        onError={() => {
                                            if (imgRef.current) {
                                                imgRef.current.src =
                                                    item.item_info.thumbnail_url;
                                            }
                                        }}
                                    />
                                </Box>

                                <Stack>
                                    <Group gap={10}>
                                        <Title order={2} lineClamp={1}>
                                            {parse(item.item_info.name)}
                                        </Title>

                                        {item.color_id && (
                                            <Tooltip
                                                label={
                                                    colors.find(
                                                        (color) =>
                                                            color.color_id ===
                                                            item.color_id
                                                    )?.color_name
                                                }
                                            >
                                                <Box
                                                    style={{
                                                        borderRadius: "20%",
                                                    }}
                                                    w={16}
                                                    h={16}
                                                    bg={
                                                        "#" +
                                                        colors.find(
                                                            (color) =>
                                                                color.color_id ===
                                                                item.color_id
                                                        )?.color_code
                                                    }
                                                />
                                            </Tooltip>
                                        )}
                                    </Group>

                                    <PriceGuideText
                                        price_guide={item.price_guide}
                                    />
                                </Stack>
                            </Flex>

                            <Flex columnGap={10}>
                                <ActionIcon
                                    size="lg"
                                    variant="default"
                                    aria-label={"Update Price"}
                                    onClick={() => onClickUpdatePrice(item.id)}
                                >
                                    <IconRefresh
                                        style={{ width: "70%", height: "70%" }}
                                        stroke={1.5}
                                    />
                                </ActionIcon>

                                <PriceDetail price_guide={item.price_guide} />

                                <PriceGraph
                                    price_details={
                                        item.price_guide.price_details
                                    }
                                />
                            </Flex>
                        </Flex>
                    </Paper>
                ))}
            </Stack>
        </Layout>
    );
}
