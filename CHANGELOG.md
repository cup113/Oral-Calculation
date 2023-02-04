# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog],
and this project adheres to [Semantic Versioning].

## [[Unreleased]]

- Developing

## [0.2.1] - 2023-02-04

### Added

- [#7] [#8] 增加“避免重复题”（`avoidRepeat`）和“生成题目”（`generateAtOnce`）设置
- [#3] 增加了 `localStorage` 数据存取时的有效性检查
- 增加了 Pinia store 和 Vue 组件测试

### Changed

- [#3] 重构设置系统
- 重构练习数据存储，将逻辑从 Vue 组件中提取到 Pinia store 中
- 优化按钮 UI 界面
- 优化提示信息
- 改变`localStorage`中存储数据的方式

## [0.2.0] - 2023-02-02

Initial release version

<!-- Links -->
[keep a changelog]: https://keepachangelog.com/en/1.0.0/
[semantic versioning]: https://semver.org/spec/v2.0.0.html

<!-- Versions -->
[Unreleased]: https://github.com/cup113/Oral-Calculation/compare/v0.2.1..HEAD
[0.2.1]: https://github.com/cup113/Oral-Calculation/compare/v0.2.0..v0.2.1
[0.2.0]: https://github.com/cup113/Oral-Calculation/tree/v0.2.0

<!--Issues-->
[#3]: https://github.com/cup113/Oral-Calculation/issues/3
[#7]: https://github.com/cup113/Oral-Calculation/issues/7
[#8]: https://github.com/cup113/Oral-Calculation/issues/8
