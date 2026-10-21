# JomPancing 首笔收入试点

状态：首家商家试点准备中。实收收入 RM0，已联系经营者 0，经营者承诺 0；已选出一位与 Johor Bahru 搜索需求匹配的候选商家，待确认 JomPancing 官方发件身份。

## 运营检查点（2026-10-21）

- 正式 Vercel 项目已配置 `SUPABASE_SERVICE_ROLE_KEY`（仅核对变量名称和 Production 环境，未读取密钥值）。
- Supabase 状态页在 2026-10-21 显示恢复正常。已在正式 JomPancing 项目用只读 SQL 确认 `pond_claim_requests` 存在、RLS 已开启、anon/authenticated 无 SELECT 权限、service_role 有 SELECT/INSERT 权限；没有读取申请人资料，也没有写入数据库。Vercel Production 配置中确认存在 `SUPABASE_SERVICE_ROLE_KEY`、`ADMIN_EMAILS` 和 Supabase 公共连接变量（未查看值）。申请流程具备数据库与配置条件，但尚未做真实提交的端到端验证。
- 当前没有确认 JomPancing 自有的 Messenger 或 WhatsApp Business 发件身份，因此尚未外联。上一版曾把 Selangor 的 PDS 列为首选；现根据 Johor Bahru 搜索需求改为已有 JomPancing 地点页的 Kolam Pancing Syawal / Sungai Rekoh。
- Vercel 项目属于 Hobby。已先发布三语隐私说明，再按用户许可启用 Web Analytics Hobby 档：免费额度 50,000 events/月、30 天历史、无自定义事件；没有升级 Pro。面板已从 demo 状态转为真实 Analytics 页面，目前暂无可用生产数据；Vercel 会排除自动化流量。可看页面浏览、来源和设备等，不能把页面浏览当作商家联系点击。
- 最新 Search Console（2026-09-09 至 2026-10-18，报告 7 小时前更新）：174 次点击、11,400 次曝光、CTR 1.5%、平均排名 7。`kolam pancing near me` 有 615 次曝光、3 次点击、CTR 0.5%、平均排名 7.2；该查询主要落到 Johor Bahru 地区页。产品目前能让用户手动按距离筛选，但 GPS 曾在全站打开时自动请求。
- GPS 现为用户点击后才请求，坐标用途说明与三语隐私文案已上线（提交 `a27ce8d`）。
- 验证：TypeScript、受影响文件 ESLint、Next.js 生产构建均通过；Vercel 部署成功。生产浏览器已检查地点页；本地预览受浏览器策略拦截。没有点击“附近”按钮，因此没有触发设备定位授权。
- 生产页检查（2026-10-21）：Johor Bahru 地区页服务器端输出 31 个地点。马来文标题已改为以“Kolam Pancing”开头，英/中文标题和三语摘要也同步调整，明确地点与资料范围，并提醒出发前确认开放、收费及时段（提交 `c4cd974`；三个语言的生产页均返回 200，摘要没有截断）。尚无证据证明 CTR 已改善；从当前 GSC 基线起观察同一查询/页面至少 28 天。公开 sitemap 搜索没有发现名称含 PDS 的钓点页，当前把它当作待开发商家线索，而非已上架商家。
- 生产浏览器 QA 发现多家 Google Maps 导入鱼塘共用未经核实的收费、场次、鱼种和家庭适用描述。运行时现统一展示未核实说明，隐藏导入记录中的推测鱼种/标签，新导入及旧 SEO enrichment 脚本也已修正（提交 `4d423af`）。之前本地 `.env.local` 缺少 service key，无法运行 enrichment dry-run；本次地区及隐私分析更新没有数据库写入需求。
- 当前已知实收收入仍为 RM0。不要把 GSC 点击、页面访问或邀约当成收入。

## 经营判断

先把 JomPancing 做成可靠的钓点搜索与出发规划入口。公开搜索数据已有本地意图，但还不足以证明商家愿意为曝光付费。

- Search Console 导出筛选器写着“最近 3 个月”。图表实际覆盖 2026-09-09 至 2026-10-11，共 33 个日期行，合计 110 次点击、6,944 次曝光，CTR 为 1.58%。
- 马来西亚带来 100 次点击和 6,613 次曝光。
- `kolam pancing near me` 有 391 次曝光、2 次点击、平均排名 7.51。
- Johor Bahru 区域页有 628 次曝光、8 次点击；Johor 州页有 685 次曝光、4 次点击。
- 活动推广目前提供 2 天免费，之后提示 RM29/天；代码没有付款结账或广告成效归因流程。先暂停把它当主要收入来源。

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

候选页面：<https://www.jompancing.my/ms/spots/kolam-pancing-sungai-rekoh-7mmCYQ2g>。商家页面：<https://www.facebook.com/kolampancingsyawal/>。佐证来源：<https://www.waze.com/live-map/directions/my/johor/masai/kolam-pancing-syawal-kampung-teluk-jawa-masai?to=place.ChIJBwj4ddEU2jERG1l7mmCYQ2g>、<https://mohredahangler.wixsite.com/pancing/senarai-kolam-air-masin>。

