import { DesiredCondition } from "@/types/desired_condition";
import { ValidationError } from "@/types/validation";
import {
    ActionIcon,
    Box,
    Button,
    Checkbox,
    Flex,
    Group,
    LoadingOverlay,
    NumberInput,
    Popover,
    Stack,
    Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAntenna } from "@tabler/icons-react";
import axios from "axios";
import React from "react";

export const DesiredConditionForm: React.FC<{
    item_id: number;
    current_desire: DesiredCondition | undefined;
}> = ({ item_id, current_desire }) => {
    const [loading, setLoading] = React.useState(false);

    const [validationErrors, setValidationErrors] =
        React.useState<ValidationError>({});

    const form = useForm<{
        unit_price: number | null;
        quantity: number | null;
        shipping_available: boolean;
        include_used: boolean;
    }>({
        mode: "uncontrolled",
        initialValues: {
            unit_price: current_desire?.unit_price || null,
            quantity: current_desire?.quantity || null,
            shipping_available: current_desire
                ? current_desire.shipping_available
                : true,
            include_used: current_desire ? current_desire.include_used : true,
        },
    });

    const onSubmit = () => {
        if (!form.getValues().unit_price) {
            form.setFieldError("unit_price", "Unit price is required.");
            return;
        }

        if (!form.getValues().quantity) {
            form.setFieldError("quantity", "Quantity is required.");
            return;
        }

        setLoading(true);

        const values = form.getValues();

        axios
            .post(route("desired_conditions.updateOrStore", item_id), values)
            .then(() => window.location.reload())
            .catch((error) => {
                console.log(error);
                setValidationErrors(error.response.data.errors);
            });
    };

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
        <Popover position="bottom" withArrow shadow="md">
            <Popover.Target>
                <ActionIcon
                    size="lg"
                    variant="default"
                    aria-label={"Set Desired Condition"}
                >
                    <IconAntenna
                        style={{ width: "70%", height: "70%" }}
                        stroke={1.5}
                    />
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
                <Box pos="relative">
                    <LoadingOverlay
                        visible={loading}
                        overlayProps={{ radius: "sm", blur: 2 }}
                    />

                    <Flex direction={"column"} gap={10}>
                        <Title ta={"center"} order={3}>
                            What you want?
                        </Title>

                        <form onSubmit={form.onSubmit(() => onSubmit())}>
                            <Stack>
                                <NumberInput
                                    required
                                    label="Price"
                                    placeholder="48.10"
                                    {...form.getInputProps("unit_price")}
                                    key={form.key("unit_price")}
                                />

                                <NumberInput
                                    required
                                    label="Quantity"
                                    placeholder="2525"
                                    {...form.getInputProps("quantity")}
                                    key={form.key("quantity")}
                                />

                                <Checkbox
                                    defaultChecked={
                                        current_desire
                                            ? current_desire.shipping_available
                                            : true
                                    }
                                    label="Shipping Available"
                                    {...form.getInputProps(
                                        "shipping_available"
                                    )}
                                    key={form.key("shipping_available")}
                                />

                                <Checkbox
                                    defaultChecked={
                                        current_desire
                                            ? current_desire.include_used
                                            : true
                                    }
                                    label="Include Used"
                                    {...form.getInputProps("include_used")}
                                    key={form.key("include_used")}
                                />

                                <Group justify="center" mt={4}>
                                    <Button size="xs" type="submit">
                                        Update
                                    </Button>
                                </Group>
                            </Stack>
                        </form>
                    </Flex>
                </Box>
            </Popover.Dropdown>
        </Popover>
    );
};
