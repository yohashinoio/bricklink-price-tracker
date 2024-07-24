import { AddWatchedItemForm } from "@/Components/Item/WatchedItemCreateForm";
import { Layout } from "@/Layouts/Layout";
import { PageProps } from "@/types";
import { Item } from "@/types/item";
import {
    ActionIcon,
    Affix,
    Button,
    Drawer,
    Paper,
    Stack,
    Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";

type Props = {
    watched_items: Item[];
} & PageProps;

export default function ({ watched_items, auth }: Props) {
    const [opened, { open, close }] = useDisclosure();

    return (
        <Layout>
            {/* Drawer of the form to add a new item */}
            <Drawer
                offset={8}
                radius="md"
                position={"right"}
                opened={opened}
                onClose={close}
                zIndex={999} // Ensure the drawer is on top of add button
            >
                <AddWatchedItemForm />
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
                        <Text>Type: {item.type}</Text>
                        <Text>No: {item.no}</Text>
                        <Text>Color Id: {item.color_id}</Text>
                        <Text>Include used: {item.include_used}</Text>
                    </Paper>
                ))}
            </Stack>
        </Layout>
    );
}
