import { PriceDetail } from "@/types/item";
import { ActionIcon, Popover, Tabs } from "@mantine/core";
import { IconGraph } from "@tabler/icons-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

type Props = {
    price_details: PriceDetail[];
};

const ShippingAvailableDot: React.FC<{
    cx: number;
    cy: number;
    payload: PriceDetail;
}> = ({ cx, cy, payload }) => {
    const fill = payload.shipping_available ? "#8884d8" : "red";

    return <circle cx={cx} cy={cy} r={2} fill={fill} />;
};

const PriceLineChart: React.FC<Props> = ({ price_details }) => {
    const price_details_with_serial = price_details.map(
        (price_detail, index) => {
            return { ...price_detail, serial: index + 1 };
        }
    );

    return (
        <LineChart width={500} height={300} data={price_details_with_serial}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />

            <Line
                type="monotone"
                dataKey="unit_price"
                stroke="#82ca9d"
                dot={(props) => (
                    <ShippingAvailableDot
                        cx={props.cx}
                        cy={props.cy}
                        payload={props.payload}
                    />
                )}
            />

            <YAxis
                dataKey="unit_price"
                domain={[
                    Math.round(
                        Math.min(...price_details.map((x) => x.unit_price)) - 50
                    ),
                    Math.round(
                        Math.max(...price_details.map((x) => x.unit_price)) + 50
                    ),
                ]}
            />
            <XAxis dataKey="serial" />
        </LineChart>
    );
};

export const PriceGraph: React.FC<Props> = ({ price_details }) => {
    const price_details_of_new = price_details.filter(
        (price_detail) => price_detail.new_or_used === "N"
    );
    price_details_of_new.sort((a, b) => a.unit_price - b.unit_price);

    const price_details_of_used = price_details.filter(
        (price_detail) => price_detail.new_or_used === "U"
    );
    price_details_of_used.sort((a, b) => a.unit_price - b.unit_price);

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
                        <PriceLineChart price_details={price_details_of_new} />
                    </Tabs.Panel>

                    <Tabs.Panel value="Used">
                        <PriceLineChart price_details={price_details_of_used} />
                    </Tabs.Panel>
                </Tabs>
            </Popover.Dropdown>
        </Popover>
    );
};
