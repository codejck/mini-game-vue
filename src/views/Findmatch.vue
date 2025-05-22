<template>
    <div class="findmatch-page">
        <div class="container">
            <div class="countdown-container">
                <span class="countdown">倒计时：{{ countdown }}</span>
                <a-button :disabled="Boolean(timer)" @click="start">{{ state ? '重新开始' : '开始' }}</a-button>
            </div>
            <div class="card-container" :style="{ gridTemplate: `repeat(${n},1fr)/repeat(${m},1fr)` }">
                <img class="card" v-for="card in cardList" :src="getImageUrl(card.visible ? card.src : 'back')"
                    draggable="false" @click="handleClick(card)" :style="{
                        transition: `${interval}ms ease-in-out`,
                        transform: `rotateY(${card.fliping * 90}deg)`,
                        opacity: card.disabled ? 0.1 : 1,
                    }">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Findmatch',
    data() {
        return {
            n: 6,
            m: 5,
            // 卡牌种类
            kind: 23,
            // 游戏时间
            time: 60,
            // 定时器
            timer: null,
            // 倒计时
            countdown: 0,
            // 翻转动画时间
            interval: 200,
            _card: null,
            // 卡牌列表
            cardList: [],
            // 是否可以点击
            clickable: false
        }
    },
    computed: {
        state() {
            return this.cardList?.every?.(card => card.disabled)
        }
    },
    created() {
        this.countdown = this.time
        this.cardList = this.getCardList()
    },
    methods: {
        async start() {
            if (!this.timer) {
                this.countdown = this.time
                this.cardList = this.getCardList()
                await Promise.all(this.cardList.map(card => this.flip(card, true)))
                await new Promise(resolve => setTimeout(resolve, 3000))
                await Promise.all(this.cardList.map(card => this.flip(card, false)))
                this.clickable = true
                this.timer = setInterval(() => {
                    this.countdown--
                    if (this.countdown === 0) {
                        clearInterval(this.timer)
                        this.timer = null
                        this.clickable = false
                        this.$message.error('很遗憾，挑战失败！')
                    }
                }, 1000)
            }
        },
        async handleClick(card) {
            if (this.clickable && !card.disabled && !card.visible) {
                this.clickable = false
                await this.flip(card)
                this.clickable = Boolean(this.timer)
                await new Promise(res => setTimeout(res, this.interval))
                setTimeout(() => {
                    if (this._card === null) {
                        this._card = card
                    } else {
                        // 判断是否匹配
                        if (this._card.src === card.src) {
                            this._card.disabled = card.disabled = true
                        } else {
                            this.flip(this._card)
                            this.flip(card)
                        }
                        this._card = null
                    }
                }, this.interval)
            }
        },
        async flip(card, visible) {
            card.fliping = true
            await new Promise(resolve => setTimeout(() => {
                card.visible = visible ?? !card.visible
                card.fliping = false
                resolve()
            }, this.interval))
        },
        getImageUrl(card) {
            return new URL(`../assets/img/findmatch/${card}.png`, import.meta.url).href
        },
        getCardList() {
            return Array.from({ length: this.n * this.m }, (_, i) => {
                return {
                    src: Math.floor(i / 2) % this.kind + 1,
                    disabled: false,
                    visible: false,
                    fliping: false,
                }
            }).sort(() => Math.random() - 0.5)
        }
    },
    watch: {
        state(val) {
            if (val) {
                clearInterval(this.timer)
                this.timer = null
                this.$message.success('恭喜你，挑战成功！')
                this.clickable = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.findmatch-page {
    width: 100vw;
    height: 100vh;
    background: ghostwhite;
    display: flex;
    justify-content: center;
    align-items: center;

    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 20px;

        .countdown-container {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .countdown {
                font-family: 'Digital-7', monospace;
                font-size: 18px;
                color: rgb(100, 20, 20);

                @font-face {
                    font-family: 'Digital-7';
                    src: url('@/assets/font/digital-7.ttf') format('truetype');
                }
            }
        }

        .card-container {
            padding: 10px;
            border-radius: 6px;
            border: 6px solid rgb(100, 20, 20);
            box-shadow: 0 0 12px black;
            background: rgb(180, 80, 80);
            display: grid;
            gap: 5px;
            justify-items: center;
            align-items: center;

            .card {
                width: 60px;
                height: 75px;
            }
        }
    }
}
</style>