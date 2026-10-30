interface ConfigurationParameters {
    basePath?: string;
    headers?: object;
}
declare class Configuration {
    readonly basePath: string;
    readonly headers: object;
    constructor(parameters?: ConfigurationParameters);
}

interface RequestArgs {
    method?: string;
    url?: string;
    params?: Record<string, unknown>;
    headers?: object;
    data?: unknown;
}
interface AxiosLikeInstance {
    request<T = unknown>(config: RequestArgs): Promise<{
        data: T;
    }>;
}
declare class BaseAPI {
    protected readonly configuration: Configuration;
    protected readonly axios: AxiosLikeInstance;
    constructor(configuration?: Configuration, axios?: AxiosLikeInstance);
    protected request<T>(args: RequestArgs): Promise<T>;
}

/**
 * - COMMON_STATUS_UNSPECIFIED: 未指定 | [EN] Unspecified
 * - COMMON_STATUS_NORMAL: 正常 | [EN] Normal
 * - COMMON_STATUS_DISABLED: 禁用 | [EN] Disabled
 */
declare enum EnumsCommonStatus {
    COMMON_STATUS_UNSPECIFIED = "COMMON_STATUS_UNSPECIFIED",
    COMMON_STATUS_NORMAL = "COMMON_STATUS_NORMAL",
    COMMON_STATUS_DISABLED = "COMMON_STATUS_DISABLED"
}
/**
 * 为什么密钥要绑场景：一对临时密钥如果不限用途，拿到登录场景公钥加密出来的密文
 * 就能送去支付场景解密。绑定场景之后，密钥在创建时就确定了用途，
 * 换场景使用会被直接拒绝，跨场景重放在协议层面就不成立。
 *
 * 新增场景必须在这里加枚举值，不要在服务侧用字符串自行扩展——
 * 那样下游按名称解析会得到未知值，而且各服务的拼写迟早对不上。
 *
 * [EN] An unscoped key pair lets ciphertext produced for the login flow be decrypted by the
 * payment flow. Binding the scenario fixes the purpose at creation time and makes a
 * cross-scenario replay impossible at the protocol level. A new scenario belongs here as an
 * enum value, never as an ad-hoc string on the service side, which decodes as unknown
 * downstream and eventually diverges in spelling between services.
 *
 * - KEY_SCENARIO_UNSPECIFIED: 未指定（视为非法请求）| [EN] Unspecified, treated as invalid
 * - KEY_SCENARIO_LOGIN: 登录凭据加密 | [EN] Login credentials
 * - KEY_SCENARIO_PAYMENT: 支付要素加密 | [EN] Payment details
 * - KEY_SCENARIO_PROFILE: 个人敏感资料加密 | [EN] Personal profile data
 */
declare enum EnumsKeyScenario {
    KEY_SCENARIO_UNSPECIFIED = "KEY_SCENARIO_UNSPECIFIED",
    KEY_SCENARIO_LOGIN = "KEY_SCENARIO_LOGIN",
    KEY_SCENARIO_PAYMENT = "KEY_SCENARIO_PAYMENT",
    KEY_SCENARIO_PROFILE = "KEY_SCENARIO_PROFILE"
}
/**
 * - PRODUCT_LEVEL_UNSPECIFIED: 未指定 | [EN] Unspecified
 * - PRODUCT_LEVEL_BRONZE: 青铜 | [EN] Bronze
 * - PRODUCT_LEVEL_SILVER: 白银 | [EN] Silver
 * - PRODUCT_LEVEL_GOLD: 黄金 | [EN] Gold
 */
declare enum EnumsProductLevel {
    PRODUCT_LEVEL_UNSPECIFIED = "PRODUCT_LEVEL_UNSPECIFIED",
    PRODUCT_LEVEL_BRONZE = "PRODUCT_LEVEL_BRONZE",
    PRODUCT_LEVEL_SILVER = "PRODUCT_LEVEL_SILVER",
    PRODUCT_LEVEL_GOLD = "PRODUCT_LEVEL_GOLD"
}
/**
 * - PRODUCT_TYPE_UNSPECIFIED: 未指定 | [EN] Unspecified
 * - PRODUCT_TYPE_PERSONAL: 个人 | [EN] Personal
 * - PRODUCT_TYPE_ORGANIZATION: 组织 | [EN] Organization
 */
declare enum EnumsProductType {
    PRODUCT_TYPE_UNSPECIFIED = "PRODUCT_TYPE_UNSPECIFIED",
    PRODUCT_TYPE_PERSONAL = "PRODUCT_TYPE_PERSONAL",
    PRODUCT_TYPE_ORGANIZATION = "PRODUCT_TYPE_ORGANIZATION"
}
/**
 * 用枚举而不是 int32：密钥长度不是任意数值，1000 位这种输入既不安全也生成不出来。
 * 枚举把合法取值固定在协议层，服务侧不必再校验一遍数值范围。
 *
 * 选型权衡：2048 是当前通用基线；4096 更强但生成明显更慢（量级差异，不是百分比），
 * 适合低频、长期有效的密钥；1024 已不满足现代安全要求，仅为兼容存量调用方保留。
 *
 * [EN] An enum rather than an int32, because a key size is not an arbitrary number: a value
 * like 1000 is neither secure nor constructible. The enum pins the legal values at the protocol
 * level so the service need not re-validate a numeric range. On the trade-off: 2048 is today's
 * general baseline; 4096 is stronger but markedly slower to generate, an order of magnitude
 * rather than a percentage, which suits infrequent long-lived keys; 1024 no longer meets modern
 * requirements and is kept only for existing callers.
 *
 * - RSA_KEY_SIZE_UNSPECIFIED: 未指定（服务侧取默认值）| [EN] Unspecified, the service picks a default
 * - RSA_KEY_SIZE_1024: 1024 位（已不推荐，仅兼容存量）| [EN] 1024-bit, legacy only
 * - RSA_KEY_SIZE_2048: 2048 位（推荐默认）| [EN] 2048-bit, recommended default
 * - RSA_KEY_SIZE_4096: 4096 位（生成慢，低频场景用）| [EN] 4096-bit, slow to generate
 */
declare enum EnumsRsaKeySize {
    RSA_KEY_SIZE_UNSPECIFIED = "RSA_KEY_SIZE_UNSPECIFIED",
    RSA_KEY_SIZE_1024 = "RSA_KEY_SIZE_1024",
    RSA_KEY_SIZE_2048 = "RSA_KEY_SIZE_2048",
    RSA_KEY_SIZE_4096 = "RSA_KEY_SIZE_4096"
}
/**
 * - TENANT_MEMBER_ROLE_UNSPECIFIED: 未指定 | [EN] Unspecified
 * - TENANT_MEMBER_ROLE_OWNER: 所有者 | [EN] Owner
 * - TENANT_MEMBER_ROLE_ADMIN: 管理员 | [EN] Admin
 * - TENANT_MEMBER_ROLE_VIEWER: 只读 | [EN] Viewer
 */
