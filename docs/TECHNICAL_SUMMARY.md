# 技术实现总结

## 1. 实现步骤

1. 数据建模与整理  
   在 `src/data/timelineData.js` 定义朝代组 `dynastyGroups`，每个朝代包含君主数组；统一使用公元年整数（公元前为负数）。
2. 时代合并与标准化  
   在 `src/App.jsx` 的 `mergePeriodGroups` 中完成逻辑合并：春秋/战国拆分、三国合并、魏晋南北朝合并、五代十国合并、武周并唐。
3. 时间轴坐标系统  
   通过 `getXByYear` 将年份映射到像素坐标，配合 `zoom`（每年像素）实现可缩放时间轴。
4. 主轴/子轴双视图  
   主轴按过滤后的朝代区间计算范围；双击朝代进入子时间轴，范围按该朝代君主生卒年外扩计算。
5. 多层轨道渲染  
   每个君主可同时渲染生卒轨、在位轨、年号轨（可配置显示/隐藏）。
6. 交互完善  
   增加 hover tooltip、右键维基菜单、双击聚焦高亮、拖拽平移、滚轮缩放/滚屏分区行为。
7. 时点光轴  
   提供可拖动时间光轴，实时计算该时点存活君主/在位君主/年龄/在位年数/年号并支持复制。
8. 设置与控制菜单  
   常用操作放控制菜单，细项放 Settings 弹窗并按“图层/文本/交互”分组。
9. URL 与历史记录  
   子时间轴状态写入 URL `?sub=<dynastyId>`，使用 `history.pushState/replaceState + popstate` 支持前进后退恢复。
10. 部署  
    使用 GitHub Actions 构建并部署到 GitHub Pages。

## 2. 项目依赖

## 运行时依赖

- `react` / `react-dom`：UI 渲染与状态管理
- `cn-era`：年号与朝代枚举辅助，用于年号段推导与对齐

## 开发依赖

- `vite`：开发服务器与构建
- `@vitejs/plugin-react`：React 编译支持
- `eslint` + `@eslint/js` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` + `globals`：代码规范检查

## 3. 关键技术细节

## 3.1 数据结构

- 朝代对象核心字段：
  - `id`, `name`, `category`, `startYear`, `endYear`, `rulers`
- 君主对象核心字段：
  - `id`, `name`, `title`, `birthYear`, `deathYear`, `reignStart`, `reignEnd`, `eraName` 或 `eraPeriods`

## 3.2 年份与区间处理

- 公元前年份统一使用负数（例如前 2100 => `-2100`）
- 所有轨道区间先归一化再映射，避免前后颠倒导致渲染异常
- 年号段使用“下一段起点衔接”策略处理连续边界，减少视觉断裂

## 3.3 可视化层级

- 主轴层：刻度、分期背景色带、左右端年份
- 朝代层：朝代轨、朝代名、君主数、区间
- 君主层：生卒轨、在位轨、年号分段轨、在位年数标签、首尾年份

## 3.4 交互模型

- 左右分区滚轮：
  - `pointerX <= LABEL_WIDTH` 时，滚轮转为页面纵向滚动
  - 右侧区域滚轮用于轴缩放，并保持指针附近年份相对稳定
- 拖拽平移：按住时间轴空白区域横向拖动 `scrollLeft`
- 双击行为：
  - 朝代名称：进入子时间轴
  - 朝代轨道：聚焦该朝代区间
  - 君主名称/轨道：聚焦并高亮该君主
- 右键行为：
  - 打开上下文菜单，点击后跳转中文维基百科检索页

## 3.5 时点光轴

- 光轴可拖动并支持 `-1/+1` 与直接输入年份
- 信息面板显示：
  - 当前时点存活人数
  - 当前在位人数
  - 每位君主年龄、在位年数、活跃年号
- 面板可复制为文本摘要（用于外部粘贴）

## 3.6 状态与性能

- 使用 `useMemo` 缓存：
  - 朝代合并结果、过滤结果、行布局、时点统计等
- 使用 `useCallback` 保持关键处理函数引用稳定
- 在 `zoom` 变化时使用 `pendingScrollLeftRef` 保持视窗连续性，减少跳动

## 3.7 设置系统

- 设置状态集中在 `displaySettings`
- 分组定义在 `DISPLAY_SETTING_GROUPS`
- 设置弹窗为单一入口，常用按钮（适应缩放、时点光轴、展开/收起）放在顶部控制菜单

## 4. 部署细节

- GitHub Pages 工作流：`.github/workflows/deploy-pages.yml`
- 触发条件：`main` 分支 push 或手动触发
- 部署动作：
  - `npm ci`
  - `npm run build`
  - 上传 `dist` 并发布到 Pages
- `vite.config.js` 动态 `base`：
  - 本地开发为 `/`
  - Actions 环境根据仓库名自动生成 `/<repo>/`

## 5. 已部署地址

- https://txc-alon.github.io/TimeLine/
