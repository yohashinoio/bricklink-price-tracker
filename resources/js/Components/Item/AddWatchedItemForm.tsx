import { Layout } from "@/Layouts/Layout";
import {
    Button,
    Group,
    NumberInput,
    Radio,
    Select,
    Stack,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import React from "react";

type ValidationError = {
    [key: string]: string[];
};

export const AddWatchedItemForm = () => {
    const [validationErrors, setValidationErrors] =
        React.useState<ValidationError>({});

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            type: "",
            no: "",
            color_id: null,
            new_or_used: "N",
        },
    });

    const onSubmit = form.onSubmit((values) => {
        // Type is always uppercase
        values.type = values.type.toUpperCase();

        axios
            .post(route("watched_items.store"), values)
            .then(() => (window.location.href = route("items.index")))
            .catch((error) => {
                console.log(error);
                setValidationErrors(error.response.data.errors);
            });
    });

    // Render validation errors
    (() => {
        // If there are no validation errors, return
        if (Object.keys(validationErrors).length === 0) return;

        const keys = Object.keys(form.getValues());

        keys.forEach((key) => {
            const errors = validationErrors[key];
            if (errors) form.setFieldError(key, errors[0]);
        });
    })();

    return (
        <Layout>
            <form onSubmit={onSubmit}>
                <Stack>
                    <Select
                        required
                        label="Item Type"
                        {...form.getInputProps("type")}
                        key={form.key("type")}
                        data={[
                            "Minifig",
                            "Part",
                            "Set",
                            "Book",
                            "Gear",
                            "Catalog",
                            "Instruction",
                            "Unsorted_lot",
                            "Original_box",
                        ]}
                        searchable
                        allowDeselect
                        nothingFoundMessage="Nothing found..."
                        comboboxProps={{ zIndex: 1000 }} // Ensure the dropdown is on top of the drawer
                    />

                    <TextInput
                        required
                        label="Item No"
                        placeholder="min010"
                        key={form.key("no")}
                        {...form.getInputProps("no")}
                    />

                    <NumberInput
                        label="Color No"
                        placeholder=""
                        key={form.key("color_id")}
                        {...form.getInputProps("color_id")}
                    />

                    <Radio.Group
                        required
                        label="Select a condition"
                        key={form.key("new_or_used")}
                        {...form.getInputProps("new_or_used")}
                    >
                        <Group mt="xs">
                            <Radio value="N" label="New" />
                            <Radio value="U" label="Used" />
                        </Group>
                    </Radio.Group>

                    <Group justify="flex-end">
                        <Button type="submit">Add</Button>
                    </Group>
                </Stack>
            </form>
        </Layout>
    );
};
