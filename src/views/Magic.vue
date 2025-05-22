<template>
    <div class="magic-page">
        <h1 class="tip" :class="{ 'success-text': state }">
            <span v-if="this.state" v-text="'恭喜你通关成功'" />
            <span v-else v-for="c, i in code" :class="{ 'success-text': i < index }">{{ c }}</span>
        </h1>
        <div class="circle" v-for="circle, i in circleList" :key="i" @click="handleClick(i)"
            :class="{ origin: i === 0 }" :style="{
                left: circle.x + 'px',
                top: circle.y + 'px',
                transition: interval + 'ms'
            }" />
    </div>
</template>

<script>
export default {
    name: 'Magic',
    data() {
        return {
            // 每次生成圆圈的个数
            n: 3,
            // code
            code: [],
            // code 索引
            index: -1,
            // code 长度
            len: 10,
            // 间隔时间（ms）
            interval: 500,
            // 是否可以点击
            clickable: true,
            // 圆圈列表
            circleList: [{
                x: 800,
                y: 400,
            }]
        }
    },
    computed: {
        state() {
            return this.index >= this.len
        }
    },
    created() {
        this.genCode()
    },
    methods: {
        genCode() {
            this.code = Array.from({ length: this.len }, () => Math.floor(Math.random() * this.n) + 1)
        },
        randomPoint() {
            const el = this.$el
            const { offsetWidth, offsetHeight } = el.querySelector('.circle')
            return {
                x: Math.random() * (el.offsetWidth - offsetWidth),
                y: Math.random() * (el.offsetHeight - offsetHeight),
            }
        },
        async handleClick(i) {
            if (this.clickable) {
                this.clickable = false
                if (i === 0 && this.circleList.length === 1) {
                    await this.success()
                } else if (i === this.index * this.n + this.code[this.index]) {
                    await this.success()
                } else {
                    await this.error()
                }
                this.clickable = true
            }
        },
        async success() {
            this.index++
            if (this.state) {
                // 通过全部
                await this.back()
            } else {
                for (let i = 0; i < this.n; i++) {
                    this.circleList.push(this.randomPoint())
                    if (i < this.n - 1) await new Promise(resolve => setTimeout(resolve, this.interval))
                }
            }
        },
        async error() {
            this.genCode()
            this.index = -1
            await this.back()
        },
        async back() {
            for (let i = 1; i < this.circleList.length; i++) {
                this.circleList[i].x = this.circleList[0].x
                this.circleList[i].y = this.circleList[0].y
            }
            await new Promise(resolve => setTimeout(() => {
                this.circleList.splice(1)
                resolve()
            }, this.interval))
        }
    }
}
</script>

<style lang="scss" scoped>
.magic-page {
    width: 100vw;
    height: 100vh;
    background: black;
    position: relative;
    user-select: none;

    .tip {
        letter-spacing: 5px;
        color: rgb(255, 215, 0);
        position: absolute;
        left: 50%;
        top: 20px;
        transform: translateX(-50%);
        cursor: pointer;

        &::before {
            content: '╰⊱⋋';
        }
        &::after {
            content: '⋌⊰╯';
        }
    }

    .success-text {
        color: rgb(0, 168, 0);
        text-shadow: 0 0 6px black;
    }

    .circle {
        width: 80px;
        height: 80px;
        background-image: url("@/assets/img/magic/circle.png");
        background-size: cover;
        position: absolute;
        cursor: pointer;
        animation: show 0.3s;

        &.origin {
            filter: hue-rotate(-50deg) saturate(5);
        }
    }

    @keyframes show {
        0% {
            opacity: 0;
        }
    }
}
</style>