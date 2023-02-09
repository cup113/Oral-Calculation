# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog],
and this project adheres to [Semantic Versioning].

## [[Unreleased]]

- Developing

## [0.4.2] - 2023-02-09

### Added

- [#14] 初步完成打印功能。

### Changed

- 完善了产品发布流程。

### Fixed

- 修复了错题本显示异常的问题。
- 修复了只做 1 题时报告显示异常的问题。
- 修复了二维码内容错误的问题。
- 修复了不选择类别无提示的问题。
- 修复了更改类别时默认参数显示异常的问题。

## [0.4.1] - 2023-02-08

### Added

- [#15] 增加了错题本功能。

### Changed

- 优化了文件结构。
- 更改了报告界面的用时展示。
- 取消了报告分享界面数据的响应式以改善性能。
- 更改了报告界面的颜色设计。

## [0.4.0] - 2023-02-08

### Added

- [#6] 增加了生成报告分享功能。
- 完善 `README` 说明文档。

### Changed

- 修改架构，弃用 `Pug` 改用 `HTML`。
- 优化练习界面部分样式。

## [0.3.1] - 2023-02-07

### Changed

- 修正更新日志的链接错误。
- 完善版本发布流程。

### Fixed

- [#12] 修复了欢迎界面参数不同步的问题。
- 修复了回答错误时总计时长暂时出错的问题。

## [0.3.0] - 2023-02-07

### Added

- [#9] 添加了使用说明文档。
- [#3] [#11] 添加了问题生成的参数检查。
- 添加了主页的描述和关键词。
- 进入练习界面时自动聚焦于输入框。

### Changed

- 更改了版本发布和普通提交的流程。
- 改善了代码内部组织结构。
- 更改了代码测试流程。

### Fixed

- [#10] 修复了保存的参数不能同步到设置界面输入框中的问题。
- 修复了在问题生成模块未加载时错误识别成已加载的问题。

## [0.2.1] - 2023-02-04

### Added

- [#7] [#8] 增加“避免重复题”（`avoidRepeat`）和“生成题目”（`generateAtOnce`）设置。
- [#3] 增加了 `localStorage` 数据存取时的有效性检查
- 增加了 Pinia store 和 Vue 组件测试。

### Changed

- [#3] 重构设置系统。
- 重构练习数据存储，将逻辑从 Vue 组件中提取到 Pinia store 中。
- 优化按钮 UI 界面。
- 优化提示信息。
- 改变了 `localStorage` 中存储数据的方式。

## [0.2.0] - 2023-02-02

第一版正式发行版本。

<!-- Links -->
[keep a changelog]: https://keepachangelog.com/en/1.0.0/
[semantic versioning]: https://semver.org/spec/v2.0.0.html

<!-- Versions -->
[Unreleased]: https://github.com/cup113/Oral-Calculation/compare/v0.4.2..HEAD
[0.4.2]: https://github.com/cup113/Oral-Calculation/compare/v0.4.1..v0.4.2
[0.4.1]: https://github.com/cup113/Oral-Calculation/compare/v0.4.0..v0.4.1
[0.4.0]: https://github.com/cup113/Oral-Calculation/compare/v0.3.1..v0.4.0
[0.3.1]: https://github.com/cup113/Oral-Calculation/compare/v0.3.0..v0.3.1
[0.3.0]: https://github.com/cup113/Oral-Calculation/compare/v0.2.1..v0.3.0
[0.2.1]: https://github.com/cup113/Oral-Calculation/compare/7461c35de227dd6afaa50cec66fa5fa8e9deeab4..v0.2.1
[0.2.0]: https://github.com/cup113/Oral-Calculation/tree/7461c35de227dd6afaa50cec66fa5fa8e9deeab4

<!--Issues-->
[#3]: https://github.com/cup113/Oral-Calculation/issues/3
[#6]: https://github.com/cup113/Oral-Calculation/issues/6
[#7]: https://github.com/cup113/Oral-Calculation/issues/7
[#8]: https://github.com/cup113/Oral-Calculation/issues/8
[#9]: https://github.com/cup113/Oral-Calculation/issues/9
[#10]: https://github.com/cup113/Oral-Calculation/issues/10
[#11]: https://github.com/cup113/Oral-Calculation/issues/11
[#12]: https://github.com/cup113/Oral-Calculation/issues/12
[#14]: https://github.com/cup113/Oral-Calculation/issues/14
[#15]: https://github.com/cup113/Oral-Calculation/issues/15
