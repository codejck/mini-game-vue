<template>
    <div class="hanoi-page" :style="{ cursor: selected ? 'grabbing' : 'grab' }">
        <header>
            <h2>汉诺塔小游戏</h2>
            <span>Tower of Hanoi</span>
        </header>
        <div class="hanoi-container" :style="{ gap: `${width(level) + 20}px` }">
            <div class="tower" @click="handleClick(1)">
                <div class="disc" v-for="n in tower1" :class="{ selected: selected === 1 && tower1.at(-1) === n }"
                    :style="{
                        width: `${width(n)}px`,
                        height: `${discHeight}px`,
                    }" />
            </div>
            <div class="tower" @click="handleClick(2)">
                <div class="disc" v-for="n in tower2" :class="{ selected: selected === 2 && tower2.at(-1) === n }"
                    :style="{
                        width: `${width(n)}px`,
                        height: `${discHeight}px`,
                    }" />
            </div>
            <div class="tower" @click="handleClick(3)">
                <div class="disc" v-for="n in tower3" :class="{ selected: selected === 3 && tower3.at(-1) === n }"
                    :style="{
                        width: `${width(n)}px`,
                        height: `${discHeight}px`,
                    }" />
            </div>
        </div>
        <a-float-button-group>
            <a-float-button type="default" @click="rule">
                <template #icon>
                    <InfoCircleOutlined />
                </template>
            </a-float-button>
            <!-- 帮助按钮 -->
            <a-float-button type="default" tooltip="提示" @click="help">
                <template #icon>
                    <QuestionCircleOutlined />
                </template>
            </a-float-button>
            <!-- 重置按钮 -->
            <a-float-button type="default" tooltip="重置" @click="init">
                <template #icon>
                    <SyncOutlined />
                </template>
            </a-float-button>
        </a-float-button-group>
    </div>
</template>

<script>
import { InfoCircleOutlined, QuestionCircleOutlined, SyncOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
export default {
    name: 'Hanoi',
    components: { InfoCircleOutlined, QuestionCircleOutlined, SyncOutlined },
    data() {
        return {
            // 汉诺塔层数
            level: 7,
            tower1: [],
            tower2: [],
            tower3: [],
            // 当前选择的塔
            selected: null,
            // 盘的高度
            discHeight: 20,
            // 塔的梯度
            gradient: 1.5,
        }
    },
    computed: {
        state() {
            return this.tower3.length === this.level
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            this.helping = false
            this.selected = null
            this.tower1 = []
            this.tower2 = []
            this.tower3 = []
            for (let i = this.level; i > 0; i--) {
                this.tower1.push(i)
            }
        },
        width(n) {
            return 2 * n * this.discHeight / this.gradient + 20
        },
        tower(n) {
            return this[`tower${n}`]
        },
        handleClick(n) {
            if (this.selected) {
                if (n !== this.selected) {
                    let tower = this.tower(n)
                    let selectedTower = this.tower(this.selected)
                    if (tower.length === 0 || tower.at(-1) > selectedTower.at(-1)) {
                        tower.push(selectedTower.pop())
                    } else {
                        this.$message.error("大盘子不能放在小盘子上面")
                    }
                    this.selected = null
                }
            } else {
                this.selected = n
            }
        },
        async help() {
            this.helping = true
            for (const order of this.getMoveOrders()) {
                if (!this.helping) return 
                this.handleClick(order.from)
                this.handleClick(order.to)
                await new Promise(res => setTimeout(res, 500))
            }
        },
        getMoveOrders() {
            let orders = new Array()
            let tower1 = this.tower1.slice()
            tower1.n = 1
            let tower2 = this.tower2.slice()
            tower2.n = 2
            let tower3 = this.tower3.slice()
            tower3.n = 3
            moveDisks(tower1.length, tower1, tower2, tower3)
            function moveDisks(n, tower1, tower2, tower3) {
                if (n === 1) {
                    tower3.push(tower1.pop())
                    orders.push({ from: tower1.n, to: tower3.n })
                } else {
                    moveDisks(n - 1, tower1, tower3, tower2)
                    moveDisks(1, tower1, tower2, tower3)
                    moveDisks(n - 1, tower2, tower1, tower3)
                }
            }
            return orders
        },
        rule() {
            Modal.info({
                title: "规则",
                content: '你要将所有的盘子从 tower1 移动到 tower3。你每次只能移动一个盘子。游戏最重要的规则是大的盘子不能放在小的盘子上面！'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.hanoi-page {
    width: 100vw;
    height: 100vh;
    background: gainsboro;
    display: flex;
    justify-content: center;
    align-items: center;

    header {
        text-align: center;
        font-family: "Segoe UI";
        color: #404d5b;
        cursor: default;
        position: absolute;
        left: 50%;
        top: 15%;
        transform: translate(-50%, -50%);
    }

    .hanoi-container {
        display: flex;

        .tower {
            width: 20px;
            min-height: 200px;
            padding-bottom: 3px;
            border-radius: 3px;
            background: #333;
            display: flex;
            flex-direction: column-reverse;
            align-items: center;

            .disc {
                border: 3px solid #333;
                border-radius: 3px;
                box-sizing: border-box;
                box-shadow: inset 0 0 3px 3px rgba(128, 128, 128, 0.3);
                background: #d1b389;
                transition: 0.6s;

                &.selected {
                    background: red;
                }
            }
        }
    }
}
</style>