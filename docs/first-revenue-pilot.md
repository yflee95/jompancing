# JomPancing 首笔收入试点

状态：首家商家试点进行中。实收收入 RM0，已发出 5 条商家/赛事资料核对或免费刊登邀请，经营者承诺 0；其中 Kolam Pancing Syawal / Sungai Rekoh、D’Tiram、Joran Fest、Ko-Nelayan 与渔具店 MM Fishing Tackle 各收到一条邀请。D’Tiram 号码尚未由商家自有渠道核实；Ko-Nelayan 与 Joran Fest WhatsApp 邀请均已送达，MM Fishing Tackle 邀请已送达；Joran Fest 联系人表示会告知管理层，但管理层尚未回复，活动资料仍待确认。未承诺流量或收费服务。

## 运营检查点（2026-10-21）

- 正式 Vercel 项目已配置 `SUPABASE_SERVICE_ROLE_KEY`（仅核对变量名称和 Production 环境，未读取密钥值）。
- 商家资料发布闭环（2026-10-21）：已为 `spots` 增加营业时间、收费、钓鱼规则和经营者核实时间字段，Supabase 正式项目迁移成功，且通过 `information_schema` 只读查询确认四列均存在。后台申请卡片可编辑这些公开资料；管理员必须勾选“已向经营者核实且获准公开”，服务端也会校验该确认，只能从管理员 API 写入。地点页只有在核实时间存在时才显示这些资料与核实日期；不公开申请人联系方式，不把认领状态当成已核实。尚无业者申请或确认资料，因此目前没有新增任何公开经营资料。
- 发布核验（2026-10-21）：代码提交 `a6c0518` 已推送；Vercel 显示 Production Ready。正式 Sungai Rekoh 页面仍显示“尚未核实”的提示，未显示经营者确认卡片；Supabase 只读统计 `owner_verified_at is not null` 为 0，确认没有未确认资料被标成核实。管理员发布流程尚未用真实商家资料做端到端验证，因为目前没有业者申请/授权资料。
- 业者转化页改进（2026-10-21）：三语页面明确说明只核实营业时间、收费和钓鱼规则，不承诺客流；说明私下核实、获准后才公开并标注日期。申请表现在允许填写 JomPancing 鱼塘页链接，服务端只会把自有域名下匹配到的公开鱼塘关联到申请；若未填写可匹配链接，申请照常保存但需运营人员人工匹配，不能直接在该申请卡片上更新地点资料。TypeScript、ESLint 和生产构建通过。GitHub `7f29531` 的 Vercel Production 部署显示 Ready；生产 `/en/pond-owners` 已核对以上内容和申请表字段。
- Supabase 状态页在 2026-10-21 显示恢复正常。已在正式 JomPancing 项目用只读 SQL 确认 `pond_claim_requests` 存在、RLS 已开启、anon/authenticated 无 SELECT 权限、service_role 有 SELECT/INSERT 权限；没有读取申请人资料，也没有写入数据库。Vercel Production 配置中确认存在 `SUPABASE_SERVICE_ROLE_KEY`、`ADMIN_EMAILS` 和 Supabase 公共连接变量（未查看值）。申请流程具备数据库与配置条件，但尚未做真实提交的端到端验证。
- 已根据用户明确指示使用其当前打开的 WhatsApp 账号联系候选商家。WhatsApp 显示收件方为 +60 17-755 8132 Business Account；已发出一封马来文邀约，说明发件人是协助创办人的 AI 助手，邀请免费核对地址、营业时间、收费及规则，未经同意不公开联系方式、不保证客流，并说明如不合适便不再联系。该号码来自 Waze 商家条目；不能据此宣称 WhatsApp 账号身份已独立核实。等待商家回复，暂不跟进。
- 2026-10-21 14:55 MYT，根据用户对 D’Tiram 首次邀约的授权，使用其已登录的 WhatsApp 向公开目录列出的 +60 10-777 2407 发送单条马来文邀请，WhatsApp 显示 Delivered。内容仅邀请免费核对营业时间、收费和规则；没有发送申请链接、要求付款或承诺客流。号码由 Trip.com 与第三方目录列出，尚无商家自有渠道确认，因此不能记录为已核实经营者；如对方回复，再核验身份和对公开资料的授权。
- Vercel 项目属于 Hobby。已先发布三语隐私说明，再按用户许可启用 Web Analytics Hobby 档：免费额度 50,000 events/月、30 天历史、无自定义事件；没有升级 Pro。面板已从 demo 状态转为真实 Analytics 页面，目前暂无可用生产数据；Vercel 会排除自动化流量。可看页面浏览、来源和设备等，不能把页面浏览当作商家联系点击。
- Search Console 更新基线（2026-10-21 检查，数据截至 2026-10-18）：近 28 天（2026-09-21 至 2026-10-18）有 171 次点击、约 11,300 次曝光、CTR 1.5%、平均排名 6.9；`kolam pancing near me` 有 614 次曝光、3 次点击、CTR 0.5%、平均排名 7.2。按该查询筛选页面后，Johor Bahru 英文地区页有 136 次曝光、1 次点击（约 0.7% CTR），其余曝光分布在多种地点页。该窗口早于 2026-10-21 上线的搜索标题及摘要，不能用来评估新文案效果；待 2026-10-21 后积累至少 28 天数据，再比较同一查询和页面。产品目前能让用户手动按距离筛选。
- 另一个较强意图词是 `kolam pancing udang near me`：近 28 天 75 次曝光、4 次点击、CTR 5.3%、平均排名 6.5。最多曝光的地点页是 Ulu Tiram 的 Kolam pancing udang galah D'tiram（47 次曝光、1 次点击），其次为 Abg Bard（8 次曝光、1 次点击）。D'tiram 生产页目前明确显示来自 Google Maps 且尚未核实，鱼种、营业、收费和规则均未提供；这适合作为后续业者核实候选，不能把第三方目录中的营业/设施说法直接写入。先收集商家确认，再考虑是否需要单独的虾塘 SEO 入口。
- GPS 现为用户点击后才请求，坐标用途说明与三语隐私文案已上线（提交 `a27ce8d`）。
- 验证：TypeScript、受影响文件 ESLint、Next.js 生产构建均通过；Vercel 部署成功。生产浏览器已检查地点页；本地预览受浏览器策略拦截。没有点击“附近”按钮，因此没有触发设备定位授权。
- 生产页检查（2026-10-21）：Johor Bahru 地区页服务器端输出 31 个地点。马来文标题已改为以“Kolam Pancing”开头，英/中文标题和三语摘要也同步调整，明确地点与资料范围，并提醒出发前确认开放、收费及时段（提交 `c4cd974`；三个语言的生产页均返回 200，摘要没有截断）。尚无证据证明 CTR 已改善；从当前 GSC 基线起观察同一查询/页面至少 28 天。公开 sitemap 搜索没有发现名称含 PDS 的钓点页，当前把它当作待开发商家线索，而非已上架商家。
- 生产浏览器 QA 发现多家 Google Maps 导入鱼塘共用未经核实的收费、场次、鱼种和家庭适用描述。运行时现统一展示未核实说明，隐藏导入记录中的推测鱼种/标签，新导入及旧 SEO enrichment 脚本也已修正（提交 `4d423af`）。之前本地 `.env.local` 缺少 service key，无法运行 enrichment dry-run；本次地区及隐私分析更新没有数据库写入需求。
- 当前已知实收收入仍为 RM0。不要把 GSC 点击、页面访问或邀约当成收入。
- 商家转化检查（2026-10-21）：鱼塘详情页的“建议更正”锚点原本只滚到默认折叠的申请表。现已在 `819c4c0` 修复为带 `#pond-claim` 打开链接时自动展开；生产部署已成功，直接打开 Sungai Rekoh 页面申请锚点确认表单已显示。没有提交测试申请或写入商家数据。

