import { Item } from "@/types/item";
import { ActionIcon, Progress, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconRefresh } from "@tabler/icons-react";
import axios from "axios";
import React from "react";

export const BatchUpdate: React.FC<{ items: Item[] }> = ({ items }) => {
    const [loading, setLoading] = React.useState(false);

    const openModal = () =>
        modals.openConfirmModal({
            title: "Update " + items.length + " Items' Prices",
            centered: true,
            children: (
                <>
                    <Text size="sm">
                        This operation takes some time since it updates multiple
                        items. Are you sure?
                    </Text>
                </>
            ),
            labels: { confirm: "Update", cancel: "Cancel" },
            confirmProps: { color: "red" },
            onConfirm: () => {
                setLoading(true);

                let promises: Promise<any>[] = [];

                items.forEach((item) => {
                    (async () => {
                        promises.push(
                            axios.post(route("prices.update", item.id))
                        );
                    })();
                });

                Promise.all(promises).then(() => {
                    setLoading(false);
                    window.location.reload();
                });
            },
        });
    return (
        <ActionIcon
            size="lg"
            variant="default"
            aria-label={"Update All Item's Prices"}
            onClick={openModal}
            loading={loading}
        >
            <IconRefresh
                style={{
                    width: "70%",
                    height: "70%",
                }}
                stroke={1.5}
            />
        </ActionIcon>
    );
};
