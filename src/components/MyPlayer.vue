<template>
  <div id="my-player" ref="player"></div>
</template>

<script>
import DPlayer from 'dplayer'

export default {
  name: 'MyPlayer',
  props: {
    url: String
  },
  data () {
    return {
      dp: null
    }
  },
  mounted () {
    this.dp = new DPlayer({
      container: document.getElementById('my-player'),
      autoplay: false, // 关闭自动播放
      theme: '#1e90ff',
      loop: false, // 关闭循环播放
      lang: 'zh-cn', // 播放器语言为中文
      screenshot: false, // 关闭截图功能
      hotkey: true, // 开启热键
      preload: 'auto', // 预加载为自动
      volume: 0.7, // 初始音量
      mutex: true,
      video: {
        url: this.url // 视频URL
      }
    })
  }
}
</script>

<style scoped>

</style>
