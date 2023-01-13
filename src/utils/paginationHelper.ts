import PaginationModel from "../models/core/paginationModel";

// pagination model verilerini olusturur
export const getPagination = (page: number, itemsPerPage: number, totalCount: number) => {
    let pm: PaginationModel = {
        page,
        items_per_page: itemsPerPage,
        total: totalCount,
        links: []
    };

    pm.first_page_url = `/?page=1`;
    pm.last_page = Math.floor((totalCount / itemsPerPage)) + ((totalCount % itemsPerPage) > 0 ? 1 : 0);
    pm.from = ((page - 1) * itemsPerPage) + 1;
    pm.to = (page * itemsPerPage) <= totalCount ? (page * itemsPerPage) : totalCount;
    pm.next_page_url = (page + 1) <= pm.last_page ? `/?page=${page + 1}` : null;
    pm.prev_page_url = (page - 1) > 0 ? `/?page=${page - 1}` : null;

    //#region create links

    // onceki linkini olustur
    pm.links.push({
        url: null,
        label: "&laquo; Previous",
        active: false,
        page: page === 1 ? null : page - 1
    });

    if (page - 2 > 0) {
        pm.links.push({
            url: `/?page=${page - 2}`,
            label: `${page - 2}`,
            active: false,
            page: page - 2
        });
    }
    if (page - 1 > 0) {
        pm.links.push({
            url: `/?page=${page - 1}`,
            label: `${page - 1}`,
            active: false,
            page: page - 1
        });
    }
    {
        pm.links.push({
            url: `/?page=${page}`,
            label: `${page}`,
            active: true,
            page: page
        });
    }
    if (page + 1 <= pm.last_page) {
        pm.links.push({
            url: `/?page=${page + 1}`,
            label: `${page + 1}`,
            active: false,
            page: page + 1
        });
    }
    if (page + 2 <= pm.last_page) {
        pm.links.push({
            url: `/?page=${page + 2}`,
            label: `${page + 2}`,
            active: false,
            page: page + 2
        });
    }
    // sonraki linkini olustur
    pm.links.push({
        url: `/?page=${page + 1}`,
        label: "Next &raquo;",
        active: false,
        page: page === pm.last_page ? null : page + 1
    });

    //#endregion

    return pm;
};