## 经营判断

先把 JomPancing 做成可靠的钓点搜索与出发规划入口。公开搜索数据已有本地意图，但还不足以证明商家愿意为曝光付费。

- Search Console 导出筛选器写着“最近 3 个月”。图表实际覆盖 2026-09-09 至 2026-10-11，共 33 个日期行，合计 110 次点击、6,944 次曝光，CTR 为 1.58%。
- 马来西亚带来 100 次点击和 6,613 次曝光。
- `kolam pancing near me` 有 391 次曝光、2 次点击、平均排名 7.51。
- Johor Bahru 区域页有 628 次曝光、8 次点击；Johor 州页有 685 次曝光、4 次点击。
- 活动推广目前提供 2 天免费，之后标价 RM29/天；没有在线付款、自动续期或自助成效归因。2026-10-21 实际打开 `/en/activities`，列表显示 “No activities in this area”；当前没有可证明推广效果的活动库存。因此先把推广视为未验证产品，不主动卖 RM29/天；优先争取一条主办方确认的近期活动并让钓友能发现，再根据真实访问与商家反馈测试价格。公开推广页现有业务邮箱人工询价入口，不代表可自助结账或已有付款意愿。

这些数字是 Search Console 的搜索曝光和点击，不代表网站总访问、钓友实际出钓或商家获得的询问。优先改善高意图地点页的点击率和资料可信度。

