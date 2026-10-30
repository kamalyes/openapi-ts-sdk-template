'use strict';

// src/generated/configuration.ts
var Configuration = class {
  basePath;
  headers;
  constructor(parameters = {}) {
    this.basePath = parameters.basePath ?? "";
    this.headers = parameters.headers ?? {};
  }
};

// src/generated/base.ts
var fetchAxiosLikeInstance = {
  async request(config) {
    const fetchFn = globalThis.fetch;
    if (typeof fetchFn !== "function") {
      throw new Error(
        "No Axios-like instance was supplied, and global fetch is unavailable."
      );
    }
    const response = await fetchFn(
      appendQuery(config.url ?? "", config.params),
      {
        method: config.method,
        headers: config.headers,
        body: serializeBody(config.data)
      }
    );
    const contentType = response.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json") ? await response.json() : await response.text();
    return { data };
  }
};
var BaseAPI = class {
  configuration;
  axios;
  constructor(configuration = new Configuration(), axios = fetchAxiosLikeInstance) {
    this.configuration = configuration;
    this.axios = axios;
  }
  async request(args) {
    const response = await this.axios.request({
      ...args,
      url: `${this.configuration.basePath}${args.url ?? ""}`,
      headers: {
        ...this.configuration.headers,
        ...args.headers ?? {}
      }
    });
    return response.data;
  }
};
function appendQuery(url, params) {
  const pairs = Object.entries(params ?? {}).flatMap(([key, value]) => {
    if (value === void 0 || value === null) return [];
    const values = Array.isArray(value) ? value : [value];
    return values.map(
      (item) => `${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`
    );
  });
  if (pairs.length === 0) return url;
  return `${url}${url.includes("?") ? "&" : "?"}${pairs.join("&")}`;
}
function serializeBody(data) {
  if (data === void 0 || data === null || typeof data === "string")
    return data;
  return JSON.stringify(data);
}

// src/generated/apis/id-block-management-api.ts
var IdBlockManagementApi = class extends BaseAPI {
  /**
   * 从指定命名空间的中心序列取出 count 个 ID，调用方在本地缓冲后逐个发放 | Takes count ids from the central sequence of the given namespace for the caller to buffer and serve locally
   * @summary 申领 ID 号段 | Allocate an id block
   * @param body
   * @param options Override http request option.
   */
  async idBlockServiceIdBlockAllocate(body, options = {}) {
    const response = await this.request({
      ...options,
      method: "POST",
      url: `/v1/id-blocks/allocate`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} },
      data: body
    });
    return response;
  }
};

