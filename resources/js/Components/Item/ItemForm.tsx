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
import { set } from "lodash";
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

    const [color_completions, setColorCompletions] = React.useState<
        {
            for_select: { value: string; label: string; color_code: string };
            color_id: number;
        }[]
    >([]);

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
                    if (
                        knowns.data.length === 1 &&
                        knowns.data[0].color_id === 0
                    ) {
                        // The item doesn't have color.
                        setActive(1);
                        return;
                    }

                    let promises = [];
                    let color_completions_buffer: typeof color_completions = [];

                    for (const known of knowns.data) {
                        promises.push(
                            getColorDetail(known.color_id).then((color) => {
                                color_completions_buffer.push({
                                    for_select: {
                                        value: color.color_id.toString(),
                                        label: color.color_name,
                                        color_code: color.color_code,
                                    },
                                    color_id: color.color_id,
                                });
                            })
                        );
                    }

                    Promise.all(promises).then(() => {
                        setColorCompletions(color_completions_buffer);
                        setActive((current) => current + 1);
                    });
                })
                .catch((err) => {
                    // If it is an error, assume the item did not exist.
                    form.setFieldError("no", "The item could not be found.");

                    console.error(err);
                });
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
        if (Object.keys(validationErrors).length === 0) return;

        const keys = Object.keys(form.getValues());

        keys.forEach((key) => {
            const errors = validationErrors[key];
            if (errors) form.setFieldError(key, errors[0]);
        });
    })();

    // Reset next step loading when the active step changes.
    React.useEffect(() => {
        setNextStepLoading(false);
    }, [active]);

    return (
        <>
            <Box pos="relative">
                <LoadingOverlay
                    visible={loading}
                    zIndex={1002}
                    overlayProps={{ radius: "sm", blur: 2 }}
                />

                <Stepper
                    active={active}
                    onStepClick={setActive}
                    allowNextStepsSelect={false}
                >
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
                                    allowDeselect
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
                            required
                            label="Select color"
                            placeholder="Select color"
                            onChange={(value) => setSelectedColorId(value)}
                            value={selected_color_id}
                            data={color_completions.map(
                                (completion) => completion.for_select
                            )}
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
