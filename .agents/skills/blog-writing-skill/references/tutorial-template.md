# 教程博文模板

创建 Momo/Astro 博文时使用本模板。已有文章的 frontmatter 与目录约定优先于模板。

```markdown
---
title: 简短标题
pubDate: YYYY-MM-DD
draft: true
description: 一句话说明教程覆盖的流程和结果。
image: ""
slugId: unique-english-slug
category: 技术
pinTop: 0
---

用一至两段说明结果、适用条件、主要成本或限制。不要写泛泛的行业背景。

## 一、准备工作

- 适用平台：
- 软件或服务版本：
- 官方网站：[名称](https://example.com/)
- 官方文档：[名称](https://example.com/docs)
- 代码仓库：[owner/repository](https://github.com/owner/repository)
- 需要准备的账号、域名、服务器或付款方式：

## 二、完成核心操作

### 1、打开操作入口

打开[页面名称](https://example.com/)，进入具体菜单路径。

预期结果：页面显示……

### 2、填写配置

```text
需要填写的准确内容
```

确认字段、选项和最终显示状态。

### 3、执行命令

```powershell
command --option value
```

预期输出：

```text
Success
```

## 三、验证结果

1. 打开验证页面或运行检查命令。
2. 确认状态、返回值或文件内容符合预期。
3. 记录生效时间或缓存影响。

## 四、常见问题

### 1、出现某个错误

说明症状、原因、修复步骤和修复后的验证方式。

## 五、费用与续费

列出首次价格、续费价格、税费、汇率、优惠期限和查询日期。无法确认的数据标记为待确认。

## 六、相关链接

- [官方网站](https://example.com/)
- [官方文档](https://example.com/docs)
- [代码仓库](https://github.com/owner/repository)
```

## 双语文章

- 中文文件通常为 `zh-cn.md`，英文文件通常为 `en.md`。
- 两个版本使用相同的 `slugId`、日期和技术事实。
- 英文版按英语教程习惯重写，不逐句硬译中文句式。
- 英文版同样避免第二人称，使用直接动作句，例如 `Open the dashboard`、`Select Settings`、`Verify that the status is Active`。
