import { Layout } from "@/Layouts/Layout";
import { PageProps } from "@/types";
import {
    Button,
    Checkbox,
    Group,
    NumberInput,
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

export default function ({ auth }: PageProps) {
    const [validationErrors, setValidationErrors] =
        React.useState<ValidationError>({});

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            type: "Minifig",
            no: "",
            color_id: null,
            include_used: false,
        },
    });

    const onSubmit = form.onSubmit((values) => {
        // Type is always uppercase
        values.type = values.type.toUpperCase();

        axios
            .post(route("items.store"), values)
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
                    />

                    <TextInput
                        required
                        label="Item No"
                        placeholder="min010"
                        key={form.key("no")}
                        {...form.getInputProps("no")}
                    />

                    <NumberInput
                        required
                        label="Color No"
                        placeholder=""
                        key={form.key("color_id")}
                        {...form.getInputProps("color_id")}
                    />

                    <Checkbox
                        label="Includes used items"
                        key={form.key("include_used")}
                        {...form.getInputProps("include_used", {
                            type: "checkbox",
                        })}
                    />

                    <Group justify="flex-end">
                        <Button type="submit">Submit</Button>
                    </Group>
                </Stack>
            </form>
        </Layout>
    );
}
