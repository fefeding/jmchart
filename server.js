const express = require('express');
const rollup = require('rollup');
const rollupOptions = require('./rollup.config.js');

// 配置 rollup 监视选项
rollupOptions.watch = {
  include: 'src/**',
  exclude: 'node_modules/**',
  clearScreen: false
};

// 启动 rollup 监视
const watcher = rollup.watch(rollupOptions);

let serverInstance = null;
const port = process.env.PORT || 8801;
const ip = process.env.IP || '127.0.0.1';

// 处理 rollup 监视事件
watcher.on('event', event => {
  switch (event.code) {
    case 'START':
      console.log('构建开始...');
      break;
    case 'BUNDLE_START':
      console.log('开始构建文件束...');
      break;
    case 'BUNDLE_END':
      console.log('构建完成！');
      console.log(`文件: ${event.output[0]}`);
      console.log(`耗时: ${event.duration}ms`);
      // 确保服务器已经启动
      if (!serverInstance) {
        startServer();
      }
      break;
    case 'END':
      console.log('所有构建完成！');
      break;
    case 'ERROR':
      console.error('构建错误:', event.error);
      break;
    case 'FATAL':
      console.error('致命错误:', event.error);
      break;
    default:
      break;
  }
});

// 启动服务器
function startServer() {
  if (!serverInstance) {
    const app = express();
    app.use(express.static("."));
    app.get("*", (req, res) => {
      res.sendFile("example/index.html", { root: __dirname });
    });
    serverInstance = app.listen(port, ip, () => {
      console.log(`\n🔥 开发服务器启动成功！`);
      console.log(`🌐 访问地址: http://${ip}:${port}`);
      console.log(`🔄 热更新已启用，修改代码会自动重新构建`);
      console.log(`📁 项目根目录: ${process.cwd()}\n`);
    });
  }
}

// 启动服务器
startServer();

// 处理进程终止
process.on('SIGINT', () => {
  console.log('\n正在关闭服务器...');
  watcher.close();
  if (serverInstance) {
    serverInstance.close(() => {
      console.log('服务器已关闭');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
