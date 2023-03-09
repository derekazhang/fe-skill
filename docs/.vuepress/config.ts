import { defineUserConfig, defaultTheme } from "vuepress";

export default defineUserConfig({
  title: "FE Skill",
  description: "前端必知必会、前端面试题",
  theme: defaultTheme({
    logo: "/assets/img/logo.png",
    navbar: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/" },
      { text: "External", link: "https://google.com" },
    ],
    sidebar: [
      {
        text: "CSS", // 必要的
        link: "/css/", // 可选的, 标题的跳转链接，应为绝对路径且必须存在
        children: ["/css/box"],
      },
    ],
    lastUpdated: true,
    lastUpdatedText: "最近更新",
    // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
    repo: "vuejs/vuepress",
    // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
    // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
    repoLabel: "查看源码",

    // 以下为可选的编辑链接选项

    // 假如你的文档仓库和项目本身不在一个仓库：
    docsRepo: "vuejs/vuepress",
    // 假如文档不是放在仓库的根目录下：
    docsDir: "docs",
    // 假如文档放在一个特定的分支下：
    docsBranch: "master",
    // 默认是 false, 设置为 true 来启用
    editLink: true,
    // 默认为 "Edit this page"
    editLinkText: "帮助我们改善此页面！",
  }),
});