declare enum EnumsTenantMemberRole {
    TENANT_MEMBER_ROLE_UNSPECIFIED = "TENANT_MEMBER_ROLE_UNSPECIFIED",
    TENANT_MEMBER_ROLE_OWNER = "TENANT_MEMBER_ROLE_OWNER",
    TENANT_MEMBER_ROLE_ADMIN = "TENANT_MEMBER_ROLE_ADMIN",
    TENANT_MEMBER_ROLE_VIEWER = "TENANT_MEMBER_ROLE_VIEWER"
}
/**
 * - TENANT_STATUS_UNSPECIFIED: 未指定 | [EN] Unspecified
 * - TENANT_STATUS_PENDING: 待激活 | [EN] Pending activation
 * - TENANT_STATUS_NORMAL: 正常 | [EN] Normal
 * - TENANT_STATUS_FROZEN: 冻结 | [EN] Frozen
 */
declare enum EnumsTenantStatus {
    TENANT_STATUS_UNSPECIFIED = "TENANT_STATUS_UNSPECIFIED",
    TENANT_STATUS_PENDING = "TENANT_STATUS_PENDING",
    TENANT_STATUS_NORMAL = "TENANT_STATUS_NORMAL",
    TENANT_STATUS_FROZEN = "TENANT_STATUS_FROZEN"
}
/**
 * - TENANT_SYNC_STATE_UNSPECIFIED: 未指定 | [EN] Unspecified
 * - TENANT_SYNC_STATE_PENDING: 待同步 | [EN] Pending
 * - TENANT_SYNC_STATE_SYNCED: 已同步 | [EN] Synced
 * - TENANT_SYNC_STATE_FAILED: 同步失败 | [EN] Failed
 */
declare enum EnumsTenantSyncState {
    TENANT_SYNC_STATE_UNSPECIFIED = "TENANT_SYNC_STATE_UNSPECIFIED",
    TENANT_SYNC_STATE_PENDING = "TENANT_SYNC_STATE_PENDING",
    TENANT_SYNC_STATE_SYNCED = "TENANT_SYNC_STATE_SYNCED",
    TENANT_SYNC_STATE_FAILED = "TENANT_SYNC_STATE_FAILED"
}
/**
 * - WAREHOUSE_CATEGORY_UNSPECIFIED: 未指定 | [EN] Unspecified
 * - WAREHOUSE_CATEGORY_STANDARD: 标准 | [EN] Standard
 * - WAREHOUSE_CATEGORY_PREMIUM: 高级 | [EN] Premium
 */
declare enum EnumsWarehouseCategory {
    WAREHOUSE_CATEGORY_UNSPECIFIED = "WAREHOUSE_CATEGORY_UNSPECIFIED",
    WAREHOUSE_CATEGORY_STANDARD = "WAREHOUSE_CATEGORY_STANDARD",
    WAREHOUSE_CATEGORY_PREMIUM = "WAREHOUSE_CATEGORY_PREMIUM"
}

/**
 * 申领 ID 号段请求。
 * [EN] Allocate id block request
 */
interface KeyIdBlockAllocateRequest {
    /**
     * 有上限不是为了限流，是为了防住两件事：一次申领百万个会把响应体撑爆，
     * 而且那一段里绝大部分会随进程退出丢掉，等于白白跳号。
     * 调用方该做的是按消费速率调小号段并提高申领频率，不是一次要一大把。
     *
     * [EN] The cap is not rate limiting: claiming a million at once would blow up the response
     * body, and most of that block would be discarded at exit, burning numbers for nothing. The
     * right adjustment is a smaller block claimed more often, matched to the consumption rate.
     *
     * 申领数量 | [EN] How many ids to claim
     */
    count: number;
    /**
     * 必填且不要图省事复用：命名空间相同就是共用同一个序列，两个调用方的号段会交错。
     * 不会重复（序列是同一个），但一方的写入量会推高另一方的号，
     * 而且谁都查不出为什么——建议用「服务名:实体名」。
     *
     * [EN] Required, and not to be reused for convenience: an identical namespace means one
     * shared sequence, so two callers' blocks interleave. They do not collide, since it is the
     * same sequence, but one caller's volume pushes the other's numbers along and nobody can tell
     * why. A service-plus-entity name is the recommended form.
     *
     * 序列命名空间 | [EN] Sequence namespace
     */
    namespace: string;
}
/**
 * 申领 ID 号段响应。
 * [EN] Allocate id block response
 */
interface KeyIdBlockAllocateResponse {
    /**
     * 返回具体 ID 而不是「起止区间 + 格式规则」：返回区间更省带宽，但格式规则
     * 就落到了每个调用方身上，各自实现迟早会不一致，而不一致的表现是
     * 「同一个序列在不同服务里长得不一样」，事后极难统一。
     *
     * [EN] Concrete ids rather than a range plus a formatting rule: a range saves bandwidth but
     * moves the formatting into every caller, where the implementations eventually diverge and
     * the same sequence ends up looking different in different services, which is very hard to
     * reconcile afterwards.
     *
     * 已分配的 ID 列表 | [EN] Allocated ids
     */
    ids?: Array<string>;
    /**
     * 回显命名空间，便于调用方自检 | [EN] Echoed namespace for the caller to verify
     */
    namespace?: string;
}
/**
 * 临时密钥解密请求。
 * [EN] Temporary key decrypt request
 */
interface KeyTempKeyDecryptRequest {
    /**
     * 用公钥加密的密文 | [EN] Ciphertext encrypted with the public key
     */
    ciphertext: string;
    /**
     * 密钥ID | [EN] Key id
     */
    key_id: string;
    /**
     * 必须与签发时一致 | [EN] Must match the scenario used at issue
     */
    scenario: EnumsKeyScenario;
}
/**
 * 临时密钥解密响应。
 * [EN] Temporary key decrypt response
 */
interface KeyTempKeyDecryptResponse {
    /**
     * 明文 | [EN] Plaintext
     */
    plaintext?: string;
}
/**
 * 销毁临时密钥请求。
 * [EN] Destroy temporary key request
 */
interface KeyTempKeyDestroyRequest {
    /**
     * 密钥ID | [EN] Key id
     */
    key_id: string;
    /**
     * 必须与签发时一致 | [EN] Must match the scenario used at issue
     */
    scenario: EnumsKeyScenario;
}
/**
 * 销毁临时密钥响应。
 * [EN] Destroy temporary key response
 */
interface KeyTempKeyDestroyResponse {
    /**
     * 是否真的删掉了（false 表示本就不存在）| [EN] Whether a key was actually removed; false means it was already gone
     */
    destroyed?: boolean;
}
/**
 * 加密自检请求（调试用）。
 * [EN] Encrypt probe request, for debugging
 */
interface KeyTempKeyEncryptProbeRequest {
    /**
     * 密钥ID | [EN] Key id
     */
    key_id: string;
    /**
     * 待加密明文 | [EN] Plaintext to encrypt
     */
    plaintext: string;
    /**
     * 必须与签发时一致 | [EN] Must match the scenario used at issue
     */
    scenario: EnumsKeyScenario;
}
/**
 * 加密自检响应（调试用）。
 * [EN] Encrypt probe response, for debugging
 */
