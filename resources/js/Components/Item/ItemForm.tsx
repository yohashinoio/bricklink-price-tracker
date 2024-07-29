import { Color } from "@/types/color";
import {
    Box,
    Button,
    Group,
    LoadingOverlay,
    Select,
    SelectProps,
    Stack,
    Stepper,
    Text,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck } from "@tabler/icons-react";
import axios from "axios";
import React from "react";

type ValidationError = {
    [key: string]: string[];
};

type Props = {
    onComplete?: () => void;
};

export const getColorDetail = (color_id: number): Promise<Color> => {
    return axios
        .get<Color>(route("colors.detail", color_id))
        .then((res) => res.data);
};

const icon_props = {
    stroke: 1.5,
    color: "currentColor",
    opacity: 0.6,
    size: 18,
};

const renderColorSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
}) => {
    return (
        <Group flex="1" gap="xs">
            <Box w={16} h={16} bg={"#" + option.value} />
            {option.label}
            {checked && (
                <IconCheck
                    style={{ marginInlineStart: "auto" }}
                    {...icon_props}
                />
            )}
        </Group>
    );
};

export const ItemForm: React.FC<Props> = ({ onComplete }) => {
    const [visible_loading, { toggle: toggleLoading }] = useDisclosure(false);

    const [active, setActive] = React.useState(0);
    const [color_completions, setColorCompletions] = React.useState<Color[]>(
        []
    );
    const [selected_color_code, setSelectedColorName] = React.useState<
        string | null
    >(null);

    const openNoColorConfirmModal = () =>
        modals.openConfirmModal({
            title: "The item didn't have a color",
            centered: true,
            children: (
                <Text size="sm">
                    The item you entered did not have a color. Therefore, skip
                    and complete the color selection. Are you sure?
                </Text>
            ),
            labels: { confirm: "Complete", cancel: "Cancel" },
            zIndex: 1001,
            onConfirm: () => complete(),
        });

    const complete = () => {
        toggleLoading();

        const values = form.getValues();

        // Type is always uppercase
        values.type = values.type.toUpperCase();

        console.log(color_completions, selected_color_code);
        values.color_id =
            color_completions.find(
                (color) => color.color_code === selected_color_code
            )?.color_id ||
            color_completions.at(0)?.color_id ||
            null;

        console.log(values);

        axios
            .post(route("watched_items.store"), values)
            .then(() => onComplete && onComplete())
            .catch((error) => {
                console.log(error);
                setValidationErrors(error.response.data.errors);
            })
            .finally(() => toggleLoading());
    };

    const nextStep = () => {
        if (active === 0) {
            if (form.getValues().type === "") {
                form.setFieldError("type", "Item type is required");
                return;
            }

            if (form.getValues().no === "") {
                form.setFieldError("no", "Item number is required");
                return;
            }

            axios
                .get(
                    route("colors.known", [
                        form.getValues().type,
                        form.getValues().no,
                    ])
                )
                .then((knowns) => {
                    // If there are no known colors, skip the color selection step
                    if (
                        knowns.data.length === 1 &&
                        knowns.data[0].color_id === 0
                    ) {
                        openNoColorConfirmModal();
                        setActive(() => 0);
                    } else {
                        for (const known of knowns.data) {
                            getColorDetail(known.color_id).then((color) =>
                                setColorCompletions((current) => [
                                    ...current,
                                    color,
                                ])
                            );
                        }

                        setActive((current) => current + 1);
                    }
                });
        }

        if (active === 1) complete();
    };

    const prevStep = () => {
        if (active === 1) {
            setColorCompletions([]); // Clear color completions
            setSelectedColorName(null);
        }

        setActive((current) => (current > 0 ? current - 1 : current));
    };

    const [validationErrors, setValidationErrors] =
        React.useState<ValidationError>({});

    const form = useForm<{ type: string; no: string; color_id: number | null }>(
        {
            mode: "uncontrolled",
            initialValues: {
                type: "",
                no: "",
                color_id: null,
            },
        }
    );

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
        <>
            <Box pos="relative">
                <LoadingOverlay
                    visible={visible_loading}
                    zIndex={1002}
                    overlayProps={{ radius: "sm", blur: 2 }}
                />

                <Stepper active={active} onStepClick={setActive}>
                    <Stepper.Step label="First step" description="Enter item">
                        <form>
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
                            </Stack>
                        </form>
                    </Stepper.Step>
                    <Stepper.Step
                        label="Second step"
                        description="Select color"
                    >
                        <Select
                            withAsterisk
                            label="Select color"
                            placeholder="Select color"
                            onChange={(value) => setSelectedColorName(value)}
                            value={selected_color_code}
                            data={color_completions.map((color) => ({
                                value: color.color_code,
                                label: color.color_name,
                            }))}
                            comboboxProps={{ zIndex: 1000 }} // Ensure the dropdown is on top of the drawer
                            renderOption={renderColorSelectOption}
                        />
                    </Stepper.Step>
                </Stepper>

                <Group justify="center" mt="xl">
                    <Button variant="default" onClick={prevStep}>
                        Back
                    </Button>
                    <Button onClick={nextStep}>
                        {active === 1 ? "Complete" : "Next step"}
                    </Button>
                </Group>
            </Box>
        </>
    );
};
