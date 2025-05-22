import preventReclick from './modules/preventReclick'
import onClickRotate from './modules/onClickRotate'

export default {
    install(app) {
        app.directive('preventReclick', preventReclick)
        app.directive('onClickRotate', onClickRotate)
    }
}
