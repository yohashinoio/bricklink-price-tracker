import { ItemForm } from "@/Components/Item/ItemForm";
import { Layout } from "@/Layouts/Layout";
import { PageProps } from "@/types";
import { Item } from "@/types/item";
import {
    ActionIcon,
    Affix,
    AspectRatio,
    Badge,
    Box,
    Drawer,
    Flex,
    Image,
    Paper,
    Skeleton,
    Stack,
    Text,
    Title,
    Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconRefresh, IconTrash } from "@tabler/icons-react";
import { PriceGuideText } from "../../Components/Item/Price/PriceGuide";
import axios from "axios";
import parse from "html-react-parser";
import { PriceGraph } from "../../Components/Item/Price/PriceGraph";
import { Color } from "@/types/color";
import { modals } from "@mantine/modals";
import React from "react";
import { ThereIsWhatYouWantBadge } from "@/Components/Item/Price/ThereIsWhatYouWantBadge";
import { DesiredConditionForm } from "@/Components/Item/DesiredConditionForm";
import BigNumber from "bignumber.js";

type Props = {
    watched_items: Item[];
    colors: Color[];
} & PageProps;

const isSatisfyDesire = (item: Item): boolean => {
    const desired_condition = item.desired_condition;

    if (!desired_condition) return false;

    return item.price_guide.price_details.some((price_detail) => {
        // Using bignumber.js to compare floating point numbers.
        const big1 = new BigNumber(price_detail.unit_price);
        const big2 = new BigNumber(desired_condition.unit_price);
        return (
            big1.lte(big2) &&
            price_detail.quantity >= desired_condition.quantity &&
            price_detail.shipping_available ===
                desired_condition.shipping_available
        );
    });
};

const getHighResPartImage = (image_url: string) => {
    if (!image_url.includes("/P/"))
        throw new Error("Image URL does not contain /P/");

    const buf = image_url.replace("/P/", "/ItemImage/PN/");
    return buf.replace(".jpg", ".png");
};

const prepareImageURL = (item: Item) => {
    if (!item.color_id) return item.item_info.image_url;

    if (item.item_info.type === "PART")
        return getHighResPartImage(item.colored_image_url);

    return item.colored_image_url;
};

export default function ({ watched_items, colors, auth }: Props) {
    React.useEffect(() => console.log(watched_items));

    const [opened, { open, close }] = useDisclosure();

    // This state is supposed to have a item id.
    const [updateLoadingItem, setUpdateLoadingItem] =
        React.useState<Item | null>(null);

    const openDeleteConfirmModal = (item: Item) =>
        modals.openConfirmModal({
            title: "Delete Item",
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete{" "}
                    <strong>{item.item_info.name}</strong>
                    {item.color_id && (
                        <Box
                            mx={2}
                            display={"inline-block"}
                            w={10}
                            h={10}
                            bg={
                                "#" +
                                colors.find(
                                    (color) => color.color_id === item.color_id
                                )?.color_code
                            }
                        />
                    )}
                    ?
                </Text>
            ),
            labels: { confirm: "Delete", cancel: "Cancel" },
            confirmProps: { color: "red" },
            onConfirm: () => {
                axios
                    .delete(route("items.destroy", item.id))
                    .then(() => window.location.reload());
            },
        });

    const openUpdateConfirmModal = (item: Item) =>
        modals.openConfirmModal({
            title: "Update Item Price",
            centered: true,
            children: (
                <Text size="sm">
                    This operation requires API access, are you sure?
                </Text>
            ),
            labels: { confirm: "Update", cancel: "Cancel" },
            confirmProps: { color: "orange" },
            onConfirm: () => {
                setUpdateLoadingItem(item);
                axios.post(route("prices.update", item.id)).then(() => {
                    window.location.reload();
                });
            },
        });

    return (
        <Layout>
            <Drawer
                position={"right"}
                opened={opened}
                onClose={close}
                zIndex={999} // Ensure the drawer is on top of add button
            >
                <ItemForm />
            </Drawer>

            {/* Floated + button */}
            <Affix position={{ bottom: 40, right: 40 }}>
                <ActionIcon onClick={open} radius="xl" size={60}>
                    <IconPlus stroke={1.5} size={30} />
                </ActionIcon>
            </Affix>

            <Stack>
                {watched_items.map((item, idx) => (
                    <Paper shadow="xs" key={idx}>
                        <Flex
                            mah={200}
                            p={"10 10 10 30"}
                            justify={"space-between"}
                        >
                            <Flex columnGap={40}>
                                <AspectRatio
                                    ratio={100 / 80}
                                    maw={100}
                                    mah={80}
                                >
                                    <Image
                                        fit="contain"
                                        src={prepareImageURL(item)}
                                        alt={item.item_info.name + " image"}
                                    />
                                </AspectRatio>

                                <Stack w={"80%"}>
                                    <Flex gap={10} align={"center"}>
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
                                                    miw={16}
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
                                    </Flex>

                                    <Skeleton
                                        visible={
                                            updateLoadingItem
                                                ? updateLoadingItem.id ===
                                                  item.id
                                                : false
                                        }
                                    >
                                        <PriceGuideText
                                            price_guide={item.price_guide}
                                        />
                                    </Skeleton>
                                </Stack>
                            </Flex>

                            <Flex direction="column" justify={"space-between"}>
                                <Flex gap={8} justify={"flex-end"}>
                                    <DesiredConditionForm
                                        item_id={item.id}
                                        current_desire={item.desired_condition}
                                    />

                                    <PriceGraph
                                        currency_code={
                                            item.price_guide.currency_code
                                        }
                                        price_details={
                                            item.price_guide.price_details
                                        }
                                    />

                                    <ActionIcon
                                        size="lg"
                                        variant="default"
                                        aria-label={"Update Price"}
                                        onClick={() =>
                                            openUpdateConfirmModal(item)
                                        }
                                    >
                                        <IconRefresh
                                            style={{
                                                width: "70%",
                                                height: "70%",
                                            }}
                                            stroke={1.5}
                                        />
                                    </ActionIcon>

                                    <ActionIcon
                                        size="lg"
                                        variant="default"
                                        aria-label={"Delete Item"}
                                        onClick={() =>
                                            openDeleteConfirmModal(item)
                                        }
                                    >
                                        <IconTrash
                                            style={{
                                                width: "70%",
                                                height: "70%",
                                            }}
                                            stroke={1.5}
                                        />
                                    </ActionIcon>
                                </Flex>

                                <Flex justify={"flex-end"}>
                                    {item.desired_condition ? (
                                        <ThereIsWhatYouWantBadge
                                            there_is_what_you_want={isSatisfyDesire(
                                                item
                                            )}
                                        />
                                    ) : (
                                        <Badge color="gray">
                                            Not configured
                                        </Badge>
                                    )}
                                </Flex>
                            </Flex>
                        </Flex>
                    </Paper>
                ))}
            </Stack>
        </Layout>
    );
}
