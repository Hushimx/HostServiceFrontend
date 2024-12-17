export type Roles = "SuperAdmin" | "RegonalAdmin" | "vendor";

export const Permissions = {
    SuperAdmin: ["SuperAdmin"],
    RegonalAdmin: ["SuperAdmin", "RegonalAdmin"],
    vendor: ["SuperAdmin", "RegonalAdmin", "vendor"],
};
