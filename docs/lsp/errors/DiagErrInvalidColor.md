# DiagErrInvalidColor

`DiagErrInvalidColor`是指在`[color]`中使用了无效的颜色。

## Fix

遇到这个错误，请填写正确的颜色格式。

## Example

```console
# Bad
[color=rgb(255,0,0)][/color]

# Good
[color=red][/color]
[color=Red][/color]
[color=RED][/color]
[color=#ff0000][/color]


# Bad
[color=aabbcc][/color]

# Good
[color=#aabbcc][/color]
```

## Note

- 理论上，tsdm中的`[color]`支持所有在css中合法的颜色格式，但考虑到使用效果和使用频率，插件仅支持以下格式：
  - 使用颜色名`[color=red]`，颜色名称不区分大小写。
  - 使用hex值`[color=#ff0000]`，hex值不区分大小写。
- 目前插件内置支持的颜色有100余种颜色名，language server已支持颜色名补全，可在输入时预览颜色。
- 由于vscode不支持自定义color picker UI，通过颜色预览小方块调整的颜色值会始终使用hex值，无法使用颜色名。如果想使用颜色名，请手动输入。
