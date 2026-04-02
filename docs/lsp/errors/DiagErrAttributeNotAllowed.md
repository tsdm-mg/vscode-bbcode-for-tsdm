# DiagErrAttributeNotAllowed

`DiagErrAttributeNotAllowed`是指在不支持属性的标签上使用了属性。

属性是指BBCode标签的开头部分中处在`=`右边的内容。

通常情况下说明标签的用法有误。

## Fix

遇到这个错误请去掉相应标签开头部分中的属性，也就是`=`右边的内容，连同`=`一起去掉。

## Example

```console
# Bad
[b=attr][/b]

# Good
[b][/b]
```

## Note

- 标签是否支持使用属性由tsdm上标签的用法决定，这可能与其它论坛或用途中的标签用法不同。
