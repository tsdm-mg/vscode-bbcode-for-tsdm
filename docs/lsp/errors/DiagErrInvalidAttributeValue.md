# DiagErrInvalidAttributeValue

`DiagErrInvalidAttributeValue`是指给标签填写了无效的属性。

## Fix

遇到这个错误，请修改标签开头部分中的属性，也就是`=`右边的内容，按照标签的正确用法填写。

## Example

```console
# Bad
[img=100][/img]

# Good
[img=640,480][/img]


# Bad
[size=100][/size]

# Good
[size=2][/size]
```

## Note

- 标签的用法以tsdm为准。
- 有的标签会提示出哪些值合法，这些合法值也是以tsdm为准。
