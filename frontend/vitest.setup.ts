import { config } from '@vue/test-utils'
import i18n from '@/i18n/index.ts'
import vuetify from '@/plugins/vuetify.ts'

config.global.plugins = [i18n, vuetify]
