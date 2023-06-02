import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import localeData from 'dayjs/plugin/localeData'
import minMax from 'dayjs/plugin/minMax'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(minMax)
dayjs.extend(duration)
dayjs.extend(localeData)
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
