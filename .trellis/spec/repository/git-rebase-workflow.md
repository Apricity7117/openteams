# 本地补丁分支与 Rebase 规范

## 约定

**目的**：让 `main` 始终表示官方仓库的最新基线，本地定制只保存在 `local-patches`，从而可以在官方更新后通过 rebase 重新应用本地补丁。

**分支职责**：

- `main`：跟踪 `origin/main`，不直接提交本地定制。
- `local-patches`：承载所有本地补丁提交，不设置为官方 `main` 的推送目标。
- `origin`：固定指向 `https://github.com/openteams-lab/openteams.git`。

## 开发本地补丁

```bash
git switch local-patches
git status --short --branch

# 修改并验证后，创建范围清晰的小提交
git add <files>
git commit -m "<type>: <description>"
```

不要把 `.trellis/`、本地环境文件或其他运行时文件混入产品补丁提交，除非该文件本身就是有意维护的项目规范。

## 同步官方更新

执行 rebase 前，工作区必须干净：

```bash
git switch local-patches
git status --short
git fetch origin
git rebase origin/main
```

rebase 成功后，本地提交应位于最新官方提交之上：

```bash
git log --oneline --decorate --graph origin/main..local-patches
```

如需同步本地 `main` 指针：

```bash
git switch main
git merge --ff-only origin/main
git switch local-patches
```

更新 `main` 不是 rebase 的前置条件；`local-patches` 应直接 rebase 到 `origin/main`，避免依赖可能过期的本地 `main`。

## 冲突处理

发生冲突时，只解决当前 rebase 标记的文件：

```bash
git status
# 编辑并验证冲突文件
git add <resolved-files>
git rebase --continue
```

如果无法确认正确结果，放弃本次同步并恢复 rebase 前状态：

```bash
git rebase --abort
```

不得使用 `git reset --hard`、`git checkout -- <file>` 等破坏性命令处理未知或未确认归属的改动。

## 正确与错误示例

错误：把官方更新合并进补丁分支，长期积累无意义的合并提交。

```bash
git switch local-patches
git merge origin/main
```

正确：把本地补丁提交重放到最新官方基线之上。

```bash
git switch local-patches
git fetch origin
git rebase origin/main
```

## 验证要求

每次 rebase 后至少确认：

```bash
git status --short --branch
git log --oneline origin/main..local-patches
```

- 工作区没有意外改动或未解决冲突。
- 输出中只包含预期的本地补丁提交。
- 根据补丁范围运行对应的类型检查、测试或构建命令。

