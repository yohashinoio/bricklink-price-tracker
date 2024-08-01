import { ItemForm } from "@/Components/Item/ItemForm";
import { Layout } from "@/Layouts/Layout";
import { PageProps } from "@/types";
import { Item } from "@/types/item";
import { ActionIcon, Affix, Drawer, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";

import { Color } from "@/types/color";
import React from "react";
import { ItemCard } from "@/Components/Item/ItemCard";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

type Props = {
    watched_items: Item[];
    colors: Color[];
} & PageProps;

export default function ({ watched_items, colors }: Props) {
    console.log(watched_items);

    const [items, setItems] = React.useState(watched_items);
    const [opened, { open, close }] = useDisclosure();

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over == null || active.id === over.id) return;

        const old_idx = items.findIndex((item) => item.id === active.id);
        const new_idx = items.findIndex((item) => item.id === over.id);
        setItems(arrayMove(items, old_idx, new_idx));
    };

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
        </Layout>
    );
}