## 14 天试点

### 试点目标

在一个地点密集的区域，与最多 5 家鱼塘经营者确认公开资料。先免费提供资料核对与页面更正。目标是学到经营者是否愿意配合、钓友会采取什么行动，以及商家重视哪些结果。目标数字是内部实验目标，不是现有业绩。

### 给经营者的免费试点

1. 核对地址、地图 pin、营业时间、收费、鱼种、设施和入场规则。
2. 未经经营者同意，不发布其私人联系方式、私有照片或未确认的经营信息。
3. 更正完成后把页面链接发给经营者检查。
4. 不承诺客流、订单或鱼获。只有在数据可用时，才报告页面浏览、导航和主动联系动作。
5. 只有经营者看过试点结果并表示愿意付费后，才报价付费曝光或资料管理服务。

### 首个公开联系候选

优先联系 **Kolam Pancing Syawal / Kolam Pancing Sungai Rekoh**：它位于 Masai 的 Kg. Sungai Rekoh，贴近当前有 `kolam pancing near me` 搜索需求的 Johor Bahru 区域，且 JomPancing 已有同名地点页，可直接邀请经营者核对现有资料。Waze 的 Sungai Rekoh 地点将 Kolam Pancing Syawal 的 Facebook 页面作为商家链接；同一 Facebook URL 也出现在钓友目录中。该页面尚未能在公开浏览器中独立打开确认，因此发送前只使用明确标注的商家主页，不直接把列表里的电话号码当成官方号码。

候选页面：<https://www.jompancing.my/ms/spots/kolam-pancing-sungai-rekoh-7mmCYQ2g>。商家页面：<https://www.facebook.com/kolampancingsyawal/>。佐证来源：<https://www.waze.com/live-map/directions/my/johor/masai/kolam-pancing-syawal-kampung-teluk-jawa-masai?to=place.ChIJBwj4ddEU2jERG1l7mmCYQ2g>、<https://mohredahangler.wixsite.com/pancing/senarai-kolam-air-masin>。2026-10-21 已通过用户指定 WhatsApp 账号发送首封邀约；收件界面显示 +60 17-755 8132 Business Account。号码源自 Waze 条目，商家关系尚待对方回复确认。

### 后续候选筛查（2026-10-21）

以下为内部线索，不代表经营者已确认；D’Tiram、Joran Fest 与 Ko-Nelayan 已发出核实邀请，其他对象尚未联系：


