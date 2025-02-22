export enum Permission {

  ACCESS_ALL =  "accessAll",
  PERM_PHONE_NO_ACCESS_ALL_DRIVERS = 'permPhoneNoAccessAll:drivers',
  ACCESS_ALL_DRIVERS = 'accessAll:drivers',
  VIEW_DRIVERS = 'view:drivers',
  CREATE_DRIVERS = 'create:drivers',
  EDIT_DRIVERS = 'edit:drivers',
  DELETE_DRIVERS = 'delete:drivers',

    VIEW_ADMINS = 'admins:read',
    CREATE_ADMINS = 'admins:create',
    EDIT_ADMINS = 'admins:update',
    DELETE_ADMINS = 'admins:delete',
    VIEW_HOTELS = 'view:hotels',
    ACCESS_ALL_HOTELS = 'accessAll:hotels',
    CREATE_HOTELS = 'create:hotels',
    EDIT_HOTELS = 'edit:hotels',
    DELETE_HOTELS = 'delete:hotels',
    ACCESS_ALL_VENDORS = 'accessAll:vendors',
    CREATE_VENDORS = 'create:vendors',
    EDIT_VENDORS = 'edit:vendors',
    DELETE_VENDORS = 'delete:vendors',
    VIEW_VENDORS = 'view:vendors',
    ACCESS_ALL_PRODUCTS = 'accessAll:products',
    VIEW_PRODUCTS = 'view:products',
    CREATE_PRODUCTS = 'create:products',
    EDIT_PRODUCTS = 'edit:products',
    DELETE_PRODUCTS = 'delete:products',
    ACCESS_ALL_ORDERS = 'accessAll:orders',
    VIEW_ORDERS = 'view:orders',
    CREATE_ORDERS = 'create:orders',
    EDIT_ORDERS = 'edit:orders',
    DELETE_ORDERS = 'delete:orders',
    VIEW_SERVICES = 'view:serviceOrders',
    CREATE_SERVICES = 'create:serviceOrders',
    EDIT_SERVICES = 'edit:serviceOrders',
    DELETE_SERVICES = 'delete:serviceOrders',
    VIEW_SERVICE_ORDERS = 'view:serviceOrders',
    CREATE_SERVICE_ORDERS = 'create:serviceOrders',
    EDIT_SERVICE_ORDERS = 'edit:serviceOrders',
    DELETE_SERVICE_ORDERS = 'delete:serviceOrders',
    VIEW_CATEGORIES = 'view:categories',
    CREATE_CATEGORIES = 'create:categories',
    EDIT_CATEGORIES = 'edit:categories',
    DELETE_CATEGORIES = 'delete:categories',
    //store
    VIEW_STORES = 'view:stores',
    CREATE_STORES = 'create:stores',
    EDIT_STORES = 'edit:stores',
    DELETE_STORES = 'delete:stores',
  }
  
  export enum Role {
    SUPER_ADMIN = 'SUPER_ADMIN',
    REGIONAL_ADMIN = 'REGIONAL_ADMIN',
  }
  
  export const RolePermissions: Record<Role, Permission[]> = {
    [Role.SUPER_ADMIN]: [

      Permission.ACCESS_ALL,
      Permission.ACCESS_ALL_DRIVERS,
      Permission.VIEW_DRIVERS,
      Permission.CREATE_DRIVERS,
      Permission.EDIT_DRIVERS,
      Permission.DELETE_DRIVERS,


      Permission.VIEW_ADMINS,
      Permission.CREATE_ADMINS,
      Permission.EDIT_ADMINS,
      Permission.DELETE_ADMINS,
      Permission.ACCESS_ALL_HOTELS,
      Permission.VIEW_HOTELS,
      Permission.CREATE_HOTELS,
      Permission.EDIT_HOTELS,
      Permission.DELETE_HOTELS,
      Permission.ACCESS_ALL_VENDORS,
      Permission.VIEW_VENDORS,
      Permission.CREATE_VENDORS,
      Permission.EDIT_VENDORS,
      Permission.DELETE_VENDORS,
      Permission.ACCESS_ALL_PRODUCTS,
      Permission.VIEW_PRODUCTS,
      Permission.CREATE_PRODUCTS,
      Permission.EDIT_PRODUCTS,
      Permission.DELETE_PRODUCTS,
      Permission.ACCESS_ALL_ORDERS,
      Permission.VIEW_ORDERS,
      Permission.CREATE_ORDERS,
      Permission.EDIT_ORDERS,
      Permission.DELETE_ORDERS,
      Permission.VIEW_SERVICES,
      Permission.CREATE_SERVICES,
      Permission.EDIT_SERVICES,
      Permission.DELETE_SERVICES,
      Permission.VIEW_SERVICE_ORDERS,
      Permission.CREATE_SERVICE_ORDERS,
      Permission.EDIT_SERVICE_ORDERS,
      Permission.DELETE_SERVICE_ORDERS,
      Permission.VIEW_CATEGORIES,
      Permission.CREATE_CATEGORIES,
      Permission.EDIT_CATEGORIES,
      Permission.DELETE_CATEGORIES,
      Permission.VIEW_STORES,
      Permission.CREATE_STORES,
      Permission.EDIT_STORES,
      Permission.DELETE_STORES
    ],
    [Role.REGIONAL_ADMIN]: [

      Permission.VIEW_DRIVERS,
      Permission.CREATE_DRIVERS,
      Permission.EDIT_DRIVERS,
      Permission.DELETE_DRIVERS,

      Permission.VIEW_HOTELS,
      Permission.CREATE_HOTELS,
      Permission.EDIT_HOTELS,
      Permission.DELETE_HOTELS,
      Permission.VIEW_VENDORS,
      Permission.CREATE_VENDORS,
      Permission.EDIT_VENDORS,
      Permission.DELETE_VENDORS,
      Permission.VIEW_PRODUCTS,
      Permission.CREATE_PRODUCTS,
      Permission.EDIT_PRODUCTS,
      Permission.DELETE_PRODUCTS,
      Permission.VIEW_SERVICE_ORDERS,
      Permission.CREATE_SERVICE_ORDERS,
      Permission.EDIT_SERVICE_ORDERS,
      Permission.DELETE_SERVICE_ORDERS,
      Permission.VIEW_STORES,
      Permission.CREATE_STORES,
      Permission.EDIT_STORES,
      Permission.DELETE_STORES
    ],
  };
  

  

  export function hasPermission(
    userRole: string,
    requiredPermission: Permission
  ): boolean {
    return RolePermissions[userRole].includes(requiredPermission);
  }



  export function hasAnyPermission(
    userPermissions: Permission[],
    requiredPermissions: Permission[]
  ): boolean {
    return requiredPermissions.some((permission) =>
      userPermissions.includes(permission)
    );
  }

