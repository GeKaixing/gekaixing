### HTML自定义播放器/控键
| **videoApi** | **功能** | 
| :-----:| :----: | 
| play() | 播放 | 
| pause() | 暂停 | 
| volume| 音量 | 
| duration| 时长 | 
| currentTime| 当前时长 | 
| playbackRate| 快进 | 
| ----| ---- | 
| **documentApi**| **功能** | 
| requestFullscreen| 放大 | 
| requestPictureInPicture| 画中画 | 
### 播放与暂停
```javascript
 videoplay.onclick = () => {
        // console.log('播放');
        video.play()
        //一秒执行一次
        timer = setInterval(run, 1000)
    }
    videopause.onclick = () => {
        // console.log('暂停');
        video.pause()
        clearInterval(timer)
    }
```
### 音量加与减
```javascript
 volume.textContent = video.volume
    volume_plus.onclick = () => {
        //console.log('音量加');
        if (video.volume >= 1) {
            //console.log('最大音量')
            return;
        } else {
            video.volume += 0.1;
            video.volume = video.volume.toFixed(2)
            volume.textContent = video.volume
        }
    }
    volume_down.onclick = () => {
            //console.log('音量减');
        if (video.volume <= 0) {
            //console.log('最小音量')
            return;
        } else {
            video.volume -= 0.1;
            video.volume = video.volume.toFixed(2)
            volume.textContent = video.volume
        }
    }
```
### 进度条
```javascript
    // 进度条渲染
    //进度条宽度*（当前时间/视频总时长）=当前进度条长度
    const run = () => {
        const ll = (video.currentTime / video.duration).toFixed(2)
        const ff = Math.floor(progress_bar.clientWidth * ll)
        currentTime.style.width = ff + 'px';
    }
    //点击进度条
    //视频总时长*（ 获取总进度条鼠标的水平位置/总进度条的宽度）
    progress_bar.onclick = (e) => {
        const gg = (e.clientX / progress_bar.clientWidth).toFixed(2)
        //当前时间
        const cc = video.duration * gg
        video.currentTime = cc;
        run()
    }
```
### 进度条拖动
```javascript
//获取水平位置
 var isDragging = false;
        var offsetX;
        currentTime.onmousedown = function (e) {
            isDragging = true;
            progress_bar.onmousemove = function (e) {
                offsetX = e.clientX
            }
            document.onmousemove = function (e) {
                if (isDragging) {
                    if (e.offsetX > progress_bar.clientWidth) {
                        currentTime.style.width = `${progress_bar.clientWidth}px`
                    } else if (e.offsetX == 0) {
                        currentTime.style.width = 0 + 'px';
                    } else {
                        currentTime.style.width = offsetX + 'px';
                    }

                }
            }
            document.onmouseup = () => {
                isDragging = false;
                progress_bar.onmousemove = null;
                document.onmousemove = null;
                document.onmousedown = null;
            }
            e.preventDefault();
        }
```
### 音量加减
```javascript
        defaultPlaybackRate.textContent = video.defaultPlaybackRate;
        defaultPlaybackRate_plus.onclick = () => {
            video.playbackRate += 0.5;
            video.playbackRate = video.playbackRate.toFixed(1);
            console.log(video.playbackRate);
            defaultPlaybackRate.textContent = video.playbackRate;
        }
        defaultPlaybackRate_down.onclick = () => {
            try {
                if (video.playbackRate > 0) {
                    video.playbackRate -= 0.5;
                    video.playbackRate = video.playbackRate.toFixed(1);
                    defaultPlaybackRate.textContent = video.playbackRate;
                }
            } catch {
                video.playbackRate = 0.5
                video.playbackRate = video.playbackRate.toFixed(1);
                defaultPlaybackRate.textContent = video.playbackRate;
            }
        }
```
### 全屏
```javascript
requestFullscreen.onclick = () => {
            if (document.fullscreenElement) {
                document.exitFullscreen();

            } else {
                devdefined.requestFullscreen();
            }
        }
```
### 画中画
```javascript
requestPictureInPicture.onclick = () => {
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
            } else {
                video.requestPictureInPicture();
            }
        }
```
# 重要
**如何在video全屏时显示div，使用:fullscreen伪元素，只有在全屏时生效**
```css
 .devdefined:fullscreen video {
        /*全屏*/
        width: 100vw;
        height: 100vh;
    }

    .devdefined:fullscreen .test{
        /* 脱离文档流 */
        position: fixed;
        bottom: 10px;
        /* 可选？ */
        background-color: aqua;
        width: 500px;
        height: 500px;
        }
```
### 全部代码
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML自定义播放器</title>
</head>
<style>
    video {
        width: 500px;
        height: 500px;
    }

    .progress_bar {
        border-radius: 20px;
        background-color: #f7f7f7;
        width: 500px;
        height: 14px;
    }

    .currentTime {
        border-radius: 20px;
        background-color: #707070;
        width: 1px;
        height: 100%;
    }

    #progressBar {
        width: 300px;
        height: 20px;
        background-color: #eee;
        margin-top: 50px;
    }

    .devdefined:fullscreen video {
        width: 100vw;
        height: 100vh;
    }

    .devdefined:fullscreen .test{
        position: fixed;
        bottom: 10px;
        background-color: aqua;
        width: 500px;
        height: 500px;
        }
</style>

<body>
    <div class="devdefined">
        <video id="video">
            <source src="./test.mp4">
        </video>
        <div class="test">
            <div class="videotiem">
            </div>
            <button class="videoplay">
                播放
            </button>
            <button class="videopause">
                暂停
            </button>
            <button class="volume_plus">+</button>
            <span class="volume">1</span>
            <button class="volume_down">-</button>
            <div class="progress_bar">
                <div class="currentTime">
                </div>
            </div>
            <div class="defaultPlaybackRate_plus">速度+
            </div>
            <span class="defaultPlaybackRate"></span>
            <div class="defaultPlaybackRate_down">速度-</div>
            <div class="requestFullscreen">全屏</div>
            <div class="requestPictureInPicture">画中画</div>
        </div>
    </div>
</body>
<script>
     window.onload = function () {
    const video = document.querySelector('#video')
    const videotiem = document.querySelector('.videotiem')
    const videoplay = document.querySelector('.videoplay')
    const videopause = document.querySelector('.videopause')
    const volume = document.querySelector('.volume')
    const volume_plus = document.querySelector('.volume_plus')
    const volume_down = document.querySelector('.volume_down')
    const progress_bar = document.querySelector('.progress_bar')
    const currentTime = document.querySelector('.currentTime')
    const defaultPlaybackRate = document.querySelector('.defaultPlaybackRate')
    const defaultPlaybackRate_plus = document.querySelector('.defaultPlaybackRate_plus')
    const defaultPlaybackRate_down = document.querySelector('.defaultPlaybackRate_down')
    const requestFullscreen = document.querySelector('.requestFullscreen')
    const requestPictureInPicture = document.querySelector('.requestPictureInPicture')
    const devdefined = document.querySelector('.devdefined')

    currentTime.style.maxWidth = progress_bar.clientWidth;
    video.addEventListener('loadedmetadata', function () {
        const videoDuration = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration % 60)
        videotiem.textContent = `视频长度： ${videoDuration}分${seconds}秒`

    });
    videoplay.onclick = () => {
        console.log('播放');
        video.play()
        //一秒执行一次
        timer = setInterval(run, 1000)
    }
    videopause.onclick = () => {
        console.log('暂停');
        video.pause()
        clearInterval(timer)
    }
    volume.textContent = video.volume
    volume_plus.onclick = () => {
        console.log('音量加');
        if (video.volume >= 1) {
            console.log('最大音量')
            return;
        } else {
            video.volume += 0.1;
            video.volume = video.volume.toFixed(2)
            volume.textContent = video.volume
        }
    }
    volume_down.onclick = () => {
        console.log('音量减');
        if (video.volume <= 0) {
            console.log('最小音量')
            return;
        } else {
            video.volume -= 0.1;
            video.volume = video.volume.toFixed(2)
            volume.textContent = video.volume
        }
    }
    const run = () => {
        const ll = (video.currentTime / video.duration).toFixed(2)
        const ff = Math.floor(progress_bar.clientWidth * ll)
        currentTime.style.width = ff + 'px';
    }
    progress_bar.onclick = (e) => {
        const gg = (e.clientX / progress_bar.clientWidth).toFixed(2)
        //当前时间
        const cc = video.duration * gg
        video.currentTime = cc;
        run()
    }
   
        var isDragging = false;
        var offsetX;
        currentTime.onmousedown = function (e) {
            isDragging = true;
            progress_bar.onmousemove = function (e) {
                offsetX = e.clientX
            }
            document.onmousemove = function (e) {
                if (isDragging) {
                    if (e.offsetX > progress_bar.clientWidth) {
                        currentTime.style.width = `${progress_bar.clientWidth}px`
                    } else if (e.offsetX == 0) {
                        currentTime.style.width = 0 + 'px';
                    } else {
                        currentTime.style.width = offsetX + 'px';
                    }

                }
            }
            document.onmouseup = () => {
                isDragging = false;
                progress_bar.onmousemove = null;
                document.onmousemove = null;
                document.onmousedown = null;
            }
            e.preventDefault();
        }

        defaultPlaybackRate.textContent = video.defaultPlaybackRate;
        defaultPlaybackRate_plus.onclick = () => {
            video.playbackRate += 0.5;
            video.playbackRate = video.playbackRate.toFixed(1);
            console.log(video.playbackRate);
            defaultPlaybackRate.textContent = video.playbackRate;
        }
        defaultPlaybackRate_down.onclick = () => {
            try {
                if (video.playbackRate > 0) {
                    video.playbackRate -= 0.5;
                    video.playbackRate = video.playbackRate.toFixed(1);
                    defaultPlaybackRate.textContent = video.playbackRate;
                }
            } catch {
                video.playbackRate = 0.5
                video.playbackRate = video.playbackRate.toFixed(1);
                defaultPlaybackRate.textContent = video.playbackRate;
            }
        }
        requestFullscreen.onclick = () => {
            if (document.fullscreenElement) {
                document.exitFullscreen();

            } else {
                devdefined.requestFullscreen();
            }
        }
        requestPictureInPicture.onclick = () => {
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
            } else {
                video.requestPictureInPicture();
            }
        }
    }
</script>

</html>
```