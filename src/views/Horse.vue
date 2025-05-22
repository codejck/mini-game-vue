<template>
    <div class="horse-page">
        <div class="container" :style="{ gridTemplate: `repeat(${n},1fr)/repeat(${m},1fr)` }">
            <img class="horse" src="@/assets/img/horse/horse.png" :style="{
                width: `${100 / m}%`,
                height: `${100 / n}%`,
                left: `${x * 100 / m}%`,
                top: `${y * 100 / n}%`,
                filter: `hue-rotate(${hue - 123}deg)`
            }">
            <template v-for="cells, i in data">
                <div class="cell" v-for="cell, j in cells" :key="cell" @click="handleClick(i, j)"
                    :style="{ background: background(cell, i, j) }" />
            </template>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Horse',
    data() {
        return {
            n: 5,
            m: 5,
            x: 2,
            y: 2,
            hue: 120,
        }
    },
    computed: {
        data() {
            return Array.from({ length: this.n }, () => {
                return Array.from({ length: this.m }, () => false)
            })
        }
    },
    methods: {
        handleClick(i, j) {
            if ((this.x - j) ** 2 + (this.y - i) ** 2 === 5) {
                this.data[i][j] ^= true
                this.x = j
                this.y = i
            }
        },
        background(cell, i, j) {
            return [['black', 'white'], [`hsl(${this.hue},53%,35%)`, `hsl(${this.hue},53%,55%)`]][Number(cell)][(i + j) % 2]
        }
    }
}
</script>

<style lang="scss" scoped>
.horse-page {
    width: 100vw;
    height: 100vh;
    background: ghostwhite;
    display: flex;
    justify-content: center;
    align-items: center;

    .container {
        width: 240px;
        height: 300px;
        border: 10px solid gainsboro;
        display: grid;
        justify-items: center;
        align-items: center;
        position: relative;
        user-select: none;
        cursor: pointer;

        .horse {
            position: absolute;
            transition: 0.5s;
        }

        .cell {
            width: 100%;
            height: 100%;
            transition: 600ms;
        }
    }
}
</style>