

npm, yarn 构建
出现 react 多实例依赖错误
参考: https://zhuanlan.zhihu.com/p/363288266

主要是安装 uim-react 时，其 node_modules 中 多安装了一份 react

pnpm 没有错误，因为合并了版本