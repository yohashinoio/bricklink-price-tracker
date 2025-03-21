import { PriceDetail } from "@/types/item";
import {
    ActionIcon,
    Box,
    Card,
    Popover,
    Slider,
    Tabs,
    Text,
} from "@mantine/core";
import { IconGraph } from "@tabler/icons-react";
import React from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { ShippingAvailabilityBadge } from "./ShippingBadge";

type Props = {
    price_details: PriceDetail[];
    currency_code: string;
};

const ShippingAvailableDot: React.FC<{
    cx: number;
    cy: number;
    payload: PriceDetail;
}> = ({ cx, cy, payload }) => {
    const fill = payload.shipping_available ? "green" : "red";

    return <circle cx={cx} cy={cy} r={2} fill={fill} />;
};

const CustomToolTip = ({ active, payload, currency_code }: any) => {
    if (active && payload && payload.length) {
        const pl = payload[0].payload;

        return (
            <Card shadow="xl">
                <Text>
                    Unit Price: {pl.unit_price} {currency_code}
                </Text>
                <Text mb={3}>Quantity: {pl.quantity}</Text>
                <ShippingAvailabilityBadge
                    availability={pl.shipping_available}
                />
            </Card>
        );
    }

    return null;
};

const PriceLineChart: React.FC<Props> = ({ price_details, currency_code }) => {
    const x_domain_lower = (() => {
        const n = Math.round(
            Math.min(...price_details.map((x) => x.unit_price)) - 50
        );
        if (n < 0) return 0;
        else return n;
    })();

    const y_domain_lower = (() => {
        const n = Math.round(
            Math.min(...price_details.map((x) => x.quantity)) - 5
        );
        if (n < 0) return 0;
        else return n;
    })();

    const tickFormatter = (value: any, _index: number): string => {
        return Math.round(value).toString();
    };

    return (
        <LineChart width={500} height={300} data={price_details}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />

            <Line
                name="Quantity"
                type="monotone"
                dataKey="quantity"
                stroke="#D3D3D3"
                dot={(props) => (
                    <ShippingAvailableDot
                        cx={props.cx}
                        cy={props.cy}
                        payload={props.payload}
                    />
                )}
            />

            <XAxis
                dataKey="unit_price"
                domain={[
                    x_domain_lower,
                    Math.round(
                        Math.max(...price_details.map((x) => x.unit_price)) + 50
                    ),
                ]}
                tickFormatter={tickFormatter}
            />
            <YAxis
                dataKey="quantity"
                domain={[
                    y_domain_lower,
                    Math.round(
                        Math.max(...price_details.map((x) => x.quantity)) + 5
                    ),
                ]}
                tickFormatter={tickFormatter}
            />

            <Tooltip
                content={<CustomToolTip currency_code={currency_code} />}
            />
        </LineChart>
    );
};

export const PriceGraph: React.FC<Props> = ({
    price_details,
    currency_code,
}) => {
    const price_details_of_new = React.useMemo(() => {
        const filtered = price_details.filter(
            (price_detail) => price_detail.new_or_used === "N"
        );

        return filtered.sort((a, b) => a.unit_price - b.unit_price);
    }, [price_details]);

    const price_details_of_used = React.useMemo(() => {
        const filtered = price_details.filter(
            (price_detail) => price_detail.new_or_used === "U"
        );

        return filtered.sort((a, b) => a.unit_price - b.unit_price);
    }, [price_details]);

    const [number_of_display_for_new, setNumberOfDisplayForNew] =
        React.useState(
            price_details_of_new.length < 50 ? price_details_of_new.length : 50
        );
    const [number_of_display_for_used, setNumberOfDisplayForUsed] =
        React.useState(
            price_details_of_used.length < 50
                ? price_details_of_used.length
                : 50
        );

    const slider_marks_for_new = [
        Math.round(price_details_of_new.length * 0.2),
        Math.round(price_details_of_new.length * 0.5),
        Math.round(price_details_of_new.length * 0.8),
    ];

    const slider_marks_for_used = [
        Math.round(price_details_of_used.length * 0.2),
        Math.round(price_details_of_used.length * 0.5),
        Math.round(price_details_of_used.length * 0.8),
    ];

    const chart_props = { currency_code: currency_code };

    return (
        <Popover position="bottom" withArrow shadow="md">
            <Popover.Target>
                <ActionIcon
                    size="lg"
                    variant="default"
                    aria-label={"Price Graph"}
                >
                    <IconGraph
                        style={{ width: "70%", height: "70%" }}
                        stroke={1.5}
                    />
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
                <Tabs defaultValue="New">
                    <Tabs.List mb={10}>
                        <Tabs.Tab value="New">New</Tabs.Tab>
                        <Tabs.Tab value="Used">Used</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="New">
                        <Slider
                            value={number_of_display_for_new}
                            onChange={setNumberOfDisplayForNew}
                            min={1}
                            max={price_details_of_new.length}
                            marks={slider_marks_for_new.map((value) => ({
                                value: value,
                                label: value,
                            }))}
                        />
                        <Box mt={30}>
                            <PriceLineChart
                                price_details={price_details_of_new.slice(
                                    0,
                                    number_of_display_for_new
                                )}
                                {...chart_props}
                            />
                        </Box>
                    </Tabs.Panel>

                    <Tabs.Panel value="Used">
                        <Slider
                            value={number_of_display_for_used}
                            onChange={setNumberOfDisplayForUsed}
                            min={1}
                            max={price_details_of_used.length}
                            marks={slider_marks_for_used.map((value) => ({
                                value: value,
                                label: value,
                            }))}
                        />
                        <Box mt={30}>
                            <PriceLineChart
                                price_details={price_details_of_used.slice(
                                    0,
                                    number_of_display_for_used
                                )}
                                {...chart_props}
                            />
                        </Box>
                    </Tabs.Panel>
                </Tabs>
            </Popover.Dropdown>
        </Popover>
    );
};
