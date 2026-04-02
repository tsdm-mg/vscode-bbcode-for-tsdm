# DiagErrUnknownTag

`DiagErrUnknownTag`是指使用了未知的BBCode标签，当前记录的标签请在[README.md](../../../README.md)中查找。

通常情况下，未知tag不会被渲染为相应的html标签，而是保持纯文本。

## Fix

遇到这个错误请考虑是否打错了标签的名字，例如文本颜色使用的是`[color]`而不是`[colour]`，背景颜色是`[backcolor]`而不是`[backgroundcolor]`。

## Example

```console
# Bad
[bold][/bold]

# Good
[b][/b]


# Bad
[colour][/colour]

# Good
[color][/color]
```

## Note

- tsdm使用的标签均为最短简写，这可能与其它论坛或用途中的BBCode标签不同。
  - 例如使用`[b]`而不是`[bold]`。
- 目前插件定义的标签仅供tsdm使用，如果是其它论坛或者用途中有其它BBCode标签，请忽略这条错误。
  - 未来会考虑在插件设置中增加language server检查语法错误的开关，以不再检查此类错误。
- 目前没有计划在插件中增加配置来支持更多自定义tag。
