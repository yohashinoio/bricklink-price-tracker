import { Item } from "@/types/item";
import {
    ActionIcon,
    AspectRatio,
    Box,
    Flex,
    Paper,
    Skeleton,
    Stack,
    Title,
    Tooltip,
    Image,
    Text,
    Center,
    Badge,
} from "@mantine/core";
import { IconGripVertical, IconRefresh, IconTrash } from "@tabler/icons-react";
import { DesiredConditionForm } from "./DesiredConditionForm";
import { MatchStateBadge } from "./Price/MatchStateBadge";
import { PriceGraph } from "./Price/PriceGraph";
import { PriceGuideText } from "./Price/PriceGuide";
import { preciseLte } from "@/common/decimal";
import parse from "html-react-parser";
import { Color } from "@/types/color";
import React from "react";
import { modals } from "@mantine/modals";
import axios from "axios";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
    item: Item;
    colors: Color[];
};

export type MatchState = {
    price_matched: boolean;
    price_quantity_matched: boolean;
};

const getDesiredConditionMatchState = async (
    item: Item
): Promise<MatchState> => {
    return new Promise((resolve, reject) => {
        const desired_condition = item.desired_condition;

        if (!desired_condition) reject("Desired condition is not configured.");

        const match_state: MatchState = {
            price_matched: false,
            price_quantity_matched: false,
        };

        const filtered_price_details = (() => {
            if (desired_condition!.include_used)
                return item.price_guide.price_details;

            return item.price_guide.price_details.filter(
                (detail) => detail.new_or_used === "N"
            );
        })();

        match_state.price_matched = filtered_price_details.some(
            (price_detail) => {
                return (
                    preciseLte(
                        price_detail.unit_price,
                        desired_condition!.unit_price
                    ) &&
                    (desired_condition!.shipping_available
                        ? price_detail.shipping_available
                        : true)
                );
            }
        );

        match_state.price_quantity_matched = filtered_price_details.some(
            (price_detail) => {
                return (
                    preciseLte(
                        price_detail.unit_price,
                        desired_condition!.unit_price
                    ) &&
                    price_detail.quantity >= desired_condition!.quantity &&
                    (desired_condition!.shipping_available
                        ? price_detail.shipping_available
                        : true)
                );
            }
        );

        resolve(match_state);
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

export const ItemCard: React.FC<Props> = React.memo(({ item, colors }) => {
    const {
        isDragging,
        setActivatorNodeRef,
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item.id });

    // Null = not configured, undefined = loading
    const [match_state, setMatchState] = React.useState<
        MatchState | null | undefined
    >(undefined);

    // This state is supposed to have a item id.
    const [updateLoadingItem, setUpdateLoadingItem] =
        React.useState<Item | null>(null);

    const openDeleteConfirmModal = React.useCallback(
        (item: Item) =>
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
                                        (color) =>
                                            color.color_id === item.color_id
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
            }),
        [colors]
    );

    const openUpdateConfirmModal = React.useCallback(
        (item: Item) =>
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
            }),
        []
    );

    React.useEffect(() => {
        getDesiredConditionMatchState(item)
            .then((match_state) => setMatchState(match_state))
            .catch(() => setMatchState(null));
    }, [item]);

    return (
        <Box
            ref={setNodeRef}
            style={{
                zIndex: isDragging ? 1000 : 0,
                transform: CSS.Transform.toString(transform),
                transition,
            }}
        >
            <Paper shadow="xs">
                <Flex mah={200} p={10} justify={"space-between"}>
                    <Flex columnGap={20}>
                        <Center
                            ref={setActivatorNodeRef}
                            {...attributes}
                            {...listeners}
                        >
                            <IconGripVertical />
                        </Center>

                        <AspectRatio
                            ratio={100 / 80}
                            maw={100}
                            mah={80}
                            mr={20}
                            onClick={() => {
                                // Move to bricklink item page.
                                const base =
                                    "https://www.bricklink.com/v2/catalog/catalogitem.page";
                                const query_name_for_no =
                                    item.item_info.type[0];

                                if (item.color_id) {
                                    window.open(
                                        `${base}?${query_name_for_no}=${item.item_info.no}&C=${item.color_id}`
                                    );
                                } else {
                                    window.open(
                                        `${base}?${query_name_for_no}=${item.item_info.no}`
                                    );
                                }
                            }}
                            style={{ cursor: "pointer" }}
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
                                        ? updateLoadingItem.id === item.id
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
                                currency_code={item.price_guide.currency_code}
                                price_details={item.price_guide.price_details}
                            />

                            <ActionIcon
                                size="lg"
                                variant="default"
                                aria-label={"Update Price"}
                                onClick={() => openUpdateConfirmModal(item)}
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
                                onClick={() => openDeleteConfirmModal(item)}
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
                            {match_state === undefined ? (
                                <Badge color={"indigo"}>Searching</Badge>
                            ) : (
                                <MatchStateBadge match_state={match_state} />
                            )}
                        </Flex>
                    </Flex>
                </Flex>
            </Paper>
        </Box>
    );
});
