import { ItemForm } from "@/Components/Item/ItemForm";
import { Layout } from "@/Layouts/Layout";
import { PageProps } from "@/types";
import { Item } from "@/types/item";
import { ActionIcon, Affix, Box, Drawer, Stack } from "@mantine/core";
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

type Props = {
    items: Item[];
    watched_items: {
        id: number;
        item_id: number;
        position: number;
        desired_condition: DesiredCondition;
    }[];
    colors: Color[];
} & PageProps;

export default function ({
    items: items_from_props,
    watched_items,
    colors,
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
            </Box>
        </Layout>
    );
}