// src/generated/apis/product-management-api.ts
var ProductManagementApi = class extends BaseAPI {
  /**
   * @summary Product列表 | Product list
   * @param pageRequestPage 当前页码 | [EN] Current page number
   * @param pageRequestSize 每页条数（上限保护，防止一次拉全表） | [EN] Page size, capped to protect the backend
   * @param pageRequestTotal 总条数（响应字段，请求 query 不继承必填） | [EN] Total count
   * @param sortField 排序字段 | [EN] Sort field
   * @param sortAscending 是否升序 | [EN] Whether ascending
   * @param keyword 搜索关键词（名称、编码） | [EN] Search keyword (name, code)
   * @param tenantId 租户ID | [EN] Tenant ID
   * @param type 类型 | [EN] Type
   *
   * - PRODUCT_TYPE_UNSPECIFIED: 未指定 | [EN] Unspecified
   * - PRODUCT_TYPE_PERSONAL: 个人 | [EN] Personal
   * - PRODUCT_TYPE_ORGANIZATION: 组织 | [EN] Organization
   * @param status 状态 | [EN] Status
   *
   * - COMMON_STATUS_UNSPECIFIED: 未指定 | [EN] Unspecified
   * - COMMON_STATUS_NORMAL: 正常 | [EN] Normal
   * - COMMON_STATUS_DISABLED: 禁用 | [EN] Disabled
   * @param options Override http request option.
   */
  async productServiceProductList(pageRequestPage, pageRequestSize, pageRequestTotal, sortField, sortAscending, keyword, tenantId, type, status, options = {}) {
    const response = await this.request({
      ...options,
      method: "GET",
      url: `/v1/catalog/products`,
      params: {
        "page_request.page": pageRequestPage,
        "page_request.size": pageRequestSize,
        "page_request.total": pageRequestTotal,
        "sort.field": sortField,
        "sort.ascending": sortAscending,
        keyword,
        tenant_id: tenantId,
        type,
        status
      },
      headers: { ...options.headers ?? {}, ...{} }
    });
    return response;
  }
  /**
   * @summary 创建Product | Create Product
   * @param body
   * @param options Override http request option.
   */
  async productServiceProductCreate(body, options = {}) {
    const response = await this.request({
      ...options,
      method: "POST",
      url: `/v1/catalog/products`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} },
      data: body
    });
    return response;
  }
  /**
   * @summary 删除Product | Delete Product
   * @param productId ProductID | [EN] Product ID
   * @param options Override http request option.
   */
  async productServiceProductDelete(productId, options = {}) {
    const response = await this.request({
      ...options,
      method: "DELETE",
      url: `/v1/catalog/products/${encodeURIComponent(String(productId))}`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} }
    });
    return response;
  }
  /**
   * @summary 获取Product详情 | Get Product detail
   * @param productId ProductID | [EN] Product ID
   * @param options Override http request option.
   */
  async productServiceProductGet(productId, options = {}) {
    const response = await this.request({
      ...options,
      method: "GET",
      url: `/v1/catalog/products/${encodeURIComponent(String(productId))}`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} }
    });
    return response;
  }
  /**
   * @summary 更新Product | Update Product
   * @param productId ProductID | [EN] Product ID
   * @param body
   * @param options Override http request option.
   */
  async productServiceProductUpdate(productId, body, options = {}) {
    const response = await this.request({
      ...options,
      method: "PUT",
      url: `/v1/catalog/products/${encodeURIComponent(String(productId))}`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} },
      data: body
    });
    return response;
  }
  /**
   * @summary 更新Product状态 | Update Product status
   * @param productId ProductID | [EN] Product ID
   * @param body
   * @param options Override http request option.
   */
  async productServiceProductUpdateStatus(productId, body, options = {}) {
    const response = await this.request({
      ...options,
      method: "PATCH",
      url: `/v1/catalog/products/${encodeURIComponent(String(productId))}/status`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} },
      data: body
    });
    return response;
  }
  /**
   * @summary 批量删除Product | Batch delete Product
   * @param body
   * @param options Override http request option.
   */
  async productServiceProductBatchDelete(body, options = {}) {
    const response = await this.request({
      ...options,
      method: "POST",
      url: `/v1/catalog/products/batch-delete`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} },
      data: body
    });
    return response;
  }
};

// src/generated/apis/temp-key-management-api.ts
var TempKeyManagementApi = class extends BaseAPI {
  /**
   * 用签发时留存的私钥解密密文，校验场景一致与租户归属 | Decrypts with the stored private key, enforcing the scenario match and tenant ownership
   * @summary 解密 | Decrypt
   * @param body
   * @param options Override http request option.
   */
  async tempKeyServiceTempKeyDecrypt(body, options = {}) {
    const response = await this.request({
      ...options,
      method: "POST",
      url: `/v1/temp-keys/decrypt`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} },
      data: body
    });
    return response;
  }
  /**
   * 提前失效某个密钥，不等 TTL 到期 | Invalidates a key ahead of its TTL
   * @summary 销毁临时密钥 | Destroy a temporary key
   * @param body
   * @param options Override http request option.
   */
  async tempKeyServiceTempKeyDestroy(body, options = {}) {
    const response = await this.request({
      ...options,
      method: "POST",
      url: `/v1/temp-keys/destroy`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} },
      data: body
    });
    return response;
  }
  /**
   * 用服务端持有的密钥加密一段明文，供调用方验证加解密闭环 | Encrypts a short plaintext with the server-held key so the caller can verify the round trip
   * @summary 加密自检（调试用，生产应关闭）| Encrypt probe, for debugging; disable in production
   * @param body
   * @param options Override http request option.
   */
  async tempKeyServiceTempKeyEncryptProbe(body, options = {}) {
    const response = await this.request({
      ...options,
      method: "POST",
      url: `/v1/temp-keys/encrypt-probe`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} },
      data: body
    });
    return response;
  }
  /**
   * 按租户 + 场景生成一对 RSA 密钥，返回公钥与密钥ID，私钥留在服务端并随 TTL 过期 | Generates an RSA pair for the tenant and scenario, returns the public key and key id, and keeps the private key server-side under a TTL
   * @summary 签发临时密钥 | Issue a temporary key
   * @param body
   * @param options Override http request option.
   */
  async tempKeyServiceTempKeyIssue(body, options = {}) {
    const response = await this.request({
      ...options,
      method: "POST",
      url: `/v1/temp-keys/issue`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} },
      data: body
    });
    return response;
  }
};

