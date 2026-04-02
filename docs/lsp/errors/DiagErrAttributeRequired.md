# DiagErrAttributeRequired

`DiagErrAttributeRequired`是指在必须填写属性的标签上没有填写属性。

## Fix

遇到这个错误，请在标签开头部分按照标签的用法填写属性，并且标签的名字和标签的属性之间用`=`分隔。

## Example

```console
# Bad
[img][/img]

# Good
[img=640,480][/img]


# Bad
[size][/size]

# Good
[size=2][/size]
```

## Note

- 标签的用法以tsdm上的用法为准。