备选是 Kolam Pancing PDS，位于 Selangor；官网信息较完整，可在本地试点后再联系：<https://kolampancingpds.com/>。官网天气模块请求失败，不要把其天气数据当作可用服务来宣传。

### 首次联系文案（马来文）

> Hai, saya pembantu AI yang membantu pengasas JomPancing. Kami sedang menyemak maklumat kolam sekitar Johor Bahru supaya pemancing boleh membuat perancangan yang lebih tepat. Kami ada halaman Kolam Pancing Sungai Rekoh di JomPancing dan ingin menjemput pihak tuan menyemak alamat, waktu operasi, kadar bayaran dan peraturan secara percuma.
>
> Kami hanya akan mengemas kini maklumat yang disahkan dan memaparkan saluran hubungan perniagaan dengan kebenaran pihak tuan. Tiada bayaran dan tiada janji jumlah pelanggan. Jika berminat, boleh saya hantarkan pautan untuk disemak? Jika tidak sesuai, tiada masalah dan kami tidak akan menghubungi lagi.

通过商家主页的 Messenger 联系时，收件人会看到发件账号/页面身份。当前没有确认 JomPancing 对外发送账号，因此暂不发送；不要从私人账号代表公司联系。对方拒绝后不再联系。若未回复，只允许在 7 天后礼貌跟进一次。

### 后续付费假设

不在首条消息中收费。若经营者完成核对并愿意继续，可单独访谈其最看重的价值：更多有效询问、容易更新资料，还是促销展示。可测试一次性的 RM49 / 30 天赞助展示，但这只是待验证的价格假设；先展示实际数据和清楚的广告标记，不保证流量或订单。没有商家认可与明确付款方式前，不收款、不在网站公开报价。

## 每周记录

| 指标 | 记录定义 | 目前状态 |
|---|---|---|
| 商家邀约数 | 通过经营者公开业务渠道发送的个性化邀约 | 0 |
| 回复数 | 商家主动回复，不含系统送达/已读 | 0 |
| 资料确认数 | 商家逐项确认公开的地址、时段、收费或规则 | 0 |
| 纠错完成数 | 已核实并更新的钓点资料 | 0 |
| 商家联系动作 | 页面上的 WhatsApp / 电话外链点击 | 尚无可靠的自定义事件统计 |
| 付费意愿 | 商家明确说愿意为指定服务及价格付费 | 0 |
| 实收收入 | 已到账金额，按 MYR 记录 | RM0（截至本计划） |

## 当前执行顺序

1. 活动/渔具 WhatsApp 联系体验、GPS 点击后授权、Johor Bahru 三语搜索摘要及导入地点资料可信度修复均已发布。
2. 继续观察 Search Console 同一查询/页面至少 28 天；在用户允许设备定位时，再验证真实定位交互，不把排名或曝光当作收入。
3. `pond_claim_requests` 表与 RLS 已只读确认；接下来在不插入合成生产申请的前提下，补做用户授权下的端到端验证或等待第一条真实商家申请。
4. 确认 JomPancing 对外 WhatsApp 账号后，联系一位鱼塘经营者，提供免费资料核对；当前邀约数仍为 0。
5. 让经营者检查资料并记录确认依据及日期。使用 Vercel Analytics 报告实际页面访问；Hobby 没有自定义事件，所以当前不宣称统计地图路线或 WhatsApp 点击。
6. 试点结束后，以真实数据和经营者意愿决定是否测试赞助展示；未确认付费意愿前不收款、不公开承诺效果。

## 流量分析配置（2026-10-21）

三语隐私政策已上线并说明 Vercel 无 Cookie 网站分析及其汇总页面、来源、概略地区和设备类型数据。已在 Vercel Hobby 启用 Web Analytics；Hobby 每月 50,000 events、30 天历史、不支持自定义事件。自动化访问不计入分析，所以 Codex 的 QA 页面访问不会被当作自然访问；等待真实访客后再读流量基线。来源：<https://vercel.com/docs/analytics/limits-and-pricing>、<https://vercel.com/docs/analytics/privacy-policy>、<https://vercel.com/docs/analytics>。

## 地区资料修正（2026-10-21）

生产 Johor Bahru 地点列表曾包含地址位于 Kulai 的 Star Fish Leisure Farm。Kulai 是独立县区，Senai 也归 Kulai；此前本地筛选资料把 Senai 放在 Johor Bahru，Google 导入行的地区分类也可能错误。代码现补齐 Johor 县区、将 Senai/Kulai 移入 Kulai，并依据 Google 地址在读取时修正导入地点的 district/area，不改写 Supabase 数据。地区筛选和水域筛选改用保留 query filters 的浏览 URL，避免 SEO canonical 路径清掉用户选择。

发布后应确认 Johor Bahru 列表不再显示 Kulai 地址的地点、Kulai 列表能找到相应地点，且切换水域筛选后仍保留地区条件。此前观察到的 31 条是修正前数量，不能继续当作当前数量。依据：<https://ptj.johor.gov.my/pejabat-tanah-kulai/profil-daerah-kulai/>。
