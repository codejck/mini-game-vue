<template>
    <div class="puzzle-page">
        <div class="container">
            <div class="puzzle-container">
                <template v-for="cell in data">
                    <div class="cell"
                        v-if="cell.n !== null"
                        @click="handleClick(cell)"
                        :style="{
                            width: `${100 / m}%`,
                            height: `${100 / n}%`,
                            background: `url(${img})`,
                            backgroundSize: `${100 * m}% ${100 * n}%`,
                            backgroundPosition: `-${cell.n % m * 100}% -${Math.floor(cell.n / m) * 100}%`,
                            left: `${cell.y * 100 / m}%`,
                            top: `${cell.x * 100 / n}%`,
                        }" />
                </template>
            </div>
        </div>
        <a-float-button-group>
            <!-- 上传图片按钮 -->
            <a-upload class="ant-float-btn ant-float-btn-circle" :show-upload-list="false" :custom-request="() => { }"
                :before-upload="upload">
                <a-float-button type="default" tooltip="上传图片">
                    <template #icon>
                        <FileImageOutlined />
                    </template>
                </a-float-button>
            </a-upload>
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
import SlidingPuzzle from '@/utils/slidingPuzzle'
import defaultImage from '@/assets/img/puzzle/panda.jpg'
import { FileImageOutlined, QuestionCircleOutlined, SyncOutlined } from '@ant-design/icons-vue'
import { chunk } from 'lodash'
export default {
    name: 'Puzzle',
    components: { FileImageOutlined, QuestionCircleOutlined, SyncOutlined },
    data() {
        return {
            // 拼图的行数
            n: 5,
            // 拼图的列数
            m: 5,
            // 初始空格的x坐标
            x: 4,
            // 初始空格的y坐标
            y: 4,
            // 缺失拼图的x坐标
            _x: 4,
            // 缺失拼图的y坐标
            _y: 4,
            // 当前空格的坐标
            empty: null,
            img: defaultImage,
            // 拼图数据
            data: []
        }
    },
    computed: {
        state() {
            return this.data.every((cell, i) => cell.n === i || cell.n === null)
        },
        // 初始逆序数
        baseInversionNumber() {
            return Math.floor(this.n / 2) * this.m * (this.m - 1) / 2 - (this._x % 2) * (this.m + 1)
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            let data = Array.from({ length: this.n * this.m }, (_, i) => i === this._x * this.m + this._y ? null : i)
            // 使用 Fisher-Yates 洗牌算法
            for (let i = data.length - 1; i > 0; i--) {
                // 随机选择一个0到i之间的索引
                let j = Math.floor(Math.random() * (i + 1));
                [data[i], data[j]] = [data[j], data[i]]
            }
            // 把空格移动到缺失的位置
            let n = data.indexOf(null)
            let _n = this.x * this.m + this.y;
            [data[n], data[_n]] = [data[_n], data[n]]
            // 确保逆序数为偶数，否则随机交换两个元素
            while ((this.baseInversionNumber + this.countInv(chunk(data, this.m))) % 2) {
                let i = Math.floor(Math.random() * data.length)
                let j = Math.floor(Math.random() * data.length)
                if (data[i] && data[j]) {
                    [data[i], data[j]] = [data[j], data[i]]
                }
            }
            this.empty = { x: this.x, y: this.y }
            this.data = data.map((cell, i) => {
                return {
                    x: Math.floor(i / this.m),
                    y: i % this.m,
                    n: cell
                }
            })
        },
        handleClick(cell) {
            if (Math.hypot(cell.x - this.empty.x, cell.y - this.empty.y) === 1) {
                [cell.x, cell.y, this.empty.x, this.empty.y] = [this.empty.x, this.empty.y, cell.x, cell.y]
            }
        },
        upload(file) {
            if (file.type === 'image/jpeg' || file.type === 'image/png') {
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = () => {
                    this.img = reader.result
                }
            } else {
                this.$message.error("图片格式错误")
            }
        },
        countInv(grid) {
            let count = 0
            let snakeData = grid.map((item, i) => i % 2 ? item.toReversed() : item).flat()
            for (let i = 0; i < snakeData.length; i++) {
                for (let j = i + 1; j < snakeData.length; j++) {
                    if (snakeData[i] > snakeData[j] && snakeData[i] !== null && snakeData[j] !== null) count++
                }
            }
            return count
        },
        async help() {
            let data = []
            this.data.forEach(cell => data[cell.x * this.m + cell.y] = cell.n)
            let puzzle = new SlidingPuzzle(chunk(data, this.m))
            for (let path of puzzle.getPath()) {
                let cell = this.data.find(cell => cell.x === this.empty.x + path[0] && cell.y === this.empty.y + path[1])
                this.handleClick(cell)
                await new Promise(resolve => setTimeout(resolve, 10))
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.puzzle-page {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .puzzle-container {
            width: 300px;
            height: 300px;
            border: 10px solid grey;
            background: rgb(30, 30, 30);
            box-shadow: 8px 8px 8px rgb(128, 128, 128, 0.6);
            position: relative;

            .cell {
                box-sizing: border-box;
                position: absolute;
                transition: 100ms;
                user-select: none;
                cursor: pointer;
            }
        }
    }
}
</style>