type ItemInfo = {
    category_id: number;
    created_at: string;
    dim_x: string;
    dim_y: string;
    dim_z: string;
    id: number;
    image_url: string;
    is_obsolete: number;
    name: string;
    no: string;
    thumbnail_url: string;
    type: string;
    updated_at: string;
    weight: string;
    year_released: number;
};

export type PriceGuide = {
    item_id: number;
    min_price: number;
    min_price_of_new: number;
    min_price_of_used: number;
    max_price: number;
    max_price_of_new: number;
    max_price_of_used: number;
    avg_price_of_new: number;
    avg_price_of_used: number;
    unit_quantity_of_new: number;
    unit_quantity_of_used: number;
    currency_code: string;
    total_quantity_of_new: number;
    total_quantity_of_used: number;

    price_details: PriceDetail[];
};

export type PriceDetail = {
    price_guide_id: number;
    new_or_used: "N" | "U";
    quantity: number;
    unit_price: number;
    shipping_available: boolean;
};

export type Item = {
    id: number;
    item_info: ItemInfo;
    price_guide: PriceGuide;
    color_id: number | null;
    colored_image_url: string;
};
