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

export type Item = {
    id: number;
    item_info: ItemInfo;
    color_id: number | null;
    new_or_used: "N" | "U";
};
