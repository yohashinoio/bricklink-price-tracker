import { AddWatchedItemForm } from "@/Components/Item/AddWatchedItemForm";
import { Layout } from "@/Layouts/Layout";
import { PageProps } from "@/types";
import { Item } from "@/types/item";
import {
    ActionIcon,
    Affix,
    AspectRatio,
    Box,
    Drawer,
    Flex,
    Image,
    Paper,
    rem,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";

type Props = {
    watched_items: Item[];
} & PageProps;

export default function ({ watched_items, auth }: Props) {
    const [opened, { open, close }] = useDisclosure();

    console.log(watched_items);

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
                        <Flex mah={200} p={8}>
                            <Box w={"12%"} h={"auto"} pr={8}>
                                <Image
                                    fit="contain"
                                    w={"100%"}
                                    h={"100%"}
                                    src={item.item_info.image_url}
                                    alt={item.item_info.name}
                                />
                            </Box>
                            <Box>
                                <Title order={2} lineClamp={1}>
                                    {item.item_info.name}
                                </Title>
                                <Text>Type: {item.item_info.type}</Text>
                                <Text>No: {item.item_info.no}</Text>
                                <Text>Color Id: {item.color_id}</Text>
                                <Text>New or used: {item.new_or_used}</Text>
                            </Box>
                        </Flex>
                    </Paper>
                ))}
            </Stack>
        </Layout>
    );
}
