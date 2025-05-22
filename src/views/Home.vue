<template>
    <div class="home-page">
        <h1>Mini Game</h1>
        <div class="list">
            <router-link to="/puzzle">Puzzle</router-link>
            <router-link to="/magic">Magic</router-link>
            <router-link to="/horse">Horse</router-link>
            <router-link to="/turntable">Turntable</router-link>
            <router-link to="/hanoi">Hanoi</router-link>
            <router-link to="/findmatch">Findmatch</router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Home'
}
</script>

<style lang="scss" scoped>
.home-page {
    height: 100vh;
    background: #f4f4f4;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;

    .list {
        display: flex;
        flex-direction: column;
        gap: 20px;

        a {
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            width: 200px;
            transition: transform 0.2s;
            display: block;
            padding: 15px 20px;
            color: #333;
            text-decoration: none;
            font-weight: bold;
            text-align: center;

            &:hover {
                background-color: #f9f9f9;
                color: #007BFF;
                transform: scale(1.05);
            }
        }
    }
}
</style>