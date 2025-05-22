<template>
    <div class="turntable-page">
        <div class="turntable">
            <div class="cirque" v-for="item, i in data" @click="handleClick(i)" :style="{
                width: `${100 / n * (n - i)}%`,
                backgroundImage: `url(${img})`,
                backgroundSize: `${100 * n / (n - i)}%`,
                transform: `rotateZ(${item * 360 / n}deg)`,
            }" />
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
            <a-float-button type="default" tooltip="重置" @click="reset">
                <template #icon>
                    <SyncOutlined />
                </template>
            </a-float-button>
        </a-float-button-group>
    </div>
</template>

<script>
import { multiply, matrix, inv } from 'mathjs'
import { FileImageOutlined, QuestionCircleOutlined, SyncOutlined } from '@ant-design/icons-vue'
import defaultImage from "@/assets/img/turntable/belle.jpg"

export default {
    name: 'Turntable',
    components: { FileImageOutlined, QuestionCircleOutlined, SyncOutlined },
    data() {
        return {
            n: 5,
            img: defaultImage,
            data: [2, 1, 0, 1, 2],
            rules: [[2, 0, 0, 1, 0], [0, -1, 0, 0, 3], [1, 0, 1, 0, -1], [0, 0, -1, 1, 0], [2, 3, 0, 0, -2]]
        }
    },
    computed: {
        state() {
            return this.data.every(item => item % this.n === 0)
        }
    },
    methods: {
        handleClick(index) {
            if (!this.state) {
                let rule = this.rules[index]
                this.data = this.data.map((item, i) => item + rule[i])
            }
            if (this.state) {
                this.$message.success("You win!")
            }
        },
        upload(file) {
            if (file.type === 'image/jpeg' || file.type === 'image/png') {
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = () => this.img = reader.result
            } else {
                this.$message.error("图片格式错误")
            }
        },
        async help() {
            this.$message.loading({ content: 'Loading...', key: 'updatable' })
            let key = multiply(matrix(this.data.map(i => - i % this.n)), inv(this.rules))._data
            let res = key.map(num => (Math.round(num) % this.n + this.n) % this.n)
            await new Promise(resolve => setTimeout(resolve, 800))
            this.$message.success({ content: res.join(', '), key: 'updatable', duration: 5 })
        },
        reset() {
            let key = Array.from({ length: this.n }, () => Math.floor(Math.random() * this.n))
            this.data = multiply(matrix(key), matrix(this.rules))._data.map(num => num % this.n)
        }
    }
}
</script>

<style lang="scss" scoped>
.turntable-page {
    width: 100vw;
    height: 100vh;
    background: linear-gradient(200deg, #a8edea, #fed6e3);
    display: flex;
    justify-content: center;
    align-items: center;

    .turntable {
        width: 360px;
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        box-shadow: 0 0 13px black;
        display: grid;
        place-items: center;
        user-select: none;

        .cirque {
            aspect-ratio: 1 / 1;
            border: 3px solid black;
            border-radius: 50%;
            background-position: center;
            grid-column: 1 / 1;
            grid-row: 1 / 1;
            transition: 0.6s;
        }
    }
}
</style>