// src/generated/apis/tenant-management-api.ts
var TenantManagementApi = class extends BaseAPI {
  /**
   * @summary Tenant列表 | Tenant list
   * @param pageRequestPage 当前页码 | [EN] Current page number
   * @param pageRequestSize 每页条数（上限保护，防止一次拉全表） | [EN] Page size, capped to protect the backend
   * @param pageRequestTotal 总条数（响应字段，请求 query 不继承必填） | [EN] Total count
   * @param sortField 排序字段 | [EN] Sort field
   * @param sortAscending 是否升序 | [EN] Whether ascending
   * @param keyword 关键词（编码、名称）| [EN] Keyword (code, name)
   * @param status 状态 | [EN] Status
   *
   * - TENANT_STATUS_UNSPECIFIED: 未指定 | [EN] Unspecified
   * - TENANT_STATUS_PENDING: 待激活 | [EN] Pending activation
   * - TENANT_STATUS_NORMAL: 正常 | [EN] Normal
   * - TENANT_STATUS_FROZEN: 冻结 | [EN] Frozen
   * @param regionId 按地区过滤 | [EN] Filter by region
   * @param options Override http request option.
   */
  async tenantServiceTenantList(pageRequestPage, pageRequestSize, pageRequestTotal, sortField, sortAscending, keyword, status, regionId, options = {}) {
    const response = await this.request({
      ...options,
      method: "GET",
      url: `/v1/tenant/tenants`,
      params: {
        "page_request.page": pageRequestPage,
        "page_request.size": pageRequestSize,
        "page_request.total": pageRequestTotal,
        "sort.field": sortField,
        "sort.ascending": sortAscending,
        keyword,
        status,
        region_id: regionId
      },
      headers: { ...options.headers ?? {}, ...{} }
    });
    return response;
  }
  /**
   * @summary 创建Tenant | Create Tenant
   * @param body
   * @param options Override http request option.
   */
  async tenantServiceTenantCreate(body, options = {}) {
    const response = await this.request({
      ...options,
      method: "POST",
      url: `/v1/tenant/tenants`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} },
      data: body
    });
    return response;
  }
  /**
   * @summary 删除Tenant | Delete Tenant
   * @param tenantId TenantID | [EN] Tenant ID
   * @param options Override http request option.
   */
  async tenantServiceTenantDelete(tenantId, options = {}) {
    const response = await this.request({
      ...options,
      method: "DELETE",
      url: `/v1/tenant/tenants/${encodeURIComponent(String(tenantId))}`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} }
    });
    return response;
  }
  /**
   * @summary 获取Tenant详情 | Get Tenant detail
   * @param tenantId TenantID | [EN] Tenant ID
   * @param options Override http request option.
   */
  async tenantServiceTenantGet(tenantId, options = {}) {
    const response = await this.request({
      ...options,
      method: "GET",
      url: `/v1/tenant/tenants/${encodeURIComponent(String(tenantId))}`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} }
    });
    return response;
  }
  /**
   * @summary 更新Tenant | Update Tenant
   * @param tenantId TenantID | [EN] Tenant ID
   * @param body
   * @param options Override http request option.
   */
  async tenantServiceTenantUpdate(tenantId, body, options = {}) {
    const response = await this.request({
      ...options,
      method: "PUT",
      url: `/v1/tenant/tenants/${encodeURIComponent(String(tenantId))}`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} },
      data: body
    });
    return response;
  }
  /**
   * @summary 分配地区 | Assign region
   * @param tenantId TenantID | [EN] Tenant ID
   * @param body
   * @param options Override http request option.
   */
  async tenantServiceTenantRegionAssign(tenantId, body, options = {}) {
    const response = await this.request({
      ...options,
      method: "POST",
      url: `/v1/tenant/tenants/${encodeURIComponent(String(tenantId))}/region-assignments`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} },
      data: body
    });
    return response;
  }
  /**
   * @summary 移除地区分配 | Remove region assignment
   * @param tenantId TenantID | [EN] Tenant ID
   * @param assignmentId 分配ID | [EN] Assignment ID
   * @param options Override http request option.
   */
  async tenantServiceTenantRegionAssignmentRemove(tenantId, assignmentId, options = {}) {
    const response = await this.request({
      ...options,
      method: "DELETE",
      url: `/v1/tenant/tenants/${encodeURIComponent(String(tenantId))}/region-assignments/${encodeURIComponent(String(assignmentId))}`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} }
    });
    return response;
  }
  /**
   * @summary 更新地区分配 | Update region assignment
   * @param tenantId TenantID | [EN] Tenant ID
   * @param assignmentId 分配ID | [EN] Assignment ID
   * @param body
   * @param options Override http request option.
   */
  async tenantServiceTenantRegionAssignmentUpdate(tenantId, assignmentId, body, options = {}) {
    const response = await this.request({
      ...options,
      method: "PUT",
      url: `/v1/tenant/tenants/${encodeURIComponent(String(tenantId))}/region-assignments/${encodeURIComponent(String(assignmentId))}`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} },
      data: body
    });
    return response;
  }
  /**
   * @summary 重试下游同步 | Retry downstream sync
   * @param tenantId TenantID | [EN] Tenant ID
   * @param body
   * @param options Override http request option.
   */
  async tenantServiceTenantRetrySync(tenantId, body, options = {}) {
    const response = await this.request({
      ...options,
      method: "POST",
      url: `/v1/tenant/tenants/${encodeURIComponent(String(tenantId))}/retry-sync`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} },
      data: body
    });
    return response;
  }
};