interface KeyTempKeyEncryptProbeResponse {
    /**
     * 密文，可直接送回 TempKeyDecrypt 验证闭环 | [EN] Ciphertext, feedable straight into TempKeyDecrypt to verify the round trip
     */
    ciphertext?: string;
}
/**
 * 签发临时密钥请求。
 * [EN] Issue temporary key request
 */
interface KeyTempKeyIssueRequest {
    /**
     * 密钥长度（不填由服务端取默认）| [EN] Key size, defaulted by the service when unset
     */
    key_size?: EnumsRsaKeySize;
    /**
     * 使用场景（必填，决定密钥用途）| [EN] Usage scenario, required
     */
    scenario: EnumsKeyScenario;
}
/**
 * 签发临时密钥响应。
 * [EN] Issue temporary key response
 */
interface KeyTempKeyIssueResponse {
    /**
     * 过期时间（Unix 秒）| [EN] Expiry as a Unix timestamp in seconds
     */
    expires_at?: string;
    /**
     * 密钥ID（后续解密/销毁凭此定位）| [EN] Key id used to locate the key later
     */
    key_id?: string;
    /**
     * PEM 格式公钥 | [EN] Public key in PEM format
     */
    public_key_pem?: string;
    /**
     * 回显场景，便于调用方自检 | [EN] Echoed scenario for the caller to verify
     */
    scenario?: EnumsKeyScenario;
}

declare class IdBlockManagementApi extends BaseAPI {
    /**
     * 从指定命名空间的中心序列取出 count 个 ID，调用方在本地缓冲后逐个发放 | Takes count ids from the central sequence of the given namespace for the caller to buffer and serve locally
     * @summary 申领 ID 号段 | Allocate an id block
     * @param body
     * @param options Override http request option.
     */
    idBlockServiceIdBlockAllocate(body: KeyIdBlockAllocateRequest, options?: RequestArgs): Promise<KeyIdBlockAllocateResponse>;
}

/**
 * 批量操作结果。
 * [EN] Batch operation result
 * 批量接口不要用「整体成功/失败」，按条返回才能让调用方精确重试。
 * [EN] Batch APIs report per-item results so callers can retry precisely
 */
interface CommonBatchResult {
    /**
     * 失败原因 | [EN] Error message
     */
    error_message?: string;
    /**
     * ID | [EN] ID
     */
    id?: string;
    /**
     * 是否成功 | [EN] Success
     */
    success?: boolean;
}
/**
 * 通用空响应。
 * [EN] General empty response
 */
interface CommonGeneralEmptyResponse {
}
/**
 * 分页信息。
 * [EN] Paging information
 * 请求与响应共用一个消息：请求里填 page/size，响应里回填 total
 * [EN] Shared by request and response: requests fill page/size, responses fill total
 */
interface CommonPaging {
    /**
     * 当前页码 | [EN] Current page number
     */
    page?: number;
    /**
     * 每页条数（上限保护，防止一次拉全表） | [EN] Page size, capped to protect the backend
     */
    size?: number;
    /**
     * 总条数（响应字段，请求 query 不继承必填） | [EN] Total count
     */
    total?: number;
}
/**
 * Product 联系方式。
 * [EN] Product contact
 * 嵌套消息示例：把高内聚的字段收成一个子结构，比平铺 5 个字段更好演进。
 * [EN] Nested message example: group cohesive fields instead of flattening them
 */
interface CommonProductContact {
    /**
     * 地址 | [EN] Address
     */
    address?: string;
    /**
     * 邮箱 | [EN] Email
     */
    email?: string;
    /**
     * 手机号 | [EN] Phone number
     */
    phone?: string;
}
/**
 * Product 信息。
 * [EN] Product information
 * 作为查询、列表、创建响应的统一出参，避免三个接口三套字段。
 * [EN] One shape for get/list/create responses instead of three divergent ones
 */
interface CommonProductInfo {
    /**
     * 编码 | [EN] Code
     */
    code?: string;
    /**
     * 联系方式 | [EN] Contact
     */
    contact?: CommonProductContact;
    /**
     * 创建时间 | [EN] Created at
     */
    created_at?: string;
    /**
     * 扩展字段 | [EN] Extra fields
     */
    extra?: Record<string, string>;
    /**
     * 主键ID | [EN] Primary key ID
     */
    id?: string;
    /**
     * 等级 | [EN] Level
     */
    level?: EnumsProductLevel;
    /**
     * 名称 | [EN] Name
     */
    name?: string;
    /**
     * 平台ID | [EN] Platform ID
     */
    platform_id?: string;
    /**
     * 地区ID | [EN] Region ID
     */
    region_id?: string;
    /**
     * 状态 | [EN] Status
     */
    status?: EnumsCommonStatus;
    /**
     * 标签列表 | [EN] Tag list
     */
    tags?: Array<string>;
    /**
     * 租户ID | [EN] Tenant ID
     */
    tenant_id?: string;
    /**
     * 类型 | [EN] Type
     */
    type?: EnumsProductType;
    /**
     * 更新时间 | [EN] Updated at
     */
    updated_at?: string;
}
/**
 * 排序信息。
 * [EN] Sorting information
 */
interface CommonSorting {
    /**
     * 是否升序 | [EN] Whether ascending
     */
    ascending?: boolean;
    /**
     * 排序字段 | [EN] Sort field
     */
    field?: string;
}
/**
 * Tenant 信息（聚合根）
 * [EN] Tenant information (aggregate root)
 */
interface CommonTenantInfo {
    /**
     * 编码（全局唯一）| [EN] Code, globally unique
     */
    code?: string;
    /**
     * 创建时间 | [EN] Created at
     */
    created_at?: string;
    /**
     * 主键ID | [EN] Primary key ID
     */
    id?: string;
    /**
     * 成员数（聚合统计）| [EN] Member count
     */
    member_count?: number;
    /**
     * 名称 | [EN] Name
     */
    name?: string;
    /**
     * 平台ID | [EN] Platform ID
     */
    platform_id?: string;
    /**
     * 地区ID | [EN] Region ID
     */
    region_id?: string;
    /**
     * 地区分配 | [EN] Region assignments
     */
    regions?: Array<CommonTenantRegionAssignment>;
    /**
     * 状态 | [EN] Status
     */
    status?: EnumsTenantStatus;
    /**
     * 下游同步状态 | [EN] Downstream sync state
     */
    sync_state?: EnumsTenantSyncState;
    /**
     * 更新时间 | [EN] Updated at
     */
    updated_at?: string;
}
/**
 * 成员信息
 * [EN] Member information
 */
