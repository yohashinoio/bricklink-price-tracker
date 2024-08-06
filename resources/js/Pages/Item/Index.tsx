import { ItemForm } from "@/Components/Item/ItemForm";
import { Layout } from "@/Layouts/Layout";
import { PageProps } from "@/types";
import { Item } from "@/types/item";
import {
    ActionIcon,
    Affix,
    Box,
    Center,
    Drawer,
    Flex,
    Pagination,
    Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";

import { Color } from "@/types/color";
import React from "react";
import { ItemCard } from "@/Components/Item/ItemCard";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { DesiredCondition } from "@/types/desired_condition";
import axios from "axios";
import { Head, router } from "@inertiajs/react";
import { Setting } from "@/Components/Item/Setting";
import { BatchUpdate } from "@/Components/Item/BatchUpdate";

type Props = {
    items: Item[];
    watched_items: {
        id: number;
        item_id: number;
        position: number;
        desired_condition: DesiredCondition;
    }[];
    colors: Color[];

    total_pages: number;
    current_page: number;
    items_per_page: number;
} & PageProps;

export default function ({
    items: items_from_props,
    watched_items,
    colors,
    total_pages,
    current_page,
    items_per_page,
    auth,
}: Props) {
    const [items, setItems] = React.useState(
        items_from_props
            .map((item) => {
                const wi = watched_items.find((dc) => dc.item_id === item.id);
                if (wi) {
                    item.desired_condition = wi.desired_condition;
                    item.position = wi.position;
                    item.watched_item_id = wi.id;
                }
                return item;
            })
            // Sort by position
            .sort((a, b) => a.position - b.position)
    );

    console.log(current_page);

    const [opened, { open, close }] = useDisclosure();

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over == null || active.id === over.id) return;

        const old_idx = items.findIndex((item) => item.id === active.id);
        const new_idx = items.findIndex((item) => item.id === over.id);

        const moved = arrayMove(items, old_idx, new_idx);

        // Update position in backend
        moved.forEach((item, idx) => {
            axios
                .post(
                    route(
                        "watched_items.update_position",
                        item.watched_item_id
                    ),
                    { position: idx + 1 }
                )
                .catch((err) => {
                    console.error(err);
                });
        });

        setItems(moved);
    };

    return (
        <>
            <Head title="Dashboard | BrickLink Price Tracker" />

            <Layout auth={auth}>
                <Box w={"100%"}>
                    <Drawer
                        position={"right"}
                        opened={opened}
                        onClose={close}
                        zIndex={999} // Ensure the drawer is on top of add button
                    >
                        <ItemForm />
                    </Drawer>

                    {/* Floated button */}
                    <Affix position={{ bottom: 40, right: 40 }}>
                        <ActionIcon onClick={open} radius="xl" size={60}>
                            <IconPlus stroke={1.5} size={30} />
                        </ActionIcon>
                    </Affix>

                    <Flex justify={"end"} gap={8} mb={16}>
                        <BatchUpdate items={items} />
                        <Setting current_items_per_page={items_per_page} />
                    </Flex>

                    <DndContext
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis]}
                        onDragEnd={onDragEnd}
                    >
                        <SortableContext items={items}>
                            <Stack>
                                {items.map((item) => (
                                    <ItemCard
                                        key={item.id}
                                        item={item}
                                        colors={colors}
                                    />
                                ))}
                            </Stack>
                        </SortableContext>
                    </DndContext>

                    {items.length !== 0 && (
                        <Center mt={20}>
                            <Pagination
                                total={total_pages}
                                value={current_page}
                                onChange={(value) =>
                                    router.get(route("items.index", value))
                                }
                            />
                        </Center>
                    )}
                </Box>
            </Layout>
        </>
    );
}
