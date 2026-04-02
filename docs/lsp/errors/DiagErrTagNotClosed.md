# DiagErrTagNotClosed

`DiagErrTagNotClosed`是指写了一个标签的开头部分，而没有对应的结束部分。

## Fix

- 如果是在编写过程中标签目前只写了一半时遇到这个错误，建议忽略。
- 如果标签本意是写完了，请检查标签的顺序和名字有没有写错。

## Example

```console
# Bad
[b]

# Good
[b][/b]


# Bad
[b][i][/b]

# Good
[b][i][/i][/b]


下面这种情况是两个tag存在交叉

# Bad
[b][i][/b][/i]

# Good
[b][i][/i][/b]
```

## Note

- 标签的用法以tsdm为准。
- 交叉tag可能会得到和正常格式一样的渲染效果，但不推荐写交叉。