// src/generated/apis/tenant-member-management-api.ts
var TenantMemberManagementApi = class extends BaseAPI {
  /**
   * @summary 成员列表 | Member list
   * @param tenantId 所属TenantID | [EN] Owning Tenant ID
   * @param pageRequestPage 当前页码 | [EN] Current page number
   * @param pageRequestSize 每页条数（上限保护，防止一次拉全表） | [EN] Page size, capped to protect the backend
   * @param pageRequestTotal 总条数（响应字段，请求 query 不继承必填） | [EN] Total count
   * @param role 按角色过滤 | [EN] Filter by role
   *
   * - TENANT_MEMBER_ROLE_UNSPECIFIED: 未指定 | [EN] Unspecified
   * - TENANT_MEMBER_ROLE_OWNER: 所有者 | [EN] Owner
   * - TENANT_MEMBER_ROLE_ADMIN: 管理员 | [EN] Admin
   * - TENANT_MEMBER_ROLE_VIEWER: 只读 | [EN] Viewer
   * @param status 按状态过滤 | [EN] Filter by status
   *
   * - COMMON_STATUS_UNSPECIFIED: 未指定 | [EN] Unspecified
   * - COMMON_STATUS_NORMAL: 正常 | [EN] Normal
   * - COMMON_STATUS_DISABLED: 禁用 | [EN] Disabled
   * @param options Override http request option.
   */
  async tenantMemberServiceTenantMemberList(tenantId, pageRequestPage, pageRequestSize, pageRequestTotal, role, status, options = {}) {
    const response = await this.request({
      ...options,
      method: "GET",
      url: `/v1/tenant/tenants/${encodeURIComponent(String(tenantId))}/members`,
      params: {
        "page_request.page": pageRequestPage,
        "page_request.size": pageRequestSize,
        "page_request.total": pageRequestTotal,
        role,
        status
      },
      headers: { ...options.headers ?? {}, ...{} }
    });
    return response;
  }
  /**
   * @summary 添加成员 | Add member
   * @param tenantId 所属TenantID | [EN] Owning Tenant ID
   * @param body
   * @param options Override http request option.
   */
  async tenantMemberServiceTenantMemberAdd(tenantId, body, options = {}) {
    const response = await this.request({
      ...options,
      method: "POST",
      url: `/v1/tenant/tenants/${encodeURIComponent(String(tenantId))}/members`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} },
      data: body
    });
    return response;
  }
  /**
   * @summary 移除成员 | Remove member
   * @param tenantId 所属TenantID | [EN] Owning Tenant ID
   * @param memberId 成员ID | [EN] Member ID
   * @param options Override http request option.
   */
  async tenantMemberServiceTenantMemberRemove(tenantId, memberId, options = {}) {
    const response = await this.request({
      ...options,
      method: "DELETE",
      url: `/v1/tenant/tenants/${encodeURIComponent(String(tenantId))}/members/${encodeURIComponent(String(memberId))}`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} }
    });
    return response;
  }
  /**
   * @summary 覆盖成员角色 | Replace member roles
   * @param tenantId 所属TenantID | [EN] Owning Tenant ID
   * @param memberId 成员ID | [EN] Member ID
   * @param body
   * @param options Override http request option.
   */
  async tenantMemberServiceTenantMemberRoleReplace(tenantId, memberId, body, options = {}) {
    const response = await this.request({
      ...options,
      method: "PUT",
      url: `/v1/tenant/tenants/${encodeURIComponent(String(tenantId))}/members/${encodeURIComponent(String(memberId))}/roles`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} },
      data: body
    });
    return response;
  }
  /**
   * @summary 批量邀请成员 | Batch invite members
   * @param tenantId 所属TenantID | [EN] Owning Tenant ID
   * @param body
   * @param options Override http request option.
   */
  async tenantMemberServiceTenantMemberBatchInvite(tenantId, body, options = {}) {
    const response = await this.request({
      ...options,
      method: "POST",
      url: `/v1/tenant/tenants/${encodeURIComponent(String(tenantId))}/members/batch-invite`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} },
      data: body
    });
    return response;
  }
};