interface CommonTenantMemberInfo {
    /**
     * 显示名 | [EN] Display name
     */
    display_name?: string;
    /**
     * 邮箱 | [EN] Email
     */
    email?: string;
    /**
     * 成员ID | [EN] Member ID
     */
    id?: string;
    /**
     * 加入时间 | [EN] Joined at
     */
    joined_at?: string;
    /**
     * 角色列表 | [EN] Role list
     */
    roles?: Array<EnumsTenantMemberRole>;
    /**
     * 状态 | [EN] Status
     */
    status?: EnumsCommonStatus;
    /**
     * 所属TenantID | [EN] Owning Tenant ID
     */
    tenant_id?: string;
    /**
     * 用户ID | [EN] User ID
     */
    user_id?: string;
}
/**
 * 地区分配（子资源）
 * [EN] Region assignment (sub-resource)
 * 子资源有自己的 ID，是因为它要被单独更新和移除；只读的附属数据不需要 ID
 * [EN] A sub-resource carries its own ID because it is updated and removed individually;
 * read-only attached data does not need one
 */
interface CommonTenantRegionAssignment {
    /**
     * 分配时间 | [EN] Assigned at
     */
    assigned_at?: string;
    /**
     * 分配ID | [EN] Assignment ID
     */
    id?: string;
    /**
     * 是否主地区 | [EN] Whether primary
     */
    primary?: boolean;
    /**
     * 地区ID | [EN] Region ID
     */
    region_id?: string;
}
/**
 * Warehouse 信息。
 * [EN] Warehouse information
 */
interface CommonWarehouseInfo {
    /**
     * 分类 | [EN] Category
     */
    category?: EnumsWarehouseCategory;
    /**
     * 编码 | [EN] Code
     */
    code?: string;
    /**
     * 创建时间 | [EN] Created at
     */
    created_at?: string;
    /**
     * 图标地址 | [EN] Icon URL
     */
    icon_url?: string;
    /**
     * 主键ID | [EN] Primary key ID
     */
    id?: string;
    /**
     * 名称 | [EN] Name
     */
    name?: string;
    /**
     * 排序序号 | [EN] Sort order
     */
    sort_order?: number;
    /**
     * 状态 | [EN] Status
     */
    status?: EnumsCommonStatus;
    /**
     * 租户ID | [EN] Tenant ID
     */
    tenant_id?: string;
    /**
     * 更新时间 | [EN] Updated at
     */
    updated_at?: string;
}

/**
 * 批量删除Product请求。
 * [EN] Batch delete Product request
 * 批量操作走 POST + body，不用 DELETE：DELETE 带 body 在网关和代理上行为不一致。
 * [EN] Batch operations use POST with a body; DELETE with a body behaves inconsistently across proxies
 */
interface CatalogProductBatchDeleteRequest {
    /**
     * ProductID列表 | [EN] Product ID list
     */
    product_ids: Array<string>;
}
/**
 * 批量删除Product响应。
 * [EN] Batch delete Product response
 */
interface CatalogProductBatchDeleteResponse {
    /**
     * 逐条结果 | [EN] Per-item results
     */
    results?: Array<CommonBatchResult>;
}
/**
 * 创建Product请求。
 * [EN] Create Product request
 * 创建用裸类型 + validate:"required"，不要用 wrappers：创建场景没有「不传表示不改」的语义。
 * [EN] Create uses plain types with validate:"required"; wrappers are for partial updates only
 */
interface CatalogProductCreateRequest {
    /**
     * 编码 | [EN] Code
     */
    code: string;
    /**
     * 联系方式 | [EN] Contact
     */
    contact?: CommonProductContact;
    /**
     * 等级 | [EN] Level
     */
    level?: EnumsProductLevel;
    /**
     * 名称 | [EN] Name
     */
    name: string;
    /**
     * 备注 | [EN] Remark
     */
    remark?: string;
    /**
     * 标签列表 | [EN] Tag list
     */
    tags?: Array<string>;
    /**
     * 租户ID | [EN] Tenant ID
     */
    tenant_id: string;
    /**
     * 类型 | [EN] Type
     */
    type?: EnumsProductType;
}
/**
 * 创建Product响应。
 * [EN] Create Product response
 */
interface CatalogProductCreateResponse {
    /**
     * Product信息 | [EN] Product info
     */
    info?: CommonProductInfo;
}
/**
 * 删除Product响应。
 * [EN] Delete Product response
 */
interface CatalogProductDeleteResponse {
}
/**
 * 获取Product详情响应。
 * [EN] Get Product detail response
 */
interface CatalogProductGetResponse {
    /**
     * Product信息 | [EN] Product info
     */
    info?: CommonProductInfo;
}
/**
 * Product列表响应。
 * [EN] Product list response
 */
interface CatalogProductListResponse {
    /**
     * Product信息列表 | [EN] Product info list
     */
    infos?: Array<CommonProductInfo>;
    /**
     * 分页响应 | [EN] Page response
     */
    page_response?: CommonPaging;
}
/**
 * 更新Product响应。
 * [EN] Update Product response
 */
interface CatalogProductUpdateResponse {
    /**
     * Product信息 | [EN] Product info
     */
    info?: CommonProductInfo;
}
/**
 * 更新Product状态响应。
 * [EN] Update Product status response
 */
interface CatalogProductUpdateStatusResponse {
}

/**
 * 更新Product请求。
 * [EN] Update Product request
 */
interface ProductServiceProductUpdateBody {
    /**
     * 联系方式 | [EN] Contact
     */
    contact?: CommonProductContact;
    /**
     * 等级 | [EN] Level
     */
    level?: EnumsProductLevel;
    /**
     * 名称 | [EN] Name
     */
    name?: string;
    /**
     * 备注 | [EN] Remark
     */
    remark?: string;
    /**
     * 标签列表 | [EN] Tag list
     */
    tags?: Array<string>;
    /**
     * 是否更新标签(true=用 tags 覆盖, false/null=不动) | [EN] Whether to replace tags
     */
    update_tags?: boolean;
}
/**
 * 更新Product状态请求。
 * [EN] Update Product status request
 */
interface ProductServiceProductUpdateStatusBody {
    /**
     * 状态 | [EN] Status
     */
    status?: EnumsCommonStatus;
}
/**
 * 添加成员请求
 * [EN] Add member request
 */
interface TenantMemberServiceTenantMemberAddBody {
    /**
     * 邮箱 | [EN] Email
     */
    email?: string;
    /**
     * 初始角色 | [EN] Initial roles
     */
    roles?: Array<EnumsTenantMemberRole>;
    /**
     * 用户ID | [EN] User ID
     */
    user_id?: string;
}
/**
 * 批量邀请成员请求
 * [EN] Batch invite members request
 */
interface TenantMemberServiceTenantMemberBatchInviteBody {
    /**
     * 邮箱列表 | [EN] Email list
     */
    emails?: Array<string>;
    /**
     * 统一赋予的角色 | [EN] Roles granted to all invitees
     */
    roles?: Array<EnumsTenantMemberRole>;
}
/**
 * 覆盖成员角色请求
 * [EN] Replace member roles request
 * 用 PUT 而不是 PATCH：语义是「把角色集合整体替换成这一份」，
 * 增量加减角色应该是另外两个动作型接口，不要用同一个接口的可选字段去表达两种语义
 * [EN] PUT rather than PATCH: the semantics are "replace the whole role set with this one".
 * Incremental add/remove belong to separate action endpoints instead of optional fields
 * on one endpoint expressing two different behaviours
 */
