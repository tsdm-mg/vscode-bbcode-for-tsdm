# bbcode-for-tsdm

VSCode扩展，支持TSDM风格的BBCode。

## 功能

* [x] 标签补全
* [x] html补全功能（已集成VSCode内置的html支持）
* [ ] 语法检查（language-server）
  * [ ] 未闭合的标签
  * [ ] 未成对的标签
  * [ ] 未知的标签
  * [ ] 无效的标签属性
  * [ ] 错误的标签嵌套顺序
* [ ] 风格检查（linter）
  * [ ] 空标签
  * [ ] 块标签后没有换行

## 支持的标签

* 对齐`align`
* 背景颜色`backcolor`
* 粗体`bold`
* 代码块`codeBlock`
* 文字颜色`color`
* 水平分割线`hr`
* 字体大小`size`
* 免费区域`free`
* 隐藏区域`hide`
* 图片`img`
* 斜体`i`
* 列表`list`
* 列表元素`*`
* 引用`quote`
* 折叠区域`spoiler`
* 删除线`s`
* 上标`sup`
* 下标`sub`
* 表格`table`
* 表格行`tr`
* 表格单元格`td`
* 下划线`u`
* 提醒用户`@`

## 开发

### 安装依赖

`pnpm install`

按F5或下方`Run Extension`开始调试
