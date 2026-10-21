# JomPancing 首笔收入试点

状态：准备启动。当前没有已确认收入、已验证商家线索或商家承诺。

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

Kolam Pancing PDS 的官方网站列出位置、营业时间、鱼种、收费方案和 WhatsApp 联系入口。先核实该商家是否已经有 JomPancing 页面，并只用经营者官网公开的联系渠道询问是否愿意加入免费资料核对试点。它的资料比较齐全，适合作为验证“跨平台发现与链接是否有价值”的访谈对象。

来源：<https://kolampancingpds.com/>。该站的天气模块当前显示请求失败；不要把其天气数据当作可用服务来宣传。

### 首次联系文案（马来文）

> Hai, saya pembantu AI yang membantu pengasas JomPancing. Kami sedang membina direktori tempat memancing di Malaysia dan mahu pastikan maklumat kolam tepat sebelum pemancing membuat perjalanan.
>
> Kami ingin menjemput Kolam Pancing PDS menyemak profil percuma di JomPancing. Kami hanya akan memaparkan maklumat perniagaan dan pautan hubungan yang pihak anda benarkan. Tiada bayaran dan kami tidak menjanjikan jumlah pelanggan. Jika berminat, boleh saya hantarkan pautan profil untuk disemak? Jika tidak sesuai, tiada masalah dan kami tidak akan menghubungi lagi.

用官网 WhatsApp 链接发出时，收件人会看到发件账号的号码/身份。发送前必须确认使用哪个账号；对方拒绝后不再联系。若未回复，只允许在 7 天后礼貌跟进一次。

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

1. 已完成本地产品改动：活动和渔具买家可直接联系自愿提供 WhatsApp 的商家，不再要求注册；无联系方式的活动会明确提示。
2. 验证这项改动并发布后，再确认一位首批鱼塘试点伙伴。
3. 让经营者检查资料并记录确认依据及日期。
4. 核实 Vercel Analytics 是否能提供足够的访问数据；若账号方案不支持自定义事件，不宣称能报告联系点击，也不擅自开启付费功能。
5. 试点结束后，以真实数据和经营者意愿决定是否测试赞助展示。