interface TenantMemberServiceTenantMemberRoleReplaceBody {
    /**
     * 覆盖后的角色集合 | [EN] The resulting role set
     */
    roles?: Array<EnumsTenantMemberRole>;
}
/**
 * 分配地区请求
 * [EN] Assign region request
 */
interface TenantServiceTenantRegionAssignBody {
    /**
     * 是否设为主地区 | [EN] Whether to set as primary
     */
    primary?: boolean;
    /**
     * 地区ID | [EN] Region ID
     */
    region_id?: string;
}
/**
 * 更新地区分配请求
 * [EN] Update region assignment request
 */
interface TenantServiceTenantRegionAssignmentUpdateBody {
    /**
     * 是否主地区 | [EN] Whether primary
     */
    primary?: boolean;
}
/**
 * 重试同步请求
 * [EN] Retry sync request
 * 动作型接口也要有自己的 Request/Response，不要复用 GetRequest：
 * 以后加「只同步某个下游」这种参数时才有地方放
 * [EN] An action endpoint needs its own request/response rather than reusing GetRequest,
 * so that parameters like "sync only this downstream" have somewhere to live later
 */
interface TenantServiceTenantRetrySyncBody {
    /**
     * 是否强制重新同步已成功的项 | [EN] Whether to re-sync already succeeded items
     */
    force?: boolean;
}
/**
 * 更新Tenant请求
 * [EN] Update Tenant request
 */
interface TenantServiceTenantUpdateBody {
    /**
     * 名称 | [EN] Name
     */
    name?: string;
    /**
     * 状态 | [EN] Status
     */
    status?: EnumsTenantStatus;
}
/**
 * 更新Warehouse请求。
 * [EN] Update Warehouse request
 */
interface WarehouseServiceWarehouseUpdateBody {
    /**
     * 分类 | [EN] Category
     */
    category?: EnumsWarehouseCategory;
    /**
     * 图标地址 | [EN] Icon URL
     */
    icon_url?: string;
    /**
     * 名称 | [EN] Name
     */
    name?: string;
    /**
     * 排序序号 | [EN] Sort order
     */
    sort_order?: number;
}
/**
 * 启停Warehouse请求。
 * [EN] Toggle Warehouse request
 */
interface WarehouseServiceWarehouseUpdateStatusBody {
    /**
     * 状态 | [EN] Status
     */
    status?: EnumsCommonStatus;
}

declare class ProductManagementApi extends BaseAPI {
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
    productServiceProductList(pageRequestPage?: number, pageRequestSize?: number, pageRequestTotal?: number, sortField?: string, sortAscending?: boolean, keyword?: string, tenantId?: string, type?: EnumsProductType, status?: EnumsCommonStatus, options?: RequestArgs): Promise<CatalogProductListResponse>;
    /**
     * @summary 创建Product | Create Product
     * @param body
     * @param options Override http request option.
     */
    productServiceProductCreate(body: CatalogProductCreateRequest, options?: RequestArgs): Promise<CatalogProductCreateResponse>;
    /**
     * @summary 删除Product | Delete Product
     * @param productId ProductID | [EN] Product ID
     * @param options Override http request option.
     */
    productServiceProductDelete(productId: string, options?: RequestArgs): Promise<CatalogProductDeleteResponse>;
    /**
     * @summary 获取Product详情 | Get Product detail
     * @param productId ProductID | [EN] Product ID
     * @param options Override http request option.
     */
    productServiceProductGet(productId: string, options?: RequestArgs): Promise<CatalogProductGetResponse>;
    /**
     * @summary 更新Product | Update Product
     * @param productId ProductID | [EN] Product ID
     * @param body
     * @param options Override http request option.
     */
    productServiceProductUpdate(productId: string, body: ProductServiceProductUpdateBody, options?: RequestArgs): Promise<CatalogProductUpdateResponse>;
    /**
     * @summary 更新Product状态 | Update Product status
     * @param productId ProductID | [EN] Product ID
     * @param body
     * @param options Override http request option.
     */
    productServiceProductUpdateStatus(productId: string, body: ProductServiceProductUpdateStatusBody, options?: RequestArgs): Promise<CatalogProductUpdateStatusResponse>;
    /**
     * @summary 批量删除Product | Batch delete Product
     * @param body
     * @param options Override http request option.
     */
    productServiceProductBatchDelete(body: CatalogProductBatchDeleteRequest, options?: RequestArgs): Promise<CatalogProductBatchDeleteResponse>;
}

declare class TempKeyManagementApi extends BaseAPI {
    /**
     * 用签发时留存的私钥解密密文，校验场景一致与租户归属 | Decrypts with the stored private key, enforcing the scenario match and tenant ownership
     * @summary 解密 | Decrypt
     * @param body
     * @param options Override http request option.
     */
    tempKeyServiceTempKeyDecrypt(body: KeyTempKeyDecryptRequest, options?: RequestArgs): Promise<KeyTempKeyDecryptResponse>;
    /**
     * 提前失效某个密钥，不等 TTL 到期 | Invalidates a key ahead of its TTL
     * @summary 销毁临时密钥 | Destroy a temporary key
     * @param body
     * @param options Override http request option.
     */
    tempKeyServiceTempKeyDestroy(body: KeyTempKeyDestroyRequest, options?: RequestArgs): Promise<KeyTempKeyDestroyResponse>;
    /**
     * 用服务端持有的密钥加密一段明文，供调用方验证加解密闭环 | Encrypts a short plaintext with the server-held key so the caller can verify the round trip
     * @summary 加密自检（调试用，生产应关闭）| Encrypt probe, for debugging; disable in production
     * @param body
     * @param options Override http request option.
     */
    tempKeyServiceTempKeyEncryptProbe(body: KeyTempKeyEncryptProbeRequest, options?: RequestArgs): Promise<KeyTempKeyEncryptProbeResponse>;
    /**
     * 按租户 + 场景生成一对 RSA 密钥，返回公钥与密钥ID，私钥留在服务端并随 TTL 过期 | Generates an RSA pair for the tenant and scenario, returns the public key and key id, and keeps the private key server-side under a TTL
     * @summary 签发临时密钥 | Issue a temporary key
     * @param body
     * @param options Override http request option.
     */
    tempKeyServiceTempKeyIssue(body: KeyTempKeyIssueRequest, options?: RequestArgs): Promise<KeyTempKeyIssueResponse>;
}

/**
 * 创建Tenant请求
 * [EN] Create Tenant request
 */
interface TenantTenantCreateRequest {
    /**
     * 编码（全局唯一，创建后不可改）| [EN] Code, globally unique and immutable
     */
    code: string;
    /**
     * 名称 | [EN] Name
     */
    name: string;
    /**
     * 所有者用户ID | [EN] Owner user ID
     */
    owner_user_id: string;
    /**
     * 平台ID | [EN] Platform ID
     */
    platform_id: string;
    /**
     * 初始地区列表 | [EN] Initial region list
     */
    region_ids?: Array<string>;
}
/**
 * 创建Tenant响应
 * [EN] Create Tenant response
 */
