<!--
 * @Description  : Git
 * @Author       : YH000052
 * @LastEditors  : YH000052
 * @Date         : 2020-07-02 10:25:20
 * @LastEditTime : 2020-07-02 11:06:35
 * @FilePath     : \notes\notes\git.md
-->

# Git

## rebase

> 开发是经常会多次提交, 但是这些提交不需要体现在线上提交中

1. 打印 log
   git log

```bush
commit 3ca6ec340edc66df13423f36f52919dfa3......

commit 1b4056686d1b494a5c86757f9eaed844......

commit 53f244ac8730d33b353bee3b24210b07......

commit 3a4226b4a0b6fa68783b07f1cee7b688.......
```

2. 合并请求

   - git rebase i HEAD~3
     合并从 HEAD 版本往前的 3 个提交
   - git rebase -i 3a4226b
     合并到指定版本

3. 执行合并会弹出窗口，如下

```bush
pick 3ca6ec3   '注释**********'

pick 1b40566   '注释*********'

pick 53f244a   '注释**********'
```

此时需要将 pick 更改成 squash, 即

```bush
pick 3ca6ec3   '注释**********'

s 1b40566   '注释*********'

s 53f244a   '注释**********'
```

然后保存退出, 此时如果存在代码冲突需要在解决冲突之后，执行以下操作

```bush
git add .
git rebase --continue
```

放弃当前合并可以执行

```bush
git rebase --abort
```

如果没有冲突的话, 会出现如下(此时可以更改 commit message)

```bush
# This is a combination of 4 commits.
#The first commit’s message is:
注释......
# The 2nd commit’s message is:
注释......
# The 3rd commit’s message is:
注释......
```
