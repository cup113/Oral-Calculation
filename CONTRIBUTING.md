# 为 Oral-Calculation 贡献

## 系统环境

目前直接支持 Windows 7+ 环境。

## 运行命令

若无 `pnpm` 包管理器，请先安装：

```bash
npm install --location=global pnpm
```

然后进行克隆构建：

```bash
git clone https://github.com/cup113/Oral-Calculation
cd Oral-Calculation
pnpm i
```

推荐使用 `vscode` 打开：

```bash
code Oral-Calculation.code-workspace
```

其他脚本详见 `package.json` 。

## 创建 Pull Request

1. 请确保 `pnpm build` 执行通过。
2. 对于功能性新增，请修改 `README.md` 。
3. 重大更新请先提出 `issue` ， 否则请**不要更改**版本号、 `.gitignore` `package.json` 等文件。

## 当前主要需求

1. 扩展系统环境：将提交脚本放至 `build` 目录下，并考虑换行符的兼容性问题。
2. 完善测试：主要是 Pinia store 和 Vue components 测试。
3. 完善边缘功能：打印/错题本/分享报告等功能。
4. 完善核心出题功能：带括号的加减混合/四则运算、指定进退位等。
