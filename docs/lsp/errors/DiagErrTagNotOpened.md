# DiagErrTagNotOpened

`DiagErrTagNotOpened`是指一个标签只有闭合的部分，没有开头的部分。

## Fix

需要给相应的标签补充上缺失的开头。

## Example

```console
# Bad
[/i]

# Good
[i][/i]
```

## Note

- 标签的用法以tsdm为准。