interface TenantTenantCreateResponse {
    /**
     * Tenant信息 | [EN] Tenant info
     */
    info?: CommonTenantInfo;
}
/**
 * 获取Tenant详情响应
 * [EN] Get Tenant detail response
 */
interface TenantTenantGetResponse {
    /**
     * Tenant信息 | [EN] Tenant info
     */
    info?: CommonTenantInfo;
}
/**
 * Tenant列表响应
 * [EN] Tenant list response
 */
interface TenantTenantListResponse {
    /**
     * 列表 | [EN] List
     */
    infos?: Array<CommonTenantInfo>;
    /**
     * 分页响应 | [EN] Page response
     */
    page_response?: CommonPaging;
}
/**
 * 添加成员响应
 * [EN] Add member response
 */
interface TenantTenantMemberAddResponse {
    /**
     * 成员信息 | [EN] Member info
     */
    info?: CommonTenantMemberInfo;
}
/**
 * 批量邀请成员响应
 * [EN] Batch invite members response
 */
interface TenantTenantMemberBatchInviteResponse {
    /**
     * 逐条结果 | [EN] Per-item results
     */
    results?: Array<CommonBatchResult>;
}
/**
 * 成员列表响应
 * [EN] Member list response
 */
interface TenantTenantMemberListResponse {
    /**
     * 成员列表 | [EN] Member list
     */
    infos?: Array<CommonTenantMemberInfo>;
    /**
     * 分页响应 | [EN] Page response
     */
    page_response?: CommonPaging;
}
/**
 * 覆盖成员角色响应
 * [EN] Replace member roles response
 */
interface TenantTenantMemberRoleReplaceResponse {
    /**
     * 成员信息 | [EN] Member info
     */
    info?: CommonTenantMemberInfo;
}
/**
 * 更新地区分配响应
 * [EN] Update region assignment response
 */
interface TenantTenantRegionAssignmentUpdateResponse {
    /**
     * 地区分配 | [EN] Region assignment
     */
    assignment?: CommonTenantRegionAssignment;
}
/**
 * 分配地区响应
 * [EN] Assign region response
 */
interface TenantTenantRegionAssignResponse {
    /**
     * 地区分配 | [EN] Region assignment
     */
    assignment?: CommonTenantRegionAssignment;
}
/**
 * 重试同步响应
 * [EN] Retry sync response
 */
interface TenantTenantRetrySyncResponse {
    /**
     * 结果说明 | [EN] Result description
     */
    message?: string;
    /**
     * 本次动作后的同步状态 | [EN] Sync state after this action
     */
    sync_state?: EnumsTenantSyncState;
}
/**
 * 更新Tenant响应
 * [EN] Update Tenant response
 */
interface TenantTenantUpdateResponse {
    /**
     * Tenant信息 | [EN] Tenant info
     */
    info?: CommonTenantInfo;
}

declare class TenantManagementApi extends BaseAPI {
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
    tenantServiceTenantList(pageRequestPage?: number, pageRequestSize?: number, pageRequestTotal?: number, sortField?: string, sortAscending?: boolean, keyword?: string, status?: EnumsTenantStatus, regionId?: string, options?: RequestArgs): Promise<TenantTenantListResponse>;
    /**
     * @summary 创建Tenant | Create Tenant
     * @param body
     * @param options Override http request option.
     */
    tenantServiceTenantCreate(body: TenantTenantCreateRequest, options?: RequestArgs): Promise<TenantTenantCreateResponse>;
    /**
     * @summary 删除Tenant | Delete Tenant
     * @param tenantId TenantID | [EN] Tenant ID
     * @param options Override http request option.
     */
    tenantServiceTenantDelete(tenantId: string, options?: RequestArgs): Promise<CommonGeneralEmptyResponse>;
    /**
     * @summary 获取Tenant详情 | Get Tenant detail
     * @param tenantId TenantID | [EN] Tenant ID
     * @param options Override http request option.
     */
    tenantServiceTenantGet(tenantId: string, options?: RequestArgs): Promise<TenantTenantGetResponse>;
    /**
     * @summary 更新Tenant | Update Tenant
     * @param tenantId TenantID | [EN] Tenant ID
     * @param body
     * @param options Override http request option.
     */
    tenantServiceTenantUpdate(tenantId: string, body: TenantServiceTenantUpdateBody, options?: RequestArgs): Promise<TenantTenantUpdateResponse>;
    /**
     * @summary 分配地区 | Assign region
     * @param tenantId TenantID | [EN] Tenant ID
     * @param body
     * @param options Override http request option.
     */
    tenantServiceTenantRegionAssign(tenantId: string, body: TenantServiceTenantRegionAssignBody, options?: RequestArgs): Promise<TenantTenantRegionAssignResponse>;
    /**
     * @summary 移除地区分配 | Remove region assignment
     * @param tenantId TenantID | [EN] Tenant ID
     * @param assignmentId 分配ID | [EN] Assignment ID
     * @param options Override http request option.
     */
    tenantServiceTenantRegionAssignmentRemove(tenantId: string, assignmentId: string, options?: RequestArgs): Promise<CommonGeneralEmptyResponse>;
    /**
     * @summary 更新地区分配 | Update region assignment
     * @param tenantId TenantID | [EN] Tenant ID
     * @param assignmentId 分配ID | [EN] Assignment ID
     * @param body
     * @param options Override http request option.
     */
    tenantServiceTenantRegionAssignmentUpdate(tenantId: string, assignmentId: string, body: TenantServiceTenantRegionAssignmentUpdateBody, options?: RequestArgs): Promise<TenantTenantRegionAssignmentUpdateResponse>;
    /**
     * @summary 重试下游同步 | Retry downstream sync
     * @param tenantId TenantID | [EN] Tenant ID
     * @param body
     * @param options Override http request option.
     */
    tenantServiceTenantRetrySync(tenantId: string, body: TenantServiceTenantRetrySyncBody, options?: RequestArgs): Promise<TenantTenantRetrySyncResponse>;
}

declare class TenantMemberManagementApi extends BaseAPI {
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
    tenantMemberServiceTenantMemberList(tenantId: string, pageRequestPage?: number, pageRequestSize?: number, pageRequestTotal?: number, role?: EnumsTenantMemberRole, status?: EnumsCommonStatus, options?: RequestArgs): Promise<TenantTenantMemberListResponse>;
    /**
     * @summary 添加成员 | Add member
     * @param tenantId 所属TenantID | [EN] Owning Tenant ID
     * @param body
     * @param options Override http request option.
     */
    tenantMemberServiceTenantMemberAdd(tenantId: string, body: TenantMemberServiceTenantMemberAddBody, options?: RequestArgs): Promise<TenantTenantMemberAddResponse>;
    /**
     * @summary 移除成员 | Remove member
     * @param tenantId 所属TenantID | [EN] Owning Tenant ID
     * @param memberId 成员ID | [EN] Member ID
     * @param options Override http request option.
     */
    tenantMemberServiceTenantMemberRemove(tenantId: string, memberId: string, options?: RequestArgs): Promise<CommonGeneralEmptyResponse>;
    /**
     * @summary 覆盖成员角色 | Replace member roles
     * @param tenantId 所属TenantID | [EN] Owning Tenant ID
     * @param memberId 成员ID | [EN] Member ID
     * @param body
     * @param options Override http request option.
     */
    tenantMemberServiceTenantMemberRoleReplace(tenantId: string, memberId: string, body: TenantMemberServiceTenantMemberRoleReplaceBody, options?: RequestArgs): Promise<TenantTenantMemberRoleReplaceResponse>;
    /**
     * @summary 批量邀请成员 | Batch invite members
     * @param tenantId 所属TenantID | [EN] Owning Tenant ID
     * @param body
     * @param options Override http request option.
     */
    tenantMemberServiceTenantMemberBatchInvite(tenantId: string, body: TenantMemberServiceTenantMemberBatchInviteBody, options?: RequestArgs): Promise<TenantTenantMemberBatchInviteResponse>;
}

