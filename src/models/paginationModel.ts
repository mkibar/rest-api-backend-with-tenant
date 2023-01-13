export class PaginationModel {
    page: number;
    items_per_page: number;
    total: number;

    first_page_url?: string;
    next_page_url?: string | null;
    prev_page_url?: string | null;
    last_page?: number;
    from?: number;
    to?: number;
    links: LinkModel[];
}

export class LinkModel {
    url?: string | null;
    label?: string;
    active: boolean;
    page?: number | null;
}

export default PaginationModel;