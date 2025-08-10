### git工作流程
* 1.git clone // 克隆到本地
当要修改代码的时候,第一件事即使就是建立一个新的feature branch/功能分支
* 2.git checkout -b xxx 切换至新分支xxx
（相当于复制了remote/运程的仓库到本地的xxx分支上，可用git branch查看当前分支
//补充 从主分支切换到子分支上编写代码,从而不影响主分支代码
* 3.修改或者添加本地代码（部署在硬盘的源文件上）
* 4.git diff 查看自己对代码做出的改变
* 5.git add 上传更新后的代码至暂存区
* 6.git commit 可以将暂存区里更新后的代码更新到本地git
* 7.git log 查看提交日志
* 8.git push origin xxx 将本地的xxxgit分支上传至github上的git
//远程仓库会产生新分支
    <hr>
（如果在写自己的代码过程中发现远端GitHub上代码出现改变）
* 1.git checkout main 切换回main分支
* 2.git pull origin master(main) 将远端修改过的代码再更新到本地的main
* 3.git checkout xxx 回到xxx分支
* 4.git rebase main 我在xxx分支上，先把main移过来，然后根据我的commit来修改成新的内容
（中途可能会出现，rebase conflict -----》手动选择保留哪段代码）
* 5.git push -f origin xxx 把rebase后并且更新过的代码再push到远端github上
（-f ---》强行）
* 6.原项目主人采用pull request 中的 squash and merge 合并所有不同的commit
    <hr>Q
远端完成更新后  <p>
* 1.git branch -d xxx 删除本地的git分支
* 2.git pull origin master 再把远端的最新代码拉至本地
    <hr>
新增退回上次修改<p>
* 1.git reset *** --hard
    <hr>
git switch 2.23<p>
* 1.git switch branch-name 切换分支
* 2.git switch -c branch-new-name 创建新分支并切换
* 3.git switch -- 撤销所分区所用更改
* 4.git switch commit-‘’ 切换到特地的提交
* 5.git switch - 查看可用的分支列表


