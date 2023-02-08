# 口算练习

[![wakatime](https://wakatime.com/badge/user/b039f61c-2701-482d-9f84-542f07630e52/project/263532e1-5ee6-47c8-88d2-be5ba984adfc.svg)](https://wakatime.com/badge/user/b039f61c-2701-482d-9f84-542f07630e52/project/263532e1-5ee6-47c8-88d2-be5ba984adfc)
[![GitHub repo size](https://img.shields.io/github/languages/code-size/cup113/Oral-Calculation)](https://github.com/cup113/Oral-Calculation)
[![Version](https://img.shields.io/github/package-json/v/cup113/Oral-Calculation)](https://github.com/cup113/Oral-Calculation)
[![MIT License](https://img.shields.io/github/license/cup113/Oral-Calculation)](https://github.com/cup113/Oral-Calculation)
![Code Coverage](https://img.shields.io/badge/coverage-90%25-yellowgreen)
[![Netlify Status](https://api.netlify.com/api/v1/badges/7c1fcffe-fbe5-42a6-a8ac-bbd05641bc58/deploy-status)](https://app.netlify.com/sites/oral-calculation/deploys)

## 使用说明

本产品由 **5** 个界面组成：

### 开始界面 (Welcome)

> 由于设置会自动保存，除初次进入外，前三步执行根据是否需要更改而定。
> 也可点击左上角“错题本”按钮进入[错题本界面](#错题本界面-mistakes-collection)。

1. 选择“类别”。
2. 对“题数”“避免重复题”“生成题目”等项进行配置。
3. 配置题型参数。
4. 点击“提交”，进入[练习界面](#练习界面-exercise)

### 练习界面 (Exercise)

> 如果你频繁练习一种题型，可以直接收藏此页面。此页面的网址(URL)已经保存了题型参数和数量等信息。
>
> 为了防止多次重复，以下所有`Enter`均指在键盘上敲击回车键，或在手机/平板屏幕上点击输入法的“开始”“发送”等键。

1. 点击“开始”按钮或敲击`Enter`以开始答题。
2. 根据题目输入答案，并点击“提交”或敲击`Enter`
3. 接下来的操作根据是否回答正确而定：
   - **若回答正确**，右下角会弹出提示窗口（手机/平板不一定看得到，可观察最上方进度条是否移动，移动说明答对），进入下一步。
   - **若回答错误**，正上方会弹出提示窗口，需要立即再次作答。注意，修改时间会计入答题时间。
4. 一道题答完之后的时间**不会**计算到答题时间内，可在任意时候再敲击`Enter`回答下一道题
5. 等到进度条到达最右侧时，答题结束。正上方会弹出提示窗口，等待跳转到[报告界面](#报告界面-report)。

### 报告界面 (Report)

可以点击“返回主页”回到[开始界面](#开始界面-welcome)，或点击“分享”跳转到[报告分享界面](#报告分享界面-report-share)。

### 报告分享界面 (Report Share)

可截屏保存，然后点击“返回主页”回到[开始界面](#开始界面-welcome)。

### 错题本界面 (Mistakes Collection)

1. 在此处可看到所有历史错题。**此功能暂不完善**，在题数多时可能有性能问题，并没有单独删除错题的功能。
2. 可点击“返回主页”回到[开始界面](#开始界面-welcome)。
3. 点击“导出记录”可将错题以 `.json` 文件格式导出。（可能需要等待一段时间）
4. 遇到性能问题或导出完毕后，可点击“清空错题本”清空所有历史错题。

## 产品特色

1. 设置自动保存。
2. 高度可定制化的题型。
3. 在线计时练习。
4. 结束后提供全面报告。
