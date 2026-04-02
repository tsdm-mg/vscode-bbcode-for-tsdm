# DiagErrUrlTargetRequired

`DiagErrUrlTargetRequired`是指`[url]`标签没有填写链接。

## Fix

请补足`[url]`中的属性。

属性的填写方法有两种：

1. 写在属性上。
2. 写在标签内容里。

填写的链接如果是站内链接，可以不填写`https://tsdm39.com/`。

## Example

```console
# Bad
[url][/url]
[url=][/url]

# Good
[url]https://tsdm39.com[/url]
[url=https://tsdm39.com]...[/url]
[url=forum.php][/url]
```

## Note

- 标签的用法以tsdm为准。
