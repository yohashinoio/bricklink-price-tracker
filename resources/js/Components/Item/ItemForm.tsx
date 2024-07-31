import { Color } from "@/types/color";
import {
    Box,
    Button,
    Group,
    LoadingOverlay,
    Select,
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

const renderColorSelectOption = ({ option, checked }: any) => {
    return (
        <Group flex="1" gap="xs">
            <Box w={16} h={16} bg={"#" + option.color_code} />
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
    const [selected_color_id, setSelectedColorId] = React.useState<
        string | null
    >(null);

    const complete = () => {
        toggleLoading();

        const values = form.getValues();

        // Type is always uppercase
        values.type = values.type.toUpperCase();

        values.color_id = selected_color_id
            ? parseInt(selected_color_id)
            : color_completions.at(0)?.color_id || null;

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
                    let promises = [];

                    for (const known of knowns.data) {
                        promises.push(
                            getColorDetail(known.color_id).then((color) => {
                                if (color.color_code && color.color_name) {
                                    setColorCompletions((current) => [
                                        ...current,
                                        color,
                                    ]);
                                }
                            })
                        );
                    }

                    Promise.all(promises).then(() =>
                        setActive((current) => current + 1)
                    );
                });
        }

        if (active === 1) complete();
    };

    const prevStep = () => {
        if (active === 1) {
            setColorCompletions([]); // Clear color completions
            setSelectedColorId(null);
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

    const data = color_completions.map((color) => ({
        value: color.color_id.toString(),
        label: color.color_name,
        color_code: color.color_code,
    }));

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
                            onChange={(value) => setSelectedColorId(value)}
                            value={selected_color_id}
                            data={data}
                            comboboxProps={{ zIndex: 1000 }} // Ensure the dropdown is on top of the drawer
                            renderOption={renderColorSelectOption}
                            searchable
                            nothingFoundMessage="Nothing found..."
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
