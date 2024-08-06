import { ActionIcon, NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { IconSettings } from "@tabler/icons-react";
import axios from "axios";
import React from "react";

export const Setting: React.FC<{ current_items_per_page: number }> = ({
    current_items_per_page,
}) => {
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            items_per_page: current_items_per_page,
        },

        validate: {
            items_per_page: (value) =>
                value < 1 ? "Items per page must be greater than 0" : null,
        },
    });

    const openModal = () =>
        modals.openConfirmModal({
            title: "Update Settings",
            centered: true,
            children: (
                <form>
                    <NumberInput
                        label="Number of items per page"
                        placeholder="your@email.com"
                        key={form.key("items_per_page")}
                        {...form.getInputProps("items_per_page")}
                    />
                </form>
            ),
            labels: { confirm: "Update", cancel: "Cancel" },
            confirmProps: { color: "orange" },
            onConfirm: () => {
                if (form.isValid()) {
                    axios
                        .post(route("settings.update"), form.getValues())
                        .then(() => window.location.reload());
                }
            },
        });

    return (
        <>
            <ActionIcon
                size="lg"
                variant="default"
                aria-label={"Settings"}
                onClick={openModal}
            >
                <IconSettings
                    style={{
                        width: "70%",
                        height: "70%",
                    }}
                    stroke={1.5}
                />
            </ActionIcon>
        </>
    );
};