// src/generated/apis/warehouse-management-api.ts
var WarehouseManagementApi = class extends BaseAPI {
  /**
   * @summary Warehouse列表 | Warehouse list
   * @param pageRequestPage 当前页码 | [EN] Current page number
   * @param pageRequestSize 每页条数（上限保护，防止一次拉全表） | [EN] Page size, capped to protect the backend
   * @param pageRequestTotal 总条数（响应字段，请求 query 不继承必填） | [EN] Total count
   * @param sortField 排序字段 | [EN] Sort field
   * @param sortAscending 是否升序 | [EN] Whether ascending
   * @param keyword 搜索关键词 | [EN] Search keyword
   * @param category 分类 | [EN] Category
   *
   * - WAREHOUSE_CATEGORY_UNSPECIFIED: 未指定 | [EN] Unspecified
   * - WAREHOUSE_CATEGORY_STANDARD: 标准 | [EN] Standard
   * - WAREHOUSE_CATEGORY_PREMIUM: 高级 | [EN] Premium
   * @param status 状态 | [EN] Status
   *
   * - COMMON_STATUS_UNSPECIFIED: 未指定 | [EN] Unspecified
   * - COMMON_STATUS_NORMAL: 正常 | [EN] Normal
   * - COMMON_STATUS_DISABLED: 禁用 | [EN] Disabled
   * @param options Override http request option.
   */
  async warehouseServiceWarehouseList(pageRequestPage, pageRequestSize, pageRequestTotal, sortField, sortAscending, keyword, category, status, options = {}) {
    const response = await this.request({
      ...options,
      method: "GET",
      url: `/v1/inventory/warehouses`,
      params: {
        "page_request.page": pageRequestPage,
        "page_request.size": pageRequestSize,
        "page_request.total": pageRequestTotal,
        "sort.field": sortField,
        "sort.ascending": sortAscending,
        keyword,
        category,
        status
      },
      headers: { ...options.headers ?? {}, ...{} }
    });
    return response;
  }
  /**
   * @summary 创建Warehouse | Create Warehouse
   * @param body
   * @param options Override http request option.
   */
  async warehouseServiceWarehouseCreate(body, options = {}) {
    const response = await this.request({
      ...options,
      method: "POST",
      url: `/v1/inventory/warehouses`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} },
      data: body
    });
    return response;
  }
  /**
   * @summary 删除Warehouse | Delete Warehouse
   * @param warehouseId WarehouseID | [EN] Warehouse ID
   * @param options Override http request option.
   */
  async warehouseServiceWarehouseDelete(warehouseId, options = {}) {
    const response = await this.request({
      ...options,
      method: "DELETE",
      url: `/v1/inventory/warehouses/${encodeURIComponent(String(warehouseId))}`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} }
    });
    return response;
  }
  /**
   * @summary 获取Warehouse详情 | Get Warehouse detail
   * @param warehouseId WarehouseID | [EN] Warehouse ID
   * @param options Override http request option.
   */
  async warehouseServiceWarehouseGet(warehouseId, options = {}) {
    const response = await this.request({
      ...options,
      method: "GET",
      url: `/v1/inventory/warehouses/${encodeURIComponent(String(warehouseId))}`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} }
    });
    return response;
  }
  /**
   * @summary 更新Warehouse | Update Warehouse
   * @param warehouseId WarehouseID | [EN] Warehouse ID
   * @param body
   * @param options Override http request option.
   */
  async warehouseServiceWarehouseUpdate(warehouseId, body, options = {}) {
    const response = await this.request({
      ...options,
      method: "PUT",
      url: `/v1/inventory/warehouses/${encodeURIComponent(String(warehouseId))}`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} },
      data: body
    });
    return response;
  }
  /**
   * @summary 启停Warehouse | Toggle Warehouse
   * @param warehouseId WarehouseID | [EN] Warehouse ID
   * @param body
   * @param options Override http request option.
   */
  async warehouseServiceWarehouseUpdateStatus(warehouseId, body, options = {}) {
    const response = await this.request({
      ...options,
      method: "PATCH",
      url: `/v1/inventory/warehouses/${encodeURIComponent(String(warehouseId))}/status`,
      params: {},
      headers: { ...options.headers ?? {}, ...{} },
      data: body
    });
    return response;
  }
};