/**
 * 创建Warehouse请求。
 * [EN] Create Warehouse request
 */
interface InventoryWarehouseCreateRequest {
    /**
     * 分类 | [EN] Category
     */
    category?: EnumsWarehouseCategory;
    /**
     * 编码 | [EN] Code
     */
    code: string;
    /**
     * 图标地址 | [EN] Icon URL
     */
    icon_url?: string;
    /**
     * 名称 | [EN] Name
     */
    name: string;
    /**
     * 排序序号 | [EN] Sort order
     */
    sort_order?: number;
    /**
     * 租户ID | [EN] Tenant ID
     */
    tenant_id: string;
}
/**
 * 创建Warehouse响应。
 * [EN] Create Warehouse response
 */
interface InventoryWarehouseCreateResponse {
    /**
     * Warehouse信息 | [EN] Warehouse info
     */
    info?: CommonWarehouseInfo;
}
/**
 * 获取Warehouse详情响应。
 * [EN] Get Warehouse detail response
 */
interface InventoryWarehouseGetResponse {
    /**
     * Warehouse信息 | [EN] Warehouse info
     */
    info?: CommonWarehouseInfo;
}
/**
 * Warehouse列表响应。
 * [EN] Warehouse list response
 */
interface InventoryWarehouseListResponse {
    /**
     * Warehouse信息列表 | [EN] Warehouse info list
     */
    infos?: Array<CommonWarehouseInfo>;
    /**
     * 分页响应 | [EN] Page response
     */
    page_response?: CommonPaging;
}
/**
 * 更新Warehouse响应。
 * [EN] Update Warehouse response
 */
interface InventoryWarehouseUpdateResponse {
    /**
     * Warehouse信息 | [EN] Warehouse info
     */
    info?: CommonWarehouseInfo;
}

declare class WarehouseManagementApi extends BaseAPI {
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
    warehouseServiceWarehouseList(pageRequestPage?: number, pageRequestSize?: number, pageRequestTotal?: number, sortField?: string, sortAscending?: boolean, keyword?: string, category?: EnumsWarehouseCategory, status?: EnumsCommonStatus, options?: RequestArgs): Promise<InventoryWarehouseListResponse>;
    /**
     * @summary 创建Warehouse | Create Warehouse
     * @param body
     * @param options Override http request option.
     */
    warehouseServiceWarehouseCreate(body: InventoryWarehouseCreateRequest, options?: RequestArgs): Promise<InventoryWarehouseCreateResponse>;
    /**
     * @summary 删除Warehouse | Delete Warehouse
     * @param warehouseId WarehouseID | [EN] Warehouse ID
     * @param options Override http request option.
     */
    warehouseServiceWarehouseDelete(warehouseId: string, options?: RequestArgs): Promise<CommonGeneralEmptyResponse>;
    /**
     * @summary 获取Warehouse详情 | Get Warehouse detail
     * @param warehouseId WarehouseID | [EN] Warehouse ID
     * @param options Override http request option.
     */
    warehouseServiceWarehouseGet(warehouseId: string, options?: RequestArgs): Promise<InventoryWarehouseGetResponse>;
    /**
     * @summary 更新Warehouse | Update Warehouse
     * @param warehouseId WarehouseID | [EN] Warehouse ID
     * @param body
     * @param options Override http request option.
     */
    warehouseServiceWarehouseUpdate(warehouseId: string, body: WarehouseServiceWarehouseUpdateBody, options?: RequestArgs): Promise<InventoryWarehouseUpdateResponse>;
    /**
     * @summary 启停Warehouse | Toggle Warehouse
     * @param warehouseId WarehouseID | [EN] Warehouse ID
     * @param body
     * @param options Override http request option.
     */
    warehouseServiceWarehouseUpdateStatus(warehouseId: string, body: WarehouseServiceWarehouseUpdateStatusBody, options?: RequestArgs): Promise<CommonGeneralEmptyResponse>;
}

interface ProtobufAny {
    '@type'?: string;
}

interface RpcStatus {
    code?: number;
    details?: Array<ProtobufAny>;
    message?: string;
}

/**
 * 单次请求配置 | Per-request configuration
 *
 * 字段与生成代码里的 RequestArgs 保持结构兼容，因此本客户端可以直接注入
 * 任何生成出来的 API 类
 *
 * Structurally compatible with the generated RequestArgs, so this client can be
 * injected into any generated API class.
 */
interface HttpRequestConfig {
    /** HTTP 方法，默认 GET | HTTP method, defaults to GET */
    method?: string;
    /** 请求路径，会与 Configuration.basePath 拼接 | Path, appended to Configuration.basePath */
    url?: string;
    /** query 参数，数组会展开成重复 key | Query params; arrays expand into repeated keys */
    params?: Record<string, unknown>;
    /** 单次请求头，覆盖客户端级别的同名头 | Per-request headers, override client-level ones */
    headers?: Record<string, string>;
    /** 请求体，非字符串且非二进制时按 JSON 序列化 | Body; serialized as JSON unless string/binary */
    data?: unknown;
    /** 调用方传入的取消信号 | Caller-supplied cancellation signal */
    signal?: AbortSignal;
    /** 覆盖客户端级别的超时时间 | Overrides the client-level timeout */
    timeoutMs?: number;
}
/**
 * 响应结构 | Response shape
 *
 * 生成代码只读取 data 字段，status 与 headers 是额外给调用方的信息，
 * 多出来的字段不影响结构兼容性
 *
 * The generated code only reads `data`; `status` and `headers` are extras for
 * callers. Extra properties do not break structural compatibility.
 */
interface HttpResponse<T> {
    /** 解析后的响应体 | Parsed response body */
    data: T;
    /** HTTP 状态码 | HTTP status code */
    status: number;
    /** 响应头，key 统一转小写 | Response headers, keys lower-cased */
    headers: Record<string, string>;
}
/**
 * 注入用的最小 fetch 结构 | Minimal fetch shape for injection
 *
 * 这里刻意不用 DOM 的 RequestInit / Response 类型：浏览器、Node、undici、
 * 测试替身对这些类型的定义互不相同，把它们写进公共 API 会让使用方被迫对齐
 * lib 配置只声明真正用到的成员，任何实现都能塞进来
 *
 * We deliberately avoid DOM's RequestInit / Response: browsers, Node, undici and
 * test doubles all type them differently, and leaking that into the public API
 * would force consumers to match our `lib` setup. Only the members we actually
 * use are declared, so any implementation fits.
 */