- **D’tiram（Ulu Tiram，已邀约，待回复）**：同名 JomPancing 页面已经存在，且 Search Console 的 `kolam pancing udang near me` 查询中有 47 次曝光、1 次点击，是当前较强的既有搜索入口。第三方目录与 Trip.com 出现相同电话，但没有找到经营者自有页面来确认号码；营业时间、设施、鱼种和收费的目录描述不可直接采用。来源：[JomPancing 页面](https://www.jompancing.my/ms/spots/kolam-pancing-udang-galah-dtiram-38ASfoao)、[Trip.com](https://hk.trip.com/travel-guide/attraction/ulu-tiram/kolam-pancing-udang-galah-d-tiram-153188719/)、[第三方目录](https://kedaipancingnearme.my/johor/ulu-tiram/kolam-pancing-udang-galah-dtiram/)。
- **Kempas 候选**：已有 `Kolam Pancing Udang Galah Kempas` 页面；电话和 Facebook 链接目前只在目录中出现，尚未能由商家自有渠道独立核对。[JomPancing 页面](https://www.jompancing.my/ms/spots/kolam-pancing-udang-galah-kempas-NxgcD_5Y)、[目录](https://kedaipancingnearme.my/johor/johor-bahru/kolam-pancing-udang-galah-kempas/)。
- **Pusat Memancing Udang Galah TikTokBP**：已有 JomPancing 页面；公开目录列有电话，但没有找到商家自有社交页面来确认身份和联系方式。[JomPancing 页面](https://www.jompancing.my/ms/spots/pusat-memancing-udang-galah-tiktokbp-cNAjoodM)、[WorldOrgs](https://my.worldorgs.com/katalog/johor-bahru/pusat-hiburan/pusatmemancingudanggalahtiktok)、[BizMalay](https://www.bizmalay.com/en/pusat-memancing-udang-galah-tiktok-012-744-9433)。
- **Kolam Memancing Udang Biru**：Pasir Gudang 页面声称的 Facebook 地址为 `facebook.com/udangbr/`，但两家目录的联系电话不一致。先不联系、不把任一号码写入公开页面，直到经营者自有页面确认。[WorldOrgs](https://my.worldorgs.com/katalog/pasir-gudang/kedai-pemburuan-dan-memancing/kolam-memancing-udang-biru)、[另一目录](https://kedaipancingnearme.my/johor/kampung-pasir-gudang-baru/kolam-memancing-udang-biru/)。
- **Damai Fishing Village（Johor Bahru，未联系）**：已有 JomPancing 地点页，当前线上页面正确隐藏导入的鱼种与设施并标明垂钓许可尚未核实；搜索缓存仍可能显示旧的自动生成介绍，故不把旧摘要当作当前资料。Facebook 页面 `facebook.com/damai.fishingvillage` 的页面标题与商家名一致，但公开页要求登录，无法在当前浏览器核验其最新内容。FindGlocal 镜像显示该页面在 2026-10-01 至 10-05 有频繁鱼种活动、时段和票价更新，并多次附 +60 19-754 9931；该镜像不是经营者自有渠道，号码和详情均待经营者确认。可作为下一位候选，邀请时只发至核验后的官方页面，不使用镜像目录号码。[JomPancing listing](https://www.jompancing.my/en/spots/damai-fishing-village-6umU4Ong)、[Facebook 页面](https://www.facebook.com/damai.fishingvillage)、[FindGlocal mirror](https://www.findglocal.com/MY/Johor-Bahru/1841843772552302/Damai-Fishing-Village)。
- **Joran Fest（Johor，公开活动供给线索，已联系）**：主办方官网列出 Siri 5 为 2026-11-01、Siri 6 为 2026-12-06、Siri 7 为 2027-01-03、Siri 8 为 2027-02-07，地点栏写 Pantai Mesra, Sri Menanti, Muar；官方联系方式列 `admin@joranfest.com`、赛事 +60 11-2846 0499、报名 +60 12-708 5669。官网同页的报名方式/费用文字似乎对应较早场次，不可复制给未来场次；邀约时应先向主办方确认日期、开放报名方式、价格和参赛条件，再免费提供活动页。不要用旧报名余额或名额信息误导钓友。[Joran Fest 官方日程及联系方式](https://joranfest.com/)、[Visit Johor 活动页](https://visitjohor2026.my/events/joran-fest/)。

- **MM Fishing Tackle（Pasir Gudang，渔具商家线索，已联系）**：Kanicen Nix 官方认证经销商名单列出该店、Pasir Gudang 地区与 WhatsApp +60 13-751 1175。2026-10-21 15:33 通过用户指定 WhatsApp 账号发送单条免费刊登邀请：告知市场目前无商品、商家可自行免费刊登一件新/二手渔具、提交的 WhatsApp 会公开，并明确买卖双方自行安排、JomPancing 不处理付款/配送且不承诺成交；消息已送达。暂无回复或刊登。来源：[Kanicen Nix 官方经销商名单](https://kanicen.com/about-us/penjual-sah-produk-kanicen-nix-verified-sellers/)。

Joran Fest 邀约记录（2026-10-21）：通过用户指定的 WhatsApp 账号，向官网列出的赛事号码 +60 11-2846 0499 发送免费核实邀请；本地时间 15:26 对方回复“Ok，我会告知管理层”，并已回复致谢。这是转交意向，尚未确认比赛日期、地点或报名状态，也未提供报名链接。收到主办方确认前不发布活动页，不复制官网旧场次报名/费用文字。
Ko-Nelayan outreach (2026-10-21): The official event page lists the 31 October 2026 contest at Taman Mini Akuakultur, Kg. Laya-Laya, Tuaran, 9:00 am–1:00 pm, RM38 per rod, capacity 259, total prizes RM3,800. One free verification invitation was sent to event contact +60 13-281 5567 from the official announcement; WhatsApp shows Delivered. No reply yet. Confirm current registration status and official registration method before publishing. Source: https://konelayan.sabah.gov.my/4.%20pusat-media-tab/aktiviti%202026/10.%20oktober/1001%20-%20Pertandingan%20Santai%20Mini%20Game%20Memancing%20Ko-Nelayan%202026.html

执行顺序调整为等待 Syawal、D’Tiram、Joran Fest、Ko-Nelayan 与 MM Fishing Tackle 对邀请回复；Joran Fest 联系人表示会告知管理层，尚未确认实际转交或收到管理层回复。给对方合理回复时间，任一对象 7 天内不重复联系。后续新邀约先核实经营者官方渠道，逐一联络，不批量群发。

- **MBSA / Pertandingan Memancing Shah Alam（待核实，未联系）**：Visit Selangor 活动列表提到 2026 年 10 月 Taman Tasik Barat、Seksyen 14 的钓鱼比赛，但没有确切日期、报名状态或费用；州旅游活动日历同样只标注月份，且日期可能为暂定。MBSA 官方总机为 +60 3-5510 5133，但 WhatsApp 新聊天搜索显示没有该号码对应的 WhatsApp 账号。遵照当前只使用用户指定 WhatsApp 渠道的选择，暂不改用电话或邮件联系，也不发布活动。来源：[Visit Selangor 活动列表](https://visitselangor.my/events/pertandingan-memancing-shah-alam/)、[Selangor 2026 活动日历 PDF](https://selangor.travel/wp-content/uploads/2017/04/Calendar-of-Events-2026-2.pdf)。

- **渔具联盟收入候选（待确认，未注册）**：Kanicen Nix 官网页脚的 Affiliate Dashboard 链接目前跳转到需要注册账户并勾选条款的页面；没有找到公开佣金比例、资格或付款规则。暂不以此作为可用收入渠道，也没有创建账户或接受条款。来源：[Kanicen Nix 官方网站](https://kanicen.com/)。

备选是 Kolam Pancing PDS，位于 Selangor；官网信息较完整，可在本地试点后再联系：<https://kolampancingpds.com/>。官网天气模块请求失败，不要把其天气数据当作可用服务来宣传。

### 首次联系文案（马来文）

> Hai, saya pembantu AI yang membantu pengasas JomPancing. Kami sedang menyemak maklumat kolam sekitar Johor Bahru supaya pemancing boleh membuat perancangan yang lebih tepat. Kami ada halaman Kolam Pancing Sungai Rekoh di JomPancing dan ingin menjemput pihak tuan menyemak alamat, waktu operasi, kadar bayaran dan peraturan secara percuma.
>
> Kami hanya akan mengemas kini maklumat yang disahkan dan memaparkan saluran hubungan perniagaan dengan kebenaran pihak tuan. Tiada bayaran dan tiada janji jumlah pelanggan. Jika berminat, boleh saya hantarkan pautan untuk disemak? Jika tidak sesuai, tiada masalah dan kami tidak akan menghubungi lagi.

首封商家邀约已由用户指定的 WhatsApp 账号发出，消息明确披露 AI 助手身份与免费核对目的。对方拒绝后不再联系；尚未回复时可在 7 天后最多礼貌跟进一次，发送前先查看是否已收到回复。其他对象须先核实其官方业务渠道，再逐一发出邀请，不批量群发。

### 后续付费假设

不在首条消息中收费。若经营者完成核对并愿意继续，可单独访谈其最看重的价值：更多有效询问、容易更新资料，还是促销展示。RM49 / 30 天赞助展示仍只是内部假设。马来西亚本地目录公开价可作粗略参照：DirektoriBiz 标示地区置顶 RM35 / 1 个月，基础上架另收一次 RM65；Meron Dito 标示置顶 listing RM39 / 月。这些产品的受众、流量和展示位与 JomPancing 不同，不能直接拿来证明同价合理。[DirektoriBiz pricing](https://direktoribiz.my/en/submit)、[Meron Dito advertising](https://www.merondito.com/advertise)。JomPancing 尚缺商家联系点击归因，也未有可信的商家页面流量基线；在商家愿意付费前，先免费核实资料并收集真实页面数据，不承诺客流或订单。

**活动推广续费流程**：推广页、活动主人的有效推广提醒会显示 RM29 / 天及预填邮件询价链接；邮件只询问档期与付款指引，并明确经营者回复确认前不续期、不扣款。当前没有支付网关或自动续期，不能把询价或免费推广写成收入。若收到询价，先确认活动、日期、推广位置和总额；由经营者确认付款方式并收到可核验的款项后，运营人员才手动延长 Supabase `activities.promoted_until`。尚无真实询价、付款或续期记录。

## 每周记录

| 指标 | 记录定义 | 目前状态 |
|---|---|---|
| 商家/赛事邀约数 | 通过公开业务渠道发送的个性化核实或免费刊登邀约 | 5（2026-10-21，Syawal、D’Tiram、Joran Fest、Ko-Nelayan、MM Fishing Tackle；D’Tiram 号码尚未由商家自有渠道核实；三条赛事/商家消息显示已送达） |
| 回复数 | 商家主动回复，不含系统送达/已读 | 1（Joran Fest 联系人表示会转交管理层；未确认活动资料） |
| 资料确认数 | 商家逐项确认公开的地址、时段、收费或规则 | 0 |
| 纠错完成数 | 已核实并更新的钓点资料 | 0 |
| 商家联系动作 | 页面上的 WhatsApp / 电话外链点击 | 尚无可靠的自定义事件统计 |
| 付费意愿 | 商家明确说愿意为指定服务及价格付费 | 0 |
| 实收收入 | 已到账金额，按 MYR 记录 | RM0（截至本计划） |

## 当前执行顺序

1. 活动/渔具 WhatsApp 联系体验、GPS 点击后授权、Johor Bahru 三语搜索摘要、导入地点资料可信度修复均已发布；渔具市场空状态现同时给卖家刊登入口和钓友浏览钓点的回退入口（`34f3b3c`）。
2. 从 2026-10-21 上线后继续累积至少 28 天，再在 Search Console 用相同查询和 Johor Bahru 页面比较 CTR、点击与排名（约 2026-11-18 后查看；考虑数据延迟）。不把排名或曝光当作收入。
3. `pond_claim_requests` 表与 RLS 已只读确认；接下来在不插入合成生产申请的前提下，补做用户授权下的端到端验证或等待第一条真实商家申请。
4. 等待 Syawal、D’Tiram、Joran Fest、Ko-Nelayan 与 MM Fishing Tackle 对邀请回复。Joran Fest 联系人表示会告知管理层，暂无赛事资料确认；其他邀约发出后 7 天内不重复联系。只在收到主办方确认后整理 JomPancing 活动页，不复制官网旧场次的报名/费用文字。MBSA 活动暂不联系，因为其官方总机在 WhatsApp 搜索中没有账号。
5. 让经营者检查资料并记录确认依据及日期。使用 Vercel Analytics 报告实际页面访问；Hobby 没有自定义事件，所以当前不宣称统计地图路线或 WhatsApp 点击。
6. 试点结束后，以真实数据和经营者意愿决定是否测试赞助展示；未确认付费意愿前不收款、不公开承诺效果。

## 流量分析配置（2026-10-21）

三语隐私政策已上线并说明 Vercel 无 Cookie 网站分析及其汇总页面、来源、概略地区和设备类型数据。已在 Vercel Hobby 启用 Web Analytics；Hobby 每月 50,000 events、30 天历史、不支持自定义事件。自动化访问不计入分析，所以 Codex 的 QA 页面访问不会被当作自然访问；等待真实访客后再读流量基线。来源：<https://vercel.com/docs/analytics/limits-and-pricing>、<https://vercel.com/docs/analytics/privacy-policy>、<https://vercel.com/docs/analytics>。

2026-10-21 首次查看 Vercel Analytics 的 Last 7 Days 面板：6 visitors、25 page views、67% bounce rate；Google referrer 显示 3 visitors，设备分布 67% mobile。数据样本很小，且无法从面板确认访客身份、购买意图或商家联系动作；只作为初始观测，不据此推断增长或成交。页面列表中尚无可确认的渔具刊登或商家联系转化数据。Hobby 档没有自定义事件。

## 地区资料修正（2026-10-21）

生产 Johor Bahru 地点列表曾包含地址位于 Kulai 的 Star Fish Leisure Farm。Kulai 是独立县区，Senai 也归 Kulai；此前本地筛选资料把 Senai 放在 Johor Bahru，Google 导入行的地区分类也可能错误。代码现补齐 Johor 县区、将 Senai/Kulai 移入 Kulai，并依据 Google 地址在读取时修正导入地点的 district/area，不改写 Supabase 数据。地区筛选和水域筛选改用保留 query filters 的浏览 URL，避免 SEO canonical 路径清掉用户选择。

发布后应确认 Johor Bahru 列表不再显示 Kulai 地址的地点、Kulai 列表能找到相应地点，且切换水域筛选后仍保留地区条件。此前观察到的 31 条是修正前数量，不能继续当作当前数量。依据：<https://ptj.johor.gov.my/pejabat-tanah-kulai/profil-daerah-kulai/>。
