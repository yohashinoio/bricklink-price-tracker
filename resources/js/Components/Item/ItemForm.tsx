import { Color } from "@/types/color";
import { ValidationError } from "@/types/validation";
import {
    Box,
    Button,
    Group,
    LoadingOverlay,
    Select,
    Stack,
    Stepper,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck } from "@tabler/icons-react";
import axios from "axios";
import React from "react";

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

export const ItemForm: React.FC = () => {
    const [loading, setLoading] = React.useState(false);
    const [next_step_loading, setNextStepLoading] = React.useState(false);

    const [active, setActive] = React.useState(0);
    const [color_completions, setColorCompletions] = React.useState<Color[]>(
        []
    );
    const [selected_color_id, setSelectedColorId] = React.useState<
        string | null
    >(null);

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

    const onComplete = () => {
        setLoading(true);

        const values = form.getValues();

        // Type is always uppercase
        values.type = values.type.toUpperCase();

        values.color_id = selected_color_id
            ? parseInt(selected_color_id)
            : color_completions.at(0)?.color_id || null;

        axios
            .post(route("watched_items.store"), values)
            .then(() => window.location.reload())
            .catch((error) => {
                console.log(error);
                setValidationErrors(error.response.data.errors);
                if (validationErrors["type"] || validationErrors["no"])
                    setActive(0);
                else if (validationErrors["color_id"]) setActive(1);
            });
    };

    const nextStep = () => {
        if (active === 0) {
            if (form.getValues().type === "") {
                form.setFieldError("type", "Item type is required.");
                return;
            }

            if (form.getValues().no === "") {
                form.setFieldError("no", "Item number is required.");
                return;
            }

            setNextStepLoading(true);

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
                })
                .catch((err) => {
                    // If it is an error, assume the item did not exist.
                    form.setFieldError("no", "The item could not be found.");

                    console.error(err);
                })
                .finally(() => setNextStepLoading(false));
        }

        if (active === 1) onComplete();
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
                    visible={loading}
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
                    <Button onClick={nextStep} loading={next_step_loading}>
                        {active === 1 ? "Complete" : "Next step"}
                    </Button>
                </Group>
            </Box>
        </>
    );
};