type FetchLike = (url: string, init: FetchInit) => Promise<FetchResponse>;
/** fetch 的入参 | The init argument passed to fetch */
interface FetchInit {
    method?: string;
    headers?: Record<string, string>;
    body?: unknown;
    signal?: AbortSignal;
}
/** fetch 的返回值 | The response returned by fetch */
interface FetchResponse {
    ok: boolean;
    status: number;
    statusText: string;
    headers: {
        get(name: string): string | null;
        forEach(callback: (value: string, name: string) => void): void;
    };
    text(): Promise<string>;
}
/** 客户端级别配置 | Client-level options */
interface HttpClientOptions {
    /** 所有请求共用的 header，可被单次请求覆盖 | Shared headers, overridable per request */
    headers?: Record<string, string>;
    /** 超时毫秒数，传 0 表示不设超时，默认 10000 | Timeout in ms, 0 disables it, default 10000 */
    timeoutMs?: number;
    /** 重试次数，只对网络错误和可重试状态码生效 | Retry count, only for network errors and retryable codes */
    retries?: number;
    /** 重试基础间隔，第 n 次重试等待 retryDelayMs * 2 ** n 毫秒 | Base backoff; attempt n waits retryDelayMs * 2 ** n */
    retryDelayMs?: number;
    /** 自定义 fetch 实现，默认取全局 fetch | Custom fetch implementation, defaults to global fetch */
    fetch?: FetchLike;
    /** 请求发出前的钩子，可注入签名、链路 ID | Hook before the request, e.g. signing or trace IDs */
    onRequest?: (config: HttpRequestConfig) => void | Promise<void>;
    /** 收到响应后的钩子，非 2xx 抛错前同样会触发 | Hook after the response, also runs before non-2xx throws */
    onResponse?: (response: HttpResponse<unknown>) => void | Promise<void>;
}
/** 可注入生成 API 类的客户端接口 | Client interface injectable into generated API classes */
interface HttpClient {
    request<T = unknown>(config: HttpRequestConfig): Promise<HttpResponse<T>>;
}
/**
 * 非 2xx 响应抛出的错误 | Error thrown for non-2xx responses
 *
 * body 是已经解析过的响应体，便于调用方直接读业务错误码，不用再处理一遍反序列化
 * `body` carries the already-parsed payload so callers can read business error
 * codes without deserializing again.
 */
declare class HttpError extends Error {
    /** HTTP 状态码 | HTTP status code */
    readonly status: number;
    /** 实际请求的完整 URL（含 query）| The full requested URL, query included */
    readonly url: string;
    /** 解析后的响应体 | Parsed response body */
    readonly body: unknown;
    constructor(message: string, init: {
        status: number;
        url: string;
        body?: unknown;
    });
}
/**
 * 创建 HTTP 客户端 | Create an HTTP client
 *
 * @example
 * ```ts
 * import { Configuration, PetApi, createHttpClient } from '@kamalyes/my-api-sdk';
 *
 * const http = createHttpClient({
 *   headers: { Authorization: 'Bearer token' },
 *   timeoutMs: 5000,
 *   retries: 2,
 * });
 * const api = new PetApi(new Configuration({ basePath: 'https://api.example.com' }), http);
 * ```
 */
declare function createHttpClient(options?: HttpClientOptions): HttpClient;

/**
 * 默认 API 根地址 | Default API base path
 *
 * 由模板变量 ApiBasePath 写入，留空表示由调用方在 Configuration 中显式给出
 * Written from the ApiBasePath template variable; empty means the caller must
 * pass basePath through Configuration.
 */
declare const DEFAULT_BASE_PATH = "";

export { type CatalogProductBatchDeleteRequest, type CatalogProductBatchDeleteResponse, type CatalogProductCreateRequest, type CatalogProductCreateResponse, type CatalogProductDeleteResponse, type CatalogProductGetResponse, type CatalogProductListResponse, type CatalogProductUpdateResponse, type CatalogProductUpdateStatusResponse, type CommonBatchResult, type CommonGeneralEmptyResponse, type CommonPaging, type CommonProductContact, type CommonProductInfo, type CommonSorting, type CommonTenantInfo, type CommonTenantMemberInfo, type CommonTenantRegionAssignment, type CommonWarehouseInfo, Configuration, type ConfigurationParameters, DEFAULT_BASE_PATH, EnumsCommonStatus, EnumsKeyScenario, EnumsProductLevel, EnumsProductType, EnumsRsaKeySize, EnumsTenantMemberRole, EnumsTenantStatus, EnumsTenantSyncState, EnumsWarehouseCategory, type FetchInit, type FetchLike, type FetchResponse, type HttpClient, type HttpClientOptions, HttpError, type HttpRequestConfig, type HttpResponse, IdBlockManagementApi, type InventoryWarehouseCreateRequest, type InventoryWarehouseCreateResponse, type InventoryWarehouseGetResponse, type InventoryWarehouseListResponse, type InventoryWarehouseUpdateResponse, type KeyIdBlockAllocateRequest, type KeyIdBlockAllocateResponse, type KeyTempKeyDecryptRequest, type KeyTempKeyDecryptResponse, type KeyTempKeyDestroyRequest, type KeyTempKeyDestroyResponse, type KeyTempKeyEncryptProbeRequest, type KeyTempKeyEncryptProbeResponse, type KeyTempKeyIssueRequest, type KeyTempKeyIssueResponse, ProductManagementApi, type ProductServiceProductUpdateBody, type ProductServiceProductUpdateStatusBody, type ProtobufAny, type RpcStatus, TempKeyManagementApi, TenantManagementApi, TenantMemberManagementApi, type TenantMemberServiceTenantMemberAddBody, type TenantMemberServiceTenantMemberBatchInviteBody, type TenantMemberServiceTenantMemberRoleReplaceBody, type TenantServiceTenantRegionAssignBody, type TenantServiceTenantRegionAssignmentUpdateBody, type TenantServiceTenantRetrySyncBody, type TenantServiceTenantUpdateBody, type TenantTenantCreateRequest, type TenantTenantCreateResponse, type TenantTenantGetResponse, type TenantTenantListResponse, type TenantTenantMemberAddResponse, type TenantTenantMemberBatchInviteResponse, type TenantTenantMemberListResponse, type TenantTenantMemberRoleReplaceResponse, type TenantTenantRegionAssignResponse, type TenantTenantRegionAssignmentUpdateResponse, type TenantTenantRetrySyncResponse, type TenantTenantUpdateResponse, WarehouseManagementApi, type WarehouseServiceWarehouseUpdateBody, type WarehouseServiceWarehouseUpdateStatusBody, createHttpClient };