// src/generated/enums/common.ts
var EnumsCommonStatus = /* @__PURE__ */ ((EnumsCommonStatus2) => {
  EnumsCommonStatus2["COMMON_STATUS_UNSPECIFIED"] = "COMMON_STATUS_UNSPECIFIED";
  EnumsCommonStatus2["COMMON_STATUS_NORMAL"] = "COMMON_STATUS_NORMAL";
  EnumsCommonStatus2["COMMON_STATUS_DISABLED"] = "COMMON_STATUS_DISABLED";
  return EnumsCommonStatus2;
})(EnumsCommonStatus || {});
var EnumsKeyScenario = /* @__PURE__ */ ((EnumsKeyScenario2) => {
  EnumsKeyScenario2["KEY_SCENARIO_UNSPECIFIED"] = "KEY_SCENARIO_UNSPECIFIED";
  EnumsKeyScenario2["KEY_SCENARIO_LOGIN"] = "KEY_SCENARIO_LOGIN";
  EnumsKeyScenario2["KEY_SCENARIO_PAYMENT"] = "KEY_SCENARIO_PAYMENT";
  EnumsKeyScenario2["KEY_SCENARIO_PROFILE"] = "KEY_SCENARIO_PROFILE";
  return EnumsKeyScenario2;
})(EnumsKeyScenario || {});
var EnumsProductLevel = /* @__PURE__ */ ((EnumsProductLevel2) => {
  EnumsProductLevel2["PRODUCT_LEVEL_UNSPECIFIED"] = "PRODUCT_LEVEL_UNSPECIFIED";
  EnumsProductLevel2["PRODUCT_LEVEL_BRONZE"] = "PRODUCT_LEVEL_BRONZE";
  EnumsProductLevel2["PRODUCT_LEVEL_SILVER"] = "PRODUCT_LEVEL_SILVER";
  EnumsProductLevel2["PRODUCT_LEVEL_GOLD"] = "PRODUCT_LEVEL_GOLD";
  return EnumsProductLevel2;
})(EnumsProductLevel || {});
var EnumsProductType = /* @__PURE__ */ ((EnumsProductType2) => {
  EnumsProductType2["PRODUCT_TYPE_UNSPECIFIED"] = "PRODUCT_TYPE_UNSPECIFIED";
  EnumsProductType2["PRODUCT_TYPE_PERSONAL"] = "PRODUCT_TYPE_PERSONAL";
  EnumsProductType2["PRODUCT_TYPE_ORGANIZATION"] = "PRODUCT_TYPE_ORGANIZATION";
  return EnumsProductType2;
})(EnumsProductType || {});
var EnumsRsaKeySize = /* @__PURE__ */ ((EnumsRsaKeySize2) => {
  EnumsRsaKeySize2["RSA_KEY_SIZE_UNSPECIFIED"] = "RSA_KEY_SIZE_UNSPECIFIED";
  EnumsRsaKeySize2["RSA_KEY_SIZE_1024"] = "RSA_KEY_SIZE_1024";
  EnumsRsaKeySize2["RSA_KEY_SIZE_2048"] = "RSA_KEY_SIZE_2048";
  EnumsRsaKeySize2["RSA_KEY_SIZE_4096"] = "RSA_KEY_SIZE_4096";
  return EnumsRsaKeySize2;
})(EnumsRsaKeySize || {});
var EnumsTenantMemberRole = /* @__PURE__ */ ((EnumsTenantMemberRole2) => {
  EnumsTenantMemberRole2["TENANT_MEMBER_ROLE_UNSPECIFIED"] = "TENANT_MEMBER_ROLE_UNSPECIFIED";
  EnumsTenantMemberRole2["TENANT_MEMBER_ROLE_OWNER"] = "TENANT_MEMBER_ROLE_OWNER";
  EnumsTenantMemberRole2["TENANT_MEMBER_ROLE_ADMIN"] = "TENANT_MEMBER_ROLE_ADMIN";
  EnumsTenantMemberRole2["TENANT_MEMBER_ROLE_VIEWER"] = "TENANT_MEMBER_ROLE_VIEWER";
  return EnumsTenantMemberRole2;
})(EnumsTenantMemberRole || {});
var EnumsTenantStatus = /* @__PURE__ */ ((EnumsTenantStatus2) => {
  EnumsTenantStatus2["TENANT_STATUS_UNSPECIFIED"] = "TENANT_STATUS_UNSPECIFIED";
  EnumsTenantStatus2["TENANT_STATUS_PENDING"] = "TENANT_STATUS_PENDING";
  EnumsTenantStatus2["TENANT_STATUS_NORMAL"] = "TENANT_STATUS_NORMAL";
  EnumsTenantStatus2["TENANT_STATUS_FROZEN"] = "TENANT_STATUS_FROZEN";
  return EnumsTenantStatus2;
})(EnumsTenantStatus || {});
var EnumsTenantSyncState = /* @__PURE__ */ ((EnumsTenantSyncState2) => {
  EnumsTenantSyncState2["TENANT_SYNC_STATE_UNSPECIFIED"] = "TENANT_SYNC_STATE_UNSPECIFIED";
  EnumsTenantSyncState2["TENANT_SYNC_STATE_PENDING"] = "TENANT_SYNC_STATE_PENDING";
  EnumsTenantSyncState2["TENANT_SYNC_STATE_SYNCED"] = "TENANT_SYNC_STATE_SYNCED";
  EnumsTenantSyncState2["TENANT_SYNC_STATE_FAILED"] = "TENANT_SYNC_STATE_FAILED";
  return EnumsTenantSyncState2;
})(EnumsTenantSyncState || {});
var EnumsWarehouseCategory = /* @__PURE__ */ ((EnumsWarehouseCategory2) => {
  EnumsWarehouseCategory2["WAREHOUSE_CATEGORY_UNSPECIFIED"] = "WAREHOUSE_CATEGORY_UNSPECIFIED";
  EnumsWarehouseCategory2["WAREHOUSE_CATEGORY_STANDARD"] = "WAREHOUSE_CATEGORY_STANDARD";
  EnumsWarehouseCategory2["WAREHOUSE_CATEGORY_PREMIUM"] = "WAREHOUSE_CATEGORY_PREMIUM";
  return EnumsWarehouseCategory2;
})(EnumsWarehouseCategory || {});

// src/http.ts
var HttpError = class extends Error {
  /** HTTP 状态码 | HTTP status code */
  status;
  /** 实际请求的完整 URL（含 query）| The full requested URL, query included */
  url;
  /** 解析后的响应体 | Parsed response body */
  body;
  constructor(message, init) {
    super(message);
    this.name = "HttpError";
    this.status = init.status;
    this.url = init.url;
    this.body = init.body;
  }
};
var RETRYABLE_STATUS = /* @__PURE__ */ new Set([408, 425, 429, 500, 502, 503, 504]);
var BINARY_BODY_TYPES = /* @__PURE__ */ new Set([
  "FormData",
  "URLSearchParams",
  "Blob",
  "File",
  "ArrayBuffer",
  "Uint8Array",
  "ReadableStream"
]);
function createHttpClient(options = {}) {
  const {
    headers: baseHeaders = {},
    timeoutMs = 1e4,
    retries = 0,
    retryDelayMs = 200,
    fetch: injectedFetch,
    onRequest,
    onResponse
  } = options;
  async function request(config) {
    const fetchFn = injectedFetch ?? globalThis.fetch;
    if (typeof fetchFn !== "function") {
      throw new Error("\u5F53\u524D\u73AF\u5883\u6CA1\u6709\u5168\u5C40 fetch\uFF0C\u8BF7\u901A\u8FC7 createHttpClient({ fetch }) \u6CE8\u5165\u5B9E\u73B0");
    }
    await onRequest?.(config);
    const url = appendQuery2(config.url ?? "", config.params);
    const method = (config.method ?? "GET").toUpperCase();
    const headers = { ...baseHeaders, ...config.headers ?? {} };
    const body = serializeBody2(config.data, headers);
    const timeout = config.timeoutMs ?? timeoutMs;
    const attempts = Math.max(0, retries) + 1;
    let lastError;
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const controller = new AbortController();
      const abortUpstream = () => controller.abort();
      let timer;
      if (timeout > 0) {
        timer = setTimeout(abortUpstream, timeout);
      }
      config.signal?.addEventListener("abort", abortUpstream);
      try {
        const response = await fetchFn(url, {
          method,
          headers,
          body,
          signal: controller.signal
        });
        const result = {
          data: await parseBody(response),
          status: response.status,
          headers: collectHeaders(response)
        };
        await onResponse?.(result);
        if (!response.ok) {
          const reason = `${response.status} ${response.statusText}`;
          throw new HttpError(`HTTP ${reason} on ${method} ${url}`, {
            status: response.status,
            url,
            body: result.data
          });
        }
        return result;
      } catch (error) {
        lastError = error;
        if (!isRetryable(error) || attempt === attempts - 1) {
          throw error;
        }
        await delay(retryDelayMs * 2 ** attempt);
      } finally {
        if (timer !== void 0) {
          clearTimeout(timer);
        }
        config.signal?.removeEventListener("abort", abortUpstream);
      }
    }
    throw lastError;
  }
  return { request };
}
function isRetryable(error) {
  if (error instanceof HttpError) {
    return RETRYABLE_STATUS.has(error.status);
  }
  if (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError")) {
    return false;
  }
  return true;
}
function appendQuery2(url, params) {
  const pairs = [];
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === void 0 || value === null) continue;
    const items = Array.isArray(value) ? value : [value];
    for (const item of items) {
      if (item === void 0 || item === null) continue;
      pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(stringifyParam(item))}`);
    }
  }
  if (pairs.length === 0) return url;
  return `${url}${url.includes("?") ? "&" : "?"}${pairs.join("&")}`;
}
function stringifyParam(value) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
function serializeBody2(data, headers) {
  if (data === void 0 || data === null) return void 0;
  if (typeof data === "string") return data;
  if (isBinaryBody(data)) return data;
  if (!hasHeader(headers, "content-type")) {
    headers["Content-Type"] = "application/json";
  }
  return JSON.stringify(data);
}
function isBinaryBody(data) {
  if (typeof data !== "object" || data === null) return false;
  return BINARY_BODY_TYPES.has(data.constructor?.name ?? "");
}
function hasHeader(headers, name) {
  return Object.keys(headers).some((key) => key.toLowerCase() === name);
}
async function parseBody(response) {
  const text = await response.text();
  if (!text) return void 0;
  if (!(response.headers.get("content-type") ?? "").includes("json")) return text;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
function collectHeaders(response) {
  const headers = {};
  response.headers.forEach((value, name) => {
    headers[name.toLowerCase()] = value;
  });
  return headers;
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// src/index.ts
var DEFAULT_BASE_PATH = "";

exports.Configuration = Configuration;
exports.DEFAULT_BASE_PATH = DEFAULT_BASE_PATH;
exports.EnumsCommonStatus = EnumsCommonStatus;
exports.EnumsKeyScenario = EnumsKeyScenario;
exports.EnumsProductLevel = EnumsProductLevel;
exports.EnumsProductType = EnumsProductType;
exports.EnumsRsaKeySize = EnumsRsaKeySize;
exports.EnumsTenantMemberRole = EnumsTenantMemberRole;
exports.EnumsTenantStatus = EnumsTenantStatus;
exports.EnumsTenantSyncState = EnumsTenantSyncState;
exports.EnumsWarehouseCategory = EnumsWarehouseCategory;
exports.HttpError = HttpError;
exports.IdBlockManagementApi = IdBlockManagementApi;
exports.ProductManagementApi = ProductManagementApi;
exports.TempKeyManagementApi = TempKeyManagementApi;
exports.TenantManagementApi = TenantManagementApi;
exports.TenantMemberManagementApi = TenantMemberManagementApi;
exports.WarehouseManagementApi = WarehouseManagementApi;
exports.createHttpClient = createHttpClient;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map