### js懒加载和懒执行
#### 懒加载
```js
    const topss = () => {
        const img = document.querySelectorAll('img[data-src]')
        for (let imgs of img) {
            // 该方法获取元素距离浏览器视口的高度，当高度小于浏览器的视口的高度的时，则表明该属性出现在浏览器视口中，设置img的src已显示图片，达到懒加载的目的
            if (imgs.getBoundingClientRect().top < window.innerHeight) {
                imgs.src = imgs.dataset.src
            }

        }
    }
    window.onscroll=topss
```
#### 懒执行
延迟执行