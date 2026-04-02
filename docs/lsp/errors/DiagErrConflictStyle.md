# DiagErrConflictStyle

`DiagErrConflictStyle`是指不同类型的标签在嵌套的情况下出现某个标签的效果与其它标签冲突的情况

## Fix

遇到这个错误，请根据报错提示中标签类型进行更改。

这个问题的原理是，一些标签会自带一些格式，而嵌套的层级中内部标签的格式优先生效。例如`[url]`的内容文本带有文本颜色属性，会覆盖外部`[color]`设置的字体颜色。

## Example

```console
# Bad
[color=red][url]...[/url][/color]

# Good
[url][color=red]...[/color][url]
```

## Note

- 提到的标签用法以tsdm为准。
