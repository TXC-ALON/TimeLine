import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Dynasty, convertYear } from 'cn-era'
import { TIMELINE_MAX_YEAR, TIMELINE_MIN_YEAR, dynastyGroups } from './data/timelineData'

const LABEL_WIDTH = 280
const AXIS_HEIGHT = 72
const DYNASTY_ROW_HEIGHT = 52
const RULER_ROW_HEIGHT_COMPACT = 44
const RULER_ROW_HEIGHT_ERA_DETAIL = 64
const MIN_SCALE = 0.4
const MAX_SCALE = 20
const DEFAULT_SCALE = 0.85
const WHEEL_ZOOM_FACTOR = 1.12
const PROBE_CARD_WIDTH = 320
const PROBE_CARD_GAP = 14
const PROBE_CARD_MARGIN = 12
const PROBE_INITIAL_FALLBACK_OFFSET = 1
const SUB_TIMELINE_QUERY_KEY = 'sub'
const TIMELINE_HISTORY_VIEW_KEY = 'timelineView'
const TIMELINE_HISTORY_MAIN = 'main'
const TIMELINE_HISTORY_SUB = 'sub'
const RULER_CONTEXT_MENU_WIDTH = 210
const RULER_CONTEXT_MENU_HEIGHT = 42
const RULER_CONTEXT_MENU_PADDING = 8
const SPRING_AUTUMN_END = -476
const WARRING_STATES_START = -475

const THREE_KINGDOM_IDS = new Set(['cao-wei', 'shu-han', 'sun-wu'])

const FIVE_DYNASTIES_TEN_KINGDOM_IDS = new Set([
  'later-liang',
  'later-tang',
  'later-jin',
  'later-han',
  'later-zhou',
  'ten-wu',
  'ten-min',
  'ten-chu',
  'ten-jingnan',
  'ten-southern-tang',
  'ten-wuyue',
  'ten-former-shu',
  'ten-later-shu',
  'ten-southern-han',
  'ten-northern-han'
])
const TANG_MERGE_IDS = new Set(['tang', 'wu-zhou'])

const DEFAULT_HIDDEN_DYNASTY_IDS = new Set([
  'xia',
  'shang',
  'western-zhou',
  'period-spring-autumn',
  'period-warring-states'
])

const PERIOD_BANDS = [
  { id: 'band-xia', label: '夏', startYear: -2070, endYear: -1600, color: '#8f6c49' },
  { id: 'band-shang', label: '商', startYear: -1600, endYear: -1046, color: '#7c5a3f' },
  { id: 'band-zhou', label: '周', startYear: -1046, endYear: -771, color: '#6f5b43' },
  { id: 'band-spring-autumn', label: '春秋', startYear: -770, endYear: -476, color: '#7d6846' },
  { id: 'band-warring', label: '战国', startYear: -475, endYear: -221, color: '#8b7348' },
  { id: 'band-qin', label: '秦', startYear: -221, endYear: -207, color: '#8f4a36' },
  { id: 'band-han', label: '汉', startYear: -202, endYear: 220, color: '#9a4d34' },
  { id: 'band-three', label: '三国', startYear: 220, endYear: 280, color: '#7d4a6a' },
  { id: 'band-wjnb', label: '魏晋南北朝', startYear: 280, endYear: 589, color: '#4b6682' },
  { id: 'band-sui', label: '隋', startYear: 581, endYear: 618, color: '#6b5f7b' },
  { id: 'band-tang', label: '唐', startYear: 618, endYear: 907, color: '#8f3f31' },
  { id: 'band-five-ten', label: '五代十国', startYear: 907, endYear: 979, color: '#6e4f7c' },
  { id: 'band-song', label: '宋', startYear: 960, endYear: 1279, color: '#4c6f5c' },
  { id: 'band-yuan', label: '元', startYear: 1271, endYear: 1368, color: '#4f6388' },
  { id: 'band-ming', label: '明', startYear: 1368, endYear: 1644, color: '#915339' },
  { id: 'band-qing', label: '清', startYear: 1636, endYear: 1912, color: '#487062' }
]

const categoryPalette = {
  上古三代: '#78543a',
  春秋战国: '#84603d',
  秦汉三国: '#8f3f2f',
  魏晋南北朝: '#3f5d7a',
  隋唐五代十国: '#5f4a7f',
  宋辽夏金元: '#3f6a5a',
  明清: '#8f5b2f'
}

const DEFAULT_DISPLAY_SETTINGS = {
  showAxisEdgeYears: true,
  showDynastyTrackEdgeYears: true,
  showRulerTrackEdgeYears: true,
  showRulerListLifeYears: true,
  showLifeTimeline: true,
  showReignTimeline: true,
  showReignYears: true,
  showEraTimelineDetail: false,
  showTicks: true,
  showPeriodBands: true,
  showTooltips: true
}

const DISPLAY_SETTING_GROUPS = [
  {
    title: '时间轴图层',
    items: [
      { key: 'showLifeTimeline', label: '显示生卒时间轴' },
      { key: 'showReignTimeline', label: '显示在位时间轴' },
      { key: 'showEraTimelineDetail', label: '显示年号时间轴' }
    ]
  },
  {
    title: '标记与文本',
    items: [
      { key: 'showAxisEdgeYears', label: '显示主轴首尾年份' },
      { key: 'showDynastyTrackEdgeYears', label: '显示朝代行首尾年份' },
      { key: 'showRulerTrackEdgeYears', label: '显示君主行首尾年份' },
      { key: 'showRulerListLifeYears', label: '左侧显示君主生卒' },
      { key: 'showReignYears', label: '显示在位年数标记' },
      { key: 'showTicks', label: '显示刻度线与年份' }
    ]
  },
  {
    title: '背景与交互',
    items: [
      { key: 'showPeriodBands', label: '显示分期背景色带' },
      { key: 'showTooltips', label: '显示悬浮详情提示' }
    ]
  }
]

const ERA_DYNASTY_BY_GROUP_ID = {
  'western-han': Dynasty.XI_HAN,
  xin: Dynasty.XIN,
  'eastern-han': Dynasty.DONG_HAN,
  'cao-wei': Dynasty.SAN_GUO_WEI,
  'shu-han': Dynasty.SAN_GUO_SHU,
  'sun-wu': Dynasty.SAN_GUO_WU,
  'western-jin': Dynasty.XI_JIN,
  'eastern-jin': Dynasty.DONG_JIN,
  'liu-song': Dynasty.LIU_SONG,
  'southern-qi': Dynasty.NAN_QI,
  liang: Dynasty.NAN_LIANG,
  chen: Dynasty.CHEN,
  'northern-wei': Dynasty.BEI_WEI,
  'eastern-wei': Dynasty.DONG_WEI,
  'western-wei': Dynasty.XI_WEI,
  'northern-qi': Dynasty.BEI_QI,
  'northern-zhou': Dynasty.BEI_ZHOU,
  sui: Dynasty.SUI,
  tang: Dynasty.TANG,
  'wu-zhou': Dynasty.WU_ZHOU,
  'later-liang': Dynasty.HOU_LIANG,
  'later-tang': Dynasty.HOU_TANG,
  'later-jin': Dynasty.HOU_JIN,
  'later-han': Dynasty.HOU_HAN,
  'later-zhou': Dynasty.HOU_ZHOU,
  liao: Dynasty.LIAO,
  'western-xia': Dynasty.XI_XIA,
  'jin-dynasty': Dynasty.JIN_DYNASTY,
  'northern-song': Dynasty.SONG,
  'southern-song': Dynasty.SONG,
  yuan: Dynasty.YUAN,
  ming: Dynasty.MING,
  qing: Dynasty.QING
}

const ERA_DYNASTY_BY_NAME = {
  西汉: Dynasty.XI_HAN,
  西漢: Dynasty.XI_HAN,
  新: Dynasty.XIN,
  东汉: Dynasty.DONG_HAN,
  東漢: Dynasty.DONG_HAN,
  曹魏: Dynasty.SAN_GUO_WEI,
  蜀汉: Dynasty.SAN_GUO_SHU,
  蜀漢: Dynasty.SAN_GUO_SHU,
  孙吴: Dynasty.SAN_GUO_WU,
  孫吳: Dynasty.SAN_GUO_WU,
  西晋: Dynasty.XI_JIN,
  西晉: Dynasty.XI_JIN,
  东晋: Dynasty.DONG_JIN,
  東晉: Dynasty.DONG_JIN,
  刘宋: Dynasty.LIU_SONG,
  劉宋: Dynasty.LIU_SONG,
  南齐: Dynasty.NAN_QI,
  南齊: Dynasty.NAN_QI,
  梁: Dynasty.NAN_LIANG,
  陈: Dynasty.CHEN,
  陳: Dynasty.CHEN,
  北魏: Dynasty.BEI_WEI,
  东魏: Dynasty.DONG_WEI,
  東魏: Dynasty.DONG_WEI,
  西魏: Dynasty.XI_WEI,
  北齐: Dynasty.BEI_QI,
  北齊: Dynasty.BEI_QI,
  北周: Dynasty.BEI_ZHOU,
  隋: Dynasty.SUI,
  唐: Dynasty.TANG,
  武周: Dynasty.WU_ZHOU,
  后梁: Dynasty.HOU_LIANG,
  後梁: Dynasty.HOU_LIANG,
  后唐: Dynasty.HOU_TANG,
  後唐: Dynasty.HOU_TANG,
  后晋: Dynasty.HOU_JIN,
  後晉: Dynasty.HOU_JIN,
  后汉: Dynasty.HOU_HAN,
  後漢: Dynasty.HOU_HAN,
  后周: Dynasty.HOU_ZHOU,
  後周: Dynasty.HOU_ZHOU,
  宋: Dynasty.SONG,
  北宋: Dynasty.SONG,
  南宋: Dynasty.SONG,
  辽: Dynasty.LIAO,
  遼: Dynasty.LIAO,
  西夏: Dynasty.XI_XIA,
  金: Dynasty.JIN_DYNASTY,
  元: Dynasty.YUAN,
  明: Dynasty.MING,
  清: Dynasty.QING
}

const ERA_YEAR_CACHE = new Map()
const ERA_RANGE_CACHE = new Map()
const MANUAL_ERA_PERIODS_BY_RULER_ID = {
  'sw-jingdi': [{ name: '永安', start: 258, end: 264 }],
  'sw-modi': [
    { name: '元兴', start: 264, end: 264 },
    { name: '甘露', start: 265, end: 266 },
    { name: '宝鼎', start: 266, end: 269 },
    { name: '建衡', start: 269, end: 271 },
    { name: '凤凰', start: 272, end: 274 },
    { name: '天册', start: 275, end: 276 },
    { name: '天玺', start: 276, end: 277 },
    { name: '天纪', start: 277, end: 280 }
  ],
  'ww-feidi': [{ name: '大统', start: 552, end: 554 }],
  'ww-gongdi': [{ name: '廓定', start: 554, end: 557 }],
  'nz-xiaomin': [{ name: '无年号', start: 557, end: 557 }],
  'jin-aizong': [
    { name: '正大', start: 1224, end: 1232 },
    { name: '开兴', start: 1232, end: 1232 },
    { name: '天兴', start: 1232, end: 1234 }
  ],
  'jin-modi': [{ name: '盛昌', start: 1234, end: 1234 }]
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function overlap(startA, endA, startB, endB) {
  return endA >= startB && startA <= endB
}

function formatYear(year) {
  if (typeof year !== 'number') {
    return '未知'
  }
  return year < 0 ? `公元前${Math.abs(year)}年` : `公元${year}年`
}

function formatAxisYear(year) {
  if (typeof year !== 'number') {
    return '未知'
  }
  return year < 0 ? `前${Math.abs(year)}` : `${year}`
}

function formatCompactLifeYears(birthYear, deathYear, fallbackStart, fallbackEnd) {
  const start = typeof birthYear === 'number' ? birthYear : fallbackStart
  const end = typeof deathYear === 'number' ? deathYear : fallbackEnd
  return `${formatAxisYear(start)} - ${formatAxisYear(end)}`
}

function formatPeriod(start, end) {
  return `${formatYear(start)} - ${formatYear(end)}`
}

function calcSpanYears(start, end, inclusive = false) {
  if (typeof start !== 'number' || typeof end !== 'number') {
    return null
  }
  const years = Math.max(0, end - start + (inclusive ? 1 : 0))
  return years
}

function toAstronomicalYear(year) {
  if (year <= 0) {
    return year + 1
  }
  return year
}

function calcSpanYearsNoYearZero(start, end, inclusive = false) {
  if (typeof start !== 'number' || typeof end !== 'number') {
    return null
  }
  const startAstro = toAstronomicalYear(start)
  const endAstro = toAstronomicalYear(end)
  const years = endAstro - startAstro + (inclusive ? 1 : 0)
  return Math.max(0, years)
}

function includesYear(year, start, end) {
  if (typeof year !== 'number' || typeof start !== 'number' || typeof end !== 'number') {
    return false
  }
  return year >= Math.min(start, end) && year <= Math.max(start, end)
}

function getReignPeriods(ruler) {
  if (Array.isArray(ruler.reignPeriods) && ruler.reignPeriods.length > 0) {
    return ruler.reignPeriods
      .filter((item) => typeof item?.start === 'number' && typeof item?.end === 'number')
      .map((item) => ({
        start: Math.min(item.start, item.end),
        end: Math.max(item.start, item.end),
        eraName: item.eraName
      }))
      .sort((a, b) => a.start - b.start)
  }

  if (typeof ruler.reignStart === 'number' && typeof ruler.reignEnd === 'number') {
    return [
      {
        start: Math.min(ruler.reignStart, ruler.reignEnd),
        end: Math.max(ruler.reignStart, ruler.reignEnd),
        eraName: ruler.eraName
      }
    ]
  }

  return []
}

function normalizeNameKey(value) {
  if (typeof value !== 'string') {
    return ''
  }
  return value.replace(/（.*?）/g, '').trim()
}

function getEraDynastyEnum(ruler, dynasty) {
  const fromId = dynasty?.id ? ERA_DYNASTY_BY_GROUP_ID[dynasty.id] : undefined
  if (typeof fromId === 'number') {
    return fromId
  }
  const candidates = [ruler?.sourcePolity, dynasty?.name]
  for (const candidate of candidates) {
    const key = normalizeNameKey(candidate)
    const mapped = ERA_DYNASTY_BY_NAME[key]
    if (typeof mapped === 'number') {
      return mapped
    }
  }
  return null
}

function getEraTitlesByYear(year, dynastyEnum) {
  if (year === 0) {
    return []
  }
  const cacheKey = `${dynastyEnum}:${year}`
  if (ERA_YEAR_CACHE.has(cacheKey)) {
    return ERA_YEAR_CACHE.get(cacheKey)
  }
  let titles = []
  try {
    const items = convertYear(year, { mode: 'all', dynasty: dynastyEnum })
    const dedup = new Set(items.map((item) => item.reign_title).filter(Boolean))
    titles = [...dedup]
  } catch {
    titles = []
  }
  ERA_YEAR_CACHE.set(cacheKey, titles)
  return titles
}

function buildAutoEraPeriods(reignPeriods, dynastyEnum) {
  if (reignPeriods.length === 0 || typeof dynastyEnum !== 'number') {
    return []
  }
  const cacheKey = `${dynastyEnum}:${reignPeriods.map((item) => `${item.start}-${item.end}`).join('|')}`
  if (ERA_RANGE_CACHE.has(cacheKey)) {
    return ERA_RANGE_CACHE.get(cacheKey)
  }

  const segments = []

  reignPeriods.forEach((period) => {
    const start = Math.min(period.start, period.end)
    const end = Math.max(period.start, period.end)
    if (start > end) {
      return
    }

    for (let year = start; year <= end; year += 1) {
      if (year === 0) {
        continue
      }
      let titles = getEraTitlesByYear(year, dynastyEnum)
      if (titles.length === 0) {
        continue
      }

      if (titles.length > 1 && start < end) {
        if (year === start) {
          const nextYear = year + 1 === 0 ? year + 2 : year + 1
          if (nextYear <= end) {
            const nextTitles = new Set(getEraTitlesByYear(nextYear, dynastyEnum))
            const continued = titles.filter((title) => nextTitles.has(title))
            if (continued.length > 0) {
              titles = continued
            }
          }
        } else if (year === end) {
          const prevYear = year - 1 === 0 ? year - 2 : year - 1
          if (prevYear >= start) {
            const prevTitles = new Set(getEraTitlesByYear(prevYear, dynastyEnum))
            const continued = titles.filter((title) => prevTitles.has(title))
            if (continued.length > 0) {
              titles = continued
            }
          }
        }
      }

      titles.forEach((title) => {
        const last = segments[segments.length - 1]
        if (last && last.name === title && last.end === year - 1) {
          last.end = year
          return
        }
        segments.push({
          name: title,
          start: year,
          end: year
        })
      })
    }
  })

  segments.sort((a, b) => a.start - b.start || a.end - b.end || a.name.localeCompare(b.name))
  ERA_RANGE_CACHE.set(cacheKey, segments)
  return segments
}

function getEraPeriods(ruler, reignPeriods, dynasty) {
  const manual = MANUAL_ERA_PERIODS_BY_RULER_ID[ruler.id]
  if (Array.isArray(manual) && manual.length > 0) {
    return manual
      .filter((item) => typeof item?.start === 'number' && typeof item?.end === 'number' && item?.name)
      .map((item) => ({
        name: item.name,
        start: Math.min(item.start, item.end),
        end: Math.max(item.start, item.end)
      }))
      .sort((a, b) => a.start - b.start)
  }

  if (Array.isArray(ruler.eraPeriods) && ruler.eraPeriods.length > 0) {
    return ruler.eraPeriods
      .filter((item) => typeof item?.start === 'number' && typeof item?.end === 'number' && (item?.name || item?.eraName))
      .map((item) => ({
        name: item.name ?? item.eraName,
        start: Math.min(item.start, item.end),
        end: Math.max(item.start, item.end)
      }))
      .sort((a, b) => a.start - b.start)
  }

  const withEraName = reignPeriods
    .filter((item) => item.eraName)
    .map((item) => ({
      name: item.eraName,
      start: item.start,
      end: item.end
    }))

  const shouldExpandByAuto =
    withEraName.length === 0 || withEraName.some((item) => /[、，,]|等/.test(item.name))

  if (!shouldExpandByAuto && withEraName.length > 0) {
    return withEraName
  }

  const dynastyEnum = getEraDynastyEnum(ruler, dynasty)
  if (shouldExpandByAuto) {
    const autoPeriods = buildAutoEraPeriods(reignPeriods, dynastyEnum)
    if (autoPeriods.length > 0) {
      return autoPeriods
    }
  }

  if (withEraName.length > 0) {
    return withEraName
  }

  if (reignPeriods.length === 0) {
    return []
  }

  const latestEnd = reignPeriods[reignPeriods.length - 1].end
  const placeholder = latestEnd < -140 ? '无年号' : '未录入年号'

  return reignPeriods.map((item) => ({
    name: placeholder,
    start: item.start,
    end: item.end
  }))
}

function getReignTotalYears(reignPeriods) {
  return reignPeriods.reduce((total, period) => total + (calcSpanYears(period.start, period.end, true) ?? 0), 0)
}

function getEraSearchText(ruler, dynasty) {
  const reignPeriods = getReignPeriods(ruler, dynasty)
  const eraPeriods = getEraPeriods(ruler, reignPeriods, dynasty)
  if (eraPeriods.length === 0) {
    return ruler.eraName ?? ''
  }
  return eraPeriods.map((item) => item.name).join(' ')
}

function formatLifeText(ruler) {
  const lifeYears = calcSpanYears(ruler.birthYear, ruler.deathYear, false)
  if (lifeYears === null) {
    return `生卒：${formatPeriod(ruler.birthYear, ruler.deathYear)}`
  }
  return `生卒：${formatPeriod(ruler.birthYear, ruler.deathYear)}（寿命约${lifeYears}年）`
}

function formatReignText(ruler, dynasty) {
  const reignPeriods = getReignPeriods(ruler, dynasty)
  if (reignPeriods.length === 0) {
    return `在位：${formatPeriod(ruler.reignStart, ruler.reignEnd)}`
  }
  const reignText = reignPeriods.map((item) => formatPeriod(item.start, item.end)).join('、')
  const reignYears = getReignTotalYears(reignPeriods)
  return `在位：${reignText}（约${reignYears}年）`
}

function formatEraText(ruler, dynasty) {
  const reignPeriods = getReignPeriods(ruler, dynasty)
  const eraPeriods = getEraPeriods(ruler, reignPeriods, dynasty)
  if (eraPeriods.length === 0) {
    return ruler.eraName ? `年号：${ruler.eraName}` : '年号：未知'
  }
  return `年号：${eraPeriods.map((item) => `${item.name}（${formatPeriod(item.start, item.end)}）`).join('、')}`
}

function buildWikiUrl(subject) {
  return `https://zh.wikipedia.org/w/index.php?search=${encodeURIComponent(subject)}`
}

function annotateRuler(ruler, polityName) {
  return {
    ...ruler,
    sourcePolity: polityName,
    title: ruler.title ? `${ruler.title}（${polityName}）` : polityName
  }
}

function getRulerPoint(ruler, fallback) {
  return ruler.reignStart ?? ruler.reignEnd ?? ruler.birthYear ?? ruler.deathYear ?? fallback
}

function mergePeriodGroups(inputGroups) {
  const normalGroups = []
  const springWarringGroups = []
  const threeKingdomGroups = []
  const weiJinGroups = []
  const fiveDynGroups = []
  const tangGroups = []

  inputGroups.forEach((group) => {
    if (group.category === '春秋战国') {
      springWarringGroups.push(group)
      return
    }
    if (group.category === '魏晋南北朝') {
      weiJinGroups.push(group)
      return
    }
    if (THREE_KINGDOM_IDS.has(group.id)) {
      threeKingdomGroups.push(group)
      return
    }
    if (FIVE_DYNASTIES_TEN_KINGDOM_IDS.has(group.id)) {
      fiveDynGroups.push(group)
      return
    }
    if (TANG_MERGE_IDS.has(group.id)) {
      tangGroups.push(group)
      return
    }
    normalGroups.push(group)
  })

  const merged = [...normalGroups]

  if (springWarringGroups.length > 0) {
    const springRulers = []
    const warringRulers = []

    springWarringGroups.forEach((group) => {
      group.rulers.forEach((ruler) => {
        const point = getRulerPoint(ruler, group.startYear)
        if (point <= SPRING_AUTUMN_END) {
          springRulers.push(annotateRuler(ruler, group.name))
        } else {
          warringRulers.push(annotateRuler(ruler, group.name))
        }
      })
    })

    springRulers.sort((a, b) => getRulerPoint(a, TIMELINE_MIN_YEAR) - getRulerPoint(b, TIMELINE_MIN_YEAR))
    warringRulers.sort((a, b) => getRulerPoint(a, TIMELINE_MIN_YEAR) - getRulerPoint(b, TIMELINE_MIN_YEAR))

    merged.push({
      id: 'period-spring-autumn',
      name: '春秋',
      category: '春秋战国',
      startYear: -770,
      endYear: SPRING_AUTUMN_END,
      rulers: springRulers
    })
    merged.push({
      id: 'period-warring-states',
      name: '战国',
      category: '春秋战国',
      startYear: WARRING_STATES_START,
      endYear: -221,
      rulers: warringRulers
    })
  }

  if (weiJinGroups.length > 0) {
    const rulers = weiJinGroups
      .flatMap((group) => group.rulers.map((ruler) => annotateRuler(ruler, group.name)))
      .sort((a, b) => getRulerPoint(a, TIMELINE_MIN_YEAR) - getRulerPoint(b, TIMELINE_MIN_YEAR))

    merged.push({
      id: 'period-wei-jin-south-north',
      name: '魏晋南北朝',
      category: '魏晋南北朝',
      startYear: 265,
      endYear: 589,
      rulers
    })
  }

  if (threeKingdomGroups.length > 0) {
    const rulers = threeKingdomGroups
      .flatMap((group) => group.rulers.map((ruler) => annotateRuler(ruler, group.name)))
      .sort((a, b) => getRulerPoint(a, TIMELINE_MIN_YEAR) - getRulerPoint(b, TIMELINE_MIN_YEAR))

    merged.push({
      id: 'period-three-kingdoms',
      name: '三国',
      category: '秦汉三国',
      startYear: 220,
      endYear: 280,
      rulers
    })
  }

  if (fiveDynGroups.length > 0) {
    const rulers = fiveDynGroups
      .flatMap((group) => group.rulers.map((ruler) => annotateRuler(ruler, group.name)))
      .sort((a, b) => getRulerPoint(a, TIMELINE_MIN_YEAR) - getRulerPoint(b, TIMELINE_MIN_YEAR))

    merged.push({
      id: 'period-five-dynasties-ten-kingdoms',
      name: '五代十国',
      category: '隋唐五代十国',
      startYear: 907,
      endYear: 979,
      rulers
    })
  }

  if (tangGroups.length > 0) {
    const startYear = Math.min(...tangGroups.map((group) => group.startYear))
    const rulers = tangGroups
      .flatMap((group) =>
        group.rulers.map((ruler) => (group.id === 'wu-zhou' ? annotateRuler(ruler, group.name) : ruler))
      )
      .sort((a, b) => getRulerPoint(a, startYear) - getRulerPoint(b, startYear))

    merged.push({
      id: 'tang',
      name: '唐',
      category: '隋唐五代十国',
      startYear,
      endYear: Math.max(...tangGroups.map((group) => group.endYear)),
      rulers
    })
  }

  return merged
}

function includesKeyword(value, keyword) {
  if (typeof value !== 'string') {
    return false
  }
  return value.toLowerCase().includes(keyword)
}

function matchFields(fields, keyword) {
  return fields.some((field) => includesKeyword(field, keyword))
}

function getRulerRange(ruler, dynasty) {
  const reignPeriods = getReignPeriods(ruler, dynasty)
  const firstReign = reignPeriods[0]
  const lastReign = reignPeriods[reignPeriods.length - 1]
  let start = ruler.birthYear ?? firstReign?.start ?? dynasty.startYear
  let end = ruler.deathYear ?? lastReign?.end ?? dynasty.endYear
  if (start > end) {
    const temp = start
    start = end
    end = temp
  }
  return { start, end }
}

function getDynastyLifeBounds(dynasty) {
  const ranges = dynasty.rulers.map((ruler) => getRulerRange(ruler, dynasty))
  let minYear = Math.min(...ranges.map((range) => range.start))
  let maxYear = Math.max(...ranges.map((range) => range.end))

  if (!Number.isFinite(minYear) || !Number.isFinite(maxYear)) {
    minYear = dynasty.startYear
    maxYear = dynasty.endYear
  }

  const span = Math.max(1, maxYear - minYear)
  const padding = Math.max(8, Math.round(span * 0.08))
  const start = clamp(minYear - padding, TIMELINE_MIN_YEAR, TIMELINE_MAX_YEAR)
  const end = clamp(maxYear + padding, TIMELINE_MIN_YEAR, TIMELINE_MAX_YEAR)

  if (end <= start) {
    return {
      start: minYear,
      end: minYear + 1
    }
  }

  return { start, end }
}

function getMainTimelineBoundsByDynastyIds(dynasties, activeIds) {
  const activeDynasties = dynasties.filter((item) => activeIds.includes(item.id))
  if (activeDynasties.length === 0) {
    return {
      start: TIMELINE_MIN_YEAR,
      end: TIMELINE_MAX_YEAR
    }
  }
  return {
    start: Math.min(...activeDynasties.map((item) => item.startYear)),
    end: Math.max(...activeDynasties.map((item) => item.endYear))
  }
}

function getInitialProbeYearByDynasties(dynasties, minYear, maxYear) {
  const firstDynastyWithRuler = dynasties.find((item) => item.visibleRulers?.length > 0)
  if (!firstDynastyWithRuler) {
    return clamp(minYear + PROBE_INITIAL_FALLBACK_OFFSET, minYear, maxYear)
  }
  const firstRuler = firstDynastyWithRuler.visibleRulers[0]
  if (typeof firstRuler.birthYear === 'number') {
    return clamp(firstRuler.birthYear, minYear, maxYear)
  }
  const range = getRulerRange(firstRuler, firstDynastyWithRuler)
  return clamp(range.start + PROBE_INITIAL_FALLBACK_OFFSET, minYear, maxYear)
}

function getTickStep(spanYears) {
  const targetTicks = 10
  const rough = Math.max(1, spanYears / targetTicks)
  const steps = [1, 2, 5, 10, 20, 25, 50, 100, 200, 500, 1000]
  const found = steps.find((item) => item >= rough)
  return found ?? 1000
}

function getYearTicks(startYear, endYear) {
  const min = Math.min(startYear, endYear)
  const max = Math.max(startYear, endYear)
  const step = getTickStep(max - min)
  const ticks = []
  for (let year = min; year <= max; year += step) {
    ticks.push(year)
  }
  if (ticks[ticks.length - 1] !== max) {
    ticks.push(max)
  }
  return ticks
}

function App() {
  const timelineViewportRef = useRef(null)
  const dragStateRef = useRef({ active: false, startX: 0, startScrollLeft: 0 })
  const probeAxisDragRef = useRef({ active: false, pointerId: null })
  const pendingScrollLeftRef = useRef(null)
  const pendingProbeRelocationRef = useRef(null)
  const historyInitializedRef = useRef(false)

  const sortedDynasties = useMemo(() => {
    const merged = mergePeriodGroups(dynastyGroups)
    return [...merged].sort((a, b) => {
      if (a.startYear !== b.startYear) {
        return a.startYear - b.startYear
      }
      return a.endYear - b.endYear
    })
  }, [])

  const defaultDynastyFilterIds = useMemo(
    () => sortedDynasties.map((item) => item.id).filter((id) => !DEFAULT_HIDDEN_DYNASTY_IDS.has(id)),
    [sortedDynasties]
  )
  const totalRecordedRulerCount = useMemo(() => {
    const uniqueRulerIds = new Set()
    sortedDynasties.forEach((dynasty) => {
      dynasty.rulers.forEach((ruler) => {
        uniqueRulerIds.add(ruler.id)
      })
    })
    return uniqueRulerIds.size
  }, [sortedDynasties])

  const [isDragging, setIsDragging] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [zoom, setZoom] = useState(DEFAULT_SCALE)
  const [activeDynastyIds, setActiveDynastyIds] = useState(defaultDynastyFilterIds)
  const [yearWindow, setYearWindow] = useState(() => {
    const initialBounds = getMainTimelineBoundsByDynastyIds(sortedDynasties, defaultDynastyFilterIds)
    return [initialBounds.start, initialBounds.end]
  })
  const [expandedDynasties, setExpandedDynasties] = useState(new Set())
  const [selectedKey, setSelectedKey] = useState(`dynasty:${sortedDynasties[0]?.id ?? ''}`)
  const [tooltip, setTooltip] = useState(null)
  const [subTimelineId, setSubTimelineId] = useState(null)
  const [highlightedRulerKey, setHighlightedRulerKey] = useState(null)
  const [displaySettings, setDisplaySettings] = useState(DEFAULT_DISPLAY_SETTINGS)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isYearProbeActive, setIsYearProbeActive] = useState(false)
  const [probeYear, setProbeYear] = useState(TIMELINE_MIN_YEAR)
  const [probeCopyStatus, setProbeCopyStatus] = useState('')
  const [rulerContextMenu, setRulerContextMenu] = useState(null)

  const normalizedSearch = searchText.trim().toLowerCase()
  const [windowStart, windowEnd] = yearWindow
  const totalTimelineSpan = Math.max(1, TIMELINE_MAX_YEAR - TIMELINE_MIN_YEAR)

  const filteredDynasties = useMemo(() => {
    return sortedDynasties.reduce((result, dynasty) => {
      if (!activeDynastyIds.includes(dynasty.id)) {
        return result
      }
      if (!overlap(dynasty.startYear, dynasty.endYear, windowStart, windowEnd)) {
        return result
      }

      const rulersInWindow = dynasty.rulers.filter((ruler) => {
        const range = getRulerRange(ruler, dynasty)
        return overlap(range.start, range.end, windowStart, windowEnd)
      })

      const dynastyMatched =
        normalizedSearch.length === 0 ||
        matchFields([dynasty.name, dynasty.category], normalizedSearch)

      const matchedRulers =
        normalizedSearch.length === 0
          ? rulersInWindow
          : rulersInWindow.filter((ruler) =>
            matchFields([ruler.name, ruler.title, ruler.eraName, getEraSearchText(ruler, dynasty)], normalizedSearch)
          )

      if (normalizedSearch.length > 0 && !dynastyMatched && matchedRulers.length === 0) {
        return result
      }

      const visibleRulers = normalizedSearch.length > 0 && !dynastyMatched ? matchedRulers : rulersInWindow
      result.push({
        ...dynasty,
        visibleRulers
      })
      return result
    }, [])
  }, [activeDynastyIds, normalizedSearch, sortedDynasties, windowEnd, windowStart])

  const dynastyLookup = useMemo(() => {
    const map = new Map()
    sortedDynasties.forEach((item) => map.set(item.id, item))
    return map
  }, [sortedDynasties])

  const subTimelineDynasty = subTimelineId ? dynastyLookup.get(subTimelineId) ?? null : null
  const isSubTimeline = Boolean(subTimelineDynasty)
  const subTimelineBounds = useMemo(() => {
    if (!subTimelineDynasty) {
      return null
    }
    return getDynastyLifeBounds(subTimelineDynasty)
  }, [subTimelineDynasty])
  const mainTimelineBounds = useMemo(
    () => getMainTimelineBoundsByDynastyIds(sortedDynasties, activeDynastyIds),
    [activeDynastyIds, sortedDynasties]
  )
  const currentDisplayedRulerCount = useMemo(
    () => filteredDynasties.reduce((sum, dynasty) => sum + dynasty.visibleRulers.length, 0),
    [filteredDynasties]
  )

  const displayDynasties = useMemo(() => {
    if (!subTimelineDynasty) {
      return filteredDynasties
    }
    const allRulers = [...subTimelineDynasty.rulers].sort(
      (a, b) => getRulerPoint(a, subTimelineDynasty.startYear) - getRulerPoint(b, subTimelineDynasty.startYear)
    )
    return [
      {
        ...subTimelineDynasty,
        visibleRulers: allRulers
      }
    ]
  }, [filteredDynasties, subTimelineDynasty])

  const timelineRows = useMemo(() => {
    const rows = []
    let top = AXIS_HEIGHT
    const rulerRowHeight = displaySettings.showEraTimelineDetail ? RULER_ROW_HEIGHT_ERA_DETAIL : RULER_ROW_HEIGHT_COMPACT

    displayDynasties.forEach((dynasty) => {
      rows.push({
        key: `dynasty:${dynasty.id}`,
        type: 'dynasty',
        top,
        height: DYNASTY_ROW_HEIGHT,
        dynasty
      })
      top += DYNASTY_ROW_HEIGHT

      if (isSubTimeline || expandedDynasties.has(dynasty.id)) {
        dynasty.visibleRulers.forEach((ruler) => {
          rows.push({
            key: `ruler:${ruler.id}`,
            type: 'ruler',
            top,
            height: rulerRowHeight,
            dynasty,
            ruler
          })
          top += rulerRowHeight
        })
      }
    })

    return {
      rows,
      height: top + 24
    }
  }, [displayDynasties, displaySettings.showEraTimelineDetail, expandedDynasties, isSubTimeline])

  const rowMap = useMemo(() => {
    const map = new Map()
    timelineRows.rows.forEach((row) => map.set(row.key, row))
    return map
  }, [timelineRows.rows])

  const fallbackKey = timelineRows.rows[0]?.key ?? null
  const effectiveSelectedKey = selectedKey && rowMap.has(selectedKey) ? selectedKey : fallbackKey
  const selectedRow = effectiveSelectedKey ? rowMap.get(effectiveSelectedKey) : null

  const axisMinYear = isSubTimeline ? subTimelineBounds.start : mainTimelineBounds.start
  const axisMaxYear = isSubTimeline ? subTimelineBounds.end : mainTimelineBounds.end
  const totalYears = Math.max(1, axisMaxYear - axisMinYear)
  const timelineWidth = LABEL_WIDTH + totalYears * zoom + 64
  const yearTicks = useMemo(() => getYearTicks(axisMinYear, axisMaxYear), [axisMaxYear, axisMinYear])
  const periodBands = useMemo(() => {
    if (isSubTimeline || !displaySettings.showPeriodBands) {
      return []
    }
    return PERIOD_BANDS.filter((item) => overlap(item.startYear, item.endYear, axisMinYear, axisMaxYear))
  }, [axisMaxYear, axisMinYear, displaySettings.showPeriodBands, isSubTimeline])
  const axisEndX = LABEL_WIDTH + totalYears * zoom
  const windowStartPercent = ((windowStart - TIMELINE_MIN_YEAR) / totalTimelineSpan) * 100
  const windowEndPercent = ((windowEnd - TIMELINE_MIN_YEAR) / totalTimelineSpan) * 100

  const getXByYear = (year) => {
    const clampedYear = clamp(year, axisMinYear, axisMaxYear)
    return LABEL_WIDTH + (clampedYear - axisMinYear) * zoom
  }
  const probeInitialYear = useMemo(() => {
    return getInitialProbeYearByDynasties(displayDynasties, axisMinYear, axisMaxYear)
  }, [axisMaxYear, axisMinYear, displayDynasties])
  const clampedProbeYear = clamp(Math.round(probeYear), axisMinYear, axisMaxYear)

  const probeRecords = useMemo(() => {
    if (!isYearProbeActive) {
      return []
    }

    const records = []
    displayDynasties.forEach((dynasty) => {
      dynasty.visibleRulers.forEach((ruler) => {
        const range = getRulerRange(ruler, dynasty)
        const hasLifeBounds = typeof ruler.birthYear === 'number' && typeof ruler.deathYear === 'number'
        const isAlive = hasLifeBounds
          ? includesYear(clampedProbeYear, ruler.birthYear, ruler.deathYear)
          : includesYear(clampedProbeYear, range.start, range.end)

        if (!isAlive) {
          return
        }

        const reignPeriods = getReignPeriods(ruler, dynasty)
        const eraPeriods = getEraPeriods(ruler, reignPeriods, dynasty)
        const isReigning = reignPeriods.some((period) => includesYear(clampedProbeYear, period.start, period.end))
        const reignYearsSoFar = isReigning
          ? reignPeriods.reduce((total, period) => {
            if (clampedProbeYear < period.start) {
              return total
            }
            const endAtProbe = Math.min(period.end, clampedProbeYear)
            if (endAtProbe < period.start) {
              return total
            }
            return total + (calcSpanYearsNoYearZero(period.start, endAtProbe, true) ?? 0)
          }, 0)
          : null

        const activeEras = eraPeriods
          .filter((period) => includesYear(clampedProbeYear, period.start, period.end))
          .map((period) => `${period.name}（${formatAxisYear(period.start)}-${formatAxisYear(period.end)}）`)

        const age = typeof ruler.birthYear === 'number'
          ? calcSpanYearsNoYearZero(ruler.birthYear, clampedProbeYear, false)
          : null

        records.push({
          id: ruler.id,
          name: ruler.name,
          title: ruler.title,
          dynastyName: dynasty.name,
          polityName: ruler.sourcePolity ?? null,
          age,
          rangeStart: range.start,
          isReigning,
          reignYearsSoFar,
          activeEras
        })
      })
    })

    records.sort((a, b) => {
      if (a.isReigning !== b.isReigning) {
        return a.isReigning ? -1 : 1
      }
      if (a.rangeStart !== b.rangeStart) {
        return a.rangeStart - b.rangeStart
      }
      return a.name.localeCompare(b.name, 'zh-Hans-CN')
    })

    return records
  }, [clampedProbeYear, displayDynasties, isYearProbeActive])

  const probeReportText = useMemo(() => {
    if (!isYearProbeActive) {
      return ''
    }
    const scopeText = isSubTimeline ? `（子时间轴：${subTimelineDynasty.name}）` : ''
    const header = `时点：${formatYear(clampedProbeYear)}${scopeText}`
    const reigningCount = probeRecords.reduce((count, item) => (item.isReigning ? count + 1 : count), 0)
    const summary = `在该时点存活君主：${probeRecords.length}位；在位君主：${reigningCount}位`
    const rows = probeRecords.map((item, index) => {
      const ageText = typeof item.age === 'number' ? `${item.age}岁` : '年龄未知'
      const reignText = item.isReigning ? `在位第${item.reignYearsSoFar}年` : '未在位'
      const eraText = item.activeEras.length > 0 ? item.activeEras.join('、') : '无对应年号'
      const polityText = item.polityName ? ` / ${item.polityName}` : ''
      return `${index + 1}. ${item.name}（${item.title}）- ${item.dynastyName}${polityText} | ${ageText} | ${reignText} | 年号：${eraText}`
    })
    return [header, summary, ...rows].join('\n')
  }, [clampedProbeYear, isSubTimeline, isYearProbeActive, probeRecords, subTimelineDynasty])
  const probeReigningCount = useMemo(
    () => probeRecords.reduce((count, item) => (item.isReigning ? count + 1 : count), 0),
    [probeRecords]
  )

  const getTimelineUrl = useCallback((dynastyId = null) => {
    const url = new URL(window.location.href)
    if (dynastyId) {
      url.searchParams.set(SUB_TIMELINE_QUERY_KEY, dynastyId)
    } else {
      url.searchParams.delete(SUB_TIMELINE_QUERY_KEY)
    }
    return `${url.pathname}${url.search}${url.hash}`
  }, [])

  const syncTimelineHistory = useCallback((dynastyId = null, mode = 'push') => {
    const state = dynastyId
      ? { [TIMELINE_HISTORY_VIEW_KEY]: TIMELINE_HISTORY_SUB, dynastyId }
      : { [TIMELINE_HISTORY_VIEW_KEY]: TIMELINE_HISTORY_MAIN }
    const nextUrl = getTimelineUrl(dynastyId)
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`
    if (mode === 'replace') {
      window.history.replaceState(state, '', nextUrl)
      return
    }
    if (nextUrl !== currentUrl) {
      window.history.pushState(state, '', nextUrl)
    }
  }, [getTimelineUrl])

  const handleCopyProbeReport = async () => {
    if (!probeReportText) {
      return
    }
    try {
      await navigator.clipboard.writeText(probeReportText)
      setProbeCopyStatus('已复制')
    } catch {
      const temp = document.createElement('textarea')
      temp.value = probeReportText
      temp.style.position = 'fixed'
      temp.style.opacity = '0'
      document.body.appendChild(temp)
      temp.select()
      document.execCommand('copy')
      document.body.removeChild(temp)
      setProbeCopyStatus('已复制')
    }
    window.setTimeout(() => setProbeCopyStatus(''), 1400)
  }

  const zoomToRange = (rangeStart, rangeEnd) => {
    if (!timelineViewportRef.current) {
      return
    }
    const viewport = timelineViewportRef.current
    const start = clamp(Math.min(rangeStart, rangeEnd), axisMinYear, axisMaxYear)
    const end = clamp(Math.max(rangeStart, rangeEnd), axisMinYear, axisMaxYear)
    const spanYears = Math.max(1, end - start)
    const usableWidth = Math.max(220, viewport.clientWidth - LABEL_WIDTH - 48)
    const targetZoom = clamp(Number((usableWidth / spanYears).toFixed(4)), MIN_SCALE, MAX_SCALE)
    const centerYear = (start + end) / 2
    const nextScrollLeft =
      LABEL_WIDTH + (centerYear - axisMinYear) * targetZoom - viewport.clientWidth / 2

    if (Math.abs(targetZoom - zoom) < 0.0001) {
      viewport.scrollLeft = Math.max(0, nextScrollLeft)
      return
    }

    pendingScrollLeftRef.current = Math.max(0, nextScrollLeft)
    setZoom(targetZoom)
  }

  const enterSubTimeline = useCallback((dynasty, options = {}) => {
    const { syncHistory = true, historyMode = 'push' } = options
    setRulerContextMenu(null)
    const bounds = getDynastyLifeBounds(dynasty)
    const sortedRulers = [...dynasty.rulers].sort(
      (a, b) => getRulerPoint(a, dynasty.startYear) - getRulerPoint(b, dynasty.startYear)
    )
    const nextProbeYear = getInitialProbeYearByDynasties(
      [{ ...dynasty, visibleRulers: sortedRulers }],
      bounds.start,
      bounds.end
    )
    setSubTimelineId(dynasty.id)
    setSelectedKey(`dynasty:${dynasty.id}`)
    setExpandedDynasties((current) => {
      const next = new Set(current)
      next.add(dynasty.id)
      return next
    })
    if (isYearProbeActive) {
      pendingProbeRelocationRef.current = nextProbeYear
      setProbeYear(nextProbeYear)
    }

    if (timelineViewportRef.current) {
      const viewport = timelineViewportRef.current
      const usableWidth = Math.max(220, viewport.clientWidth - LABEL_WIDTH - 48)
      const spanYears = Math.max(1, bounds.end - bounds.start)
      const fitZoom = clamp(Number((usableWidth / spanYears).toFixed(4)), MIN_SCALE, MAX_SCALE)
      if (Math.abs(fitZoom - zoom) < 0.0001) {
        viewport.scrollLeft = 0
        return
      }
      pendingScrollLeftRef.current = 0
      setZoom(fitZoom)
    }
    if (syncHistory) {
      syncTimelineHistory(dynasty.id, historyMode)
    }
  }, [isYearProbeActive, syncTimelineHistory, zoom])

  const exitSubTimeline = useCallback((options = {}) => {
    const { syncHistory = true, historyMode = 'push' } = options
    setRulerContextMenu(null)
    setSubTimelineId(null)
    if (timelineViewportRef.current && Math.abs(zoom - DEFAULT_SCALE) < 0.0001) {
      timelineViewportRef.current.scrollLeft = 0
      if (syncHistory) {
        syncTimelineHistory(null, historyMode)
      }
      return
    }
    pendingScrollLeftRef.current = 0
    setZoom(DEFAULT_SCALE)
    if (syncHistory) {
      syncTimelineHistory(null, historyMode)
    }
  }, [syncTimelineHistory, zoom])

  useEffect(() => {
    if (pendingScrollLeftRef.current === null || !timelineViewportRef.current) {
      return
    }
    timelineViewportRef.current.scrollLeft = pendingScrollLeftRef.current
    pendingScrollLeftRef.current = null
  }, [zoom])

  useEffect(() => {
    if (isSubTimeline || !timelineViewportRef.current) {
      return
    }
    timelineViewportRef.current.scrollLeft = 0
  }, [axisMinYear, isSubTimeline])

  useEffect(() => {
    if (!timelineViewportRef.current) {
      return undefined
    }
    const viewport = timelineViewportRef.current
    const syncSplitOffset = () => {
      viewport.style.setProperty('--split-offset', `${viewport.scrollLeft}px`)
    }

    syncSplitOffset()
    viewport.addEventListener('scroll', syncSplitOffset, { passive: true })
    return () => {
      viewport.removeEventListener('scroll', syncSplitOffset)
    }
  }, [])

  const openWiki = (subject) => {
    window.open(buildWikiUrl(subject), '_blank', 'noopener,noreferrer')
  }

  const showTooltip = (event, title, lines) => {
    if (!displaySettings.showTooltips) {
      return
    }
    setTooltip({
      title,
      lines,
      x: event.clientX + 14,
      y: event.clientY + 14
    })
  }

  const moveTooltip = (event) => {
    if (!displaySettings.showTooltips) {
      return
    }
    setTooltip((current) =>
      current
        ? {
          ...current,
          x: event.clientX + 14,
          y: event.clientY + 14
        }
        : null
    )
  }

  const hideTooltip = () => {
    setTooltip(null)
  }

  const openWikiContextMenu = (event, rowKey, subjectName) => {
    event.preventDefault()
    event.stopPropagation()
    setTooltip(null)
    setSelectedKey(rowKey)
    const x = clamp(
      event.clientX,
      RULER_CONTEXT_MENU_PADDING,
      window.innerWidth - RULER_CONTEXT_MENU_WIDTH - RULER_CONTEXT_MENU_PADDING
    )
    const y = clamp(
      event.clientY,
      RULER_CONTEXT_MENU_PADDING,
      window.innerHeight - RULER_CONTEXT_MENU_HEIGHT - RULER_CONTEXT_MENU_PADDING
    )
    setRulerContextMenu({ x, y, subjectName })
  }

  const handleWindowStartChange = (value) => {
    const nextStart = Number(value)
    setYearWindow(([, end]) => [Math.min(nextStart, end), end])
  }

  const handleWindowEndChange = (value) => {
    const nextEnd = Number(value)
    setYearWindow(([start]) => [start, Math.max(nextEnd, start)])
  }

  const ensureProbeCardRoom = useCallback((targetYear) => {
    if (!timelineViewportRef.current) {
      return
    }
    const viewport = timelineViewportRef.current
    const clampedYear = clamp(targetYear, axisMinYear, axisMaxYear)
    const axisX = LABEL_WIDTH + (clampedYear - axisMinYear) * zoom
    const cardLeft = axisX + PROBE_CARD_GAP
    const neededRight = cardLeft + PROBE_CARD_WIDTH + PROBE_CARD_MARGIN
    const maxScrollLeft = Math.max(0, timelineWidth - viewport.clientWidth)
    let nextScrollLeft = viewport.scrollLeft

    if (neededRight > viewport.scrollLeft + viewport.clientWidth) {
      nextScrollLeft = Math.min(maxScrollLeft, neededRight - viewport.clientWidth)
    }

    const minAxisPadding = 24
    if (axisX < nextScrollLeft + minAxisPadding) {
      nextScrollLeft = Math.max(0, axisX - minAxisPadding)
    }

    if (Math.abs(nextScrollLeft - viewport.scrollLeft) > 1) {
      viewport.scrollLeft = nextScrollLeft
    }
  }, [axisMaxYear, axisMinYear, timelineWidth, zoom])

  useEffect(() => {
    if (!isYearProbeActive || pendingProbeRelocationRef.current === null) {
      return
    }
    const targetYear = clamp(
      pendingProbeRelocationRef.current,
      axisMinYear,
      axisMaxYear
    )
    pendingProbeRelocationRef.current = null
    setProbeYear(targetYear)
    window.setTimeout(() => ensureProbeCardRoom(targetYear), 0)
  }, [axisMaxYear, axisMinYear, ensureProbeCardRoom, isYearProbeActive, zoom])

  const updateProbeYear = (nextYear, ensureCardRoom = false) => {
    if (!Number.isFinite(nextYear)) {
      return
    }
    const clampedYear = clamp(Math.round(nextYear), axisMinYear, axisMaxYear)
    setProbeYear(clampedYear)
    if (ensureCardRoom) {
      ensureProbeCardRoom(clampedYear)
    }
  }

  const shiftProbeYear = (step) => {
    updateProbeYear(clampedProbeYear + step, true)
  }

  const getProbeYearByClientX = (clientX) => {
    if (!timelineViewportRef.current) {
      return clampedProbeYear
    }
    const viewport = timelineViewportRef.current
    const rect = viewport.getBoundingClientRect()
    const xInContent = viewport.scrollLeft + (clientX - rect.left)
    const year = axisMinYear + (xInContent - LABEL_WIDTH) / zoom
    return clamp(Math.round(year), axisMinYear, axisMaxYear)
  }

  const beginProbeAxisDrag = (event) => {
    event.preventDefault()
    event.stopPropagation()
    probeAxisDragRef.current = {
      active: true,
      pointerId: event.pointerId
    }
    updateProbeYear(getProbeYearByClientX(event.clientX), true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const moveProbeAxisDrag = (event) => {
    const drag = probeAxisDragRef.current
    if (!drag.active || drag.pointerId !== event.pointerId) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    updateProbeYear(getProbeYearByClientX(event.clientX), true)
  }

  const endProbeAxisDrag = (event) => {
    const drag = probeAxisDragRef.current
    if (!drag.active || drag.pointerId !== event.pointerId) {
      return
    }
    probeAxisDragRef.current = { active: false, pointerId: null }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    event.stopPropagation()
  }

  const toggleDynastyFilter = (dynastyId) => {
    setActiveDynastyIds((current) => {
      if (current.includes(dynastyId)) {
        const next = current.filter((item) => item !== dynastyId)
        if (!next.length) {
          return current
        }
        const nextBounds = getMainTimelineBoundsByDynastyIds(sortedDynasties, next)
        setYearWindow((currentWindow) =>
          currentWindow[0] === nextBounds.start && currentWindow[1] === nextBounds.end
            ? currentWindow
            : [nextBounds.start, nextBounds.end]
        )
        return next
      }
      const next = [...current, dynastyId]
      const nextBounds = getMainTimelineBoundsByDynastyIds(sortedDynasties, next)
      setYearWindow((currentWindow) =>
        currentWindow[0] === nextBounds.start && currentWindow[1] === nextBounds.end
          ? currentWindow
          : [nextBounds.start, nextBounds.end]
      )
      return next
    })
  }

  const toggleDynastyExpand = (dynastyId) => {
    setExpandedDynasties((current) => {
      const next = new Set(current)
      if (next.has(dynastyId)) {
        next.delete(dynastyId)
      } else {
        next.add(dynastyId)
      }
      return next
    })
    setSelectedKey(`dynasty:${dynastyId}`)
  }

  const toggleDisplaySetting = (settingKey) => {
    if (settingKey === 'showTooltips' && displaySettings.showTooltips) {
      setTooltip(null)
    }
    setDisplaySettings((current) => ({
      ...current,
      [settingKey]: !current[settingKey]
    }))
  }

  const expandAllFiltered = () => {
    setExpandedDynasties(new Set(displayDynasties.map((item) => item.id)))
  }

  const collapseAll = () => {
    setExpandedDynasties(new Set())
  }

  const resetFilters = () => {
    setRulerContextMenu(null)
    setSearchText('')
    setActiveDynastyIds(defaultDynastyFilterIds)
    const nextBounds = getMainTimelineBoundsByDynastyIds(sortedDynasties, defaultDynastyFilterIds)
    setYearWindow([nextBounds.start, nextBounds.end])
    setSubTimelineId(null)
    syncTimelineHistory(null, 'replace')
    setZoom(DEFAULT_SCALE)
    setHighlightedRulerKey(null)
  }

  const fitViewToCurrentRange = () => {
    if (!timelineViewportRef.current) {
      return
    }
    const viewport = timelineViewportRef.current
    const spanYears = Math.max(1, axisMaxYear - axisMinYear)
    const usableWidth = Math.max(220, viewport.clientWidth - LABEL_WIDTH - 48)
    const fitZoom = clamp(Number((usableWidth / spanYears).toFixed(4)), MIN_SCALE, MAX_SCALE)

    if (Math.abs(fitZoom - zoom) < 0.0001) {
      viewport.scrollLeft = 0
      return
    }
    pendingScrollLeftRef.current = 0
    setZoom(fitZoom)
  }

  const handlePointerDown = (event) => {
    if (event.button !== 0) {
      return
    }
    if (event.target.closest('.timeline-row')) {
      return
    }
    if (!timelineViewportRef.current) {
      return
    }
    dragStateRef.current = {
      active: true,
      startX: event.clientX,
      startScrollLeft: timelineViewportRef.current.scrollLeft
    }
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!dragStateRef.current.active || !timelineViewportRef.current) {
      return
    }
    const deltaX = event.clientX - dragStateRef.current.startX
    timelineViewportRef.current.scrollLeft = dragStateRef.current.startScrollLeft - deltaX
  }

  const stopDragging = (event) => {
    if (!dragStateRef.current.active) {
      return
    }
    dragStateRef.current.active = false
    setIsDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  useEffect(() => {
    if (!timelineViewportRef.current) {
      return undefined
    }
    const viewport = timelineViewportRef.current
    const handleWheel = (event) => {
      const rect = viewport.getBoundingClientRect()
      const pointerX = event.clientX - rect.left

      // 左侧朝代区滚轮用于页面纵向滚动；右侧时间轴区滚轮用于缩放。
      if (pointerX <= LABEL_WIDTH) {
        event.preventDefault()
        event.stopPropagation()
        window.scrollBy({
          top: event.deltaY,
          left: 0,
          behavior: 'auto'
        })
        return
      }

      event.preventDefault()
      event.stopPropagation()

      const yearAtPointer = axisMinYear + (viewport.scrollLeft + pointerX - LABEL_WIDTH) / zoom
      const factor = event.deltaY < 0 ? WHEEL_ZOOM_FACTOR : 1 / WHEEL_ZOOM_FACTOR

      setZoom((prevZoom) => {
        const nextZoom = clamp(Number((prevZoom * factor).toFixed(4)), MIN_SCALE, MAX_SCALE)
        const nextScrollLeft = LABEL_WIDTH + (yearAtPointer - axisMinYear) * nextZoom - pointerX
        pendingScrollLeftRef.current = Math.max(0, nextScrollLeft)
        return nextZoom
      })
    }

    viewport.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      viewport.removeEventListener('wheel', handleWheel)
    }
  }, [axisMinYear, zoom])

  useEffect(() => {
    if (!isSettingsOpen) {
      return undefined
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsSettingsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSettingsOpen])

  useEffect(() => {
    if (!rulerContextMenu) {
      return undefined
    }
    const closeMenu = (event) => {
      if (event?.target instanceof Element && event.target.closest('.ruler-context-menu')) {
        return
      }
      setRulerContextMenu(null)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setRulerContextMenu(null)
      }
    }
    window.addEventListener('pointerdown', closeMenu, true)
    window.addEventListener('resize', closeMenu)
    window.addEventListener('scroll', closeMenu, true)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('pointerdown', closeMenu, true)
      window.removeEventListener('resize', closeMenu)
      window.removeEventListener('scroll', closeMenu, true)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [rulerContextMenu])

  useEffect(() => {
    if (historyInitializedRef.current) {
      return undefined
    }
    historyInitializedRef.current = true

    const params = new URLSearchParams(window.location.search)
    const subId = params.get(SUB_TIMELINE_QUERY_KEY)
    const dynastyFromUrl = subId ? dynastyLookup.get(subId) ?? null : null

    if (dynastyFromUrl) {
      const timer = window.setTimeout(() => {
        enterSubTimeline(dynastyFromUrl, { syncHistory: true, historyMode: 'replace' })
      }, 0)
      return () => window.clearTimeout(timer)
    }

    syncTimelineHistory(null, 'replace')
    return undefined
  }, [dynastyLookup, enterSubTimeline, syncTimelineHistory])

  useEffect(() => {
    const handlePopState = (event) => {
      const state = event.state
      const fallbackSubId = new URLSearchParams(window.location.search).get(SUB_TIMELINE_QUERY_KEY)
      const stateView = state?.[TIMELINE_HISTORY_VIEW_KEY]
      const targetSubId =
        stateView === TIMELINE_HISTORY_SUB
          ? state?.dynastyId
          : stateView === TIMELINE_HISTORY_MAIN
            ? null
            : fallbackSubId
      const targetDynasty = targetSubId ? dynastyLookup.get(targetSubId) ?? null : null

      if (targetDynasty) {
        enterSubTimeline(targetDynasty, { syncHistory: false })
      } else {
        exitSubTimeline({ syncHistory: false })
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [dynastyLookup, enterSubTimeline, exitSubTimeline])

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">Imperial Timeline</p>
        <h1>中国君主时间轴</h1>
        <p>
          范围：{formatYear(axisMinYear)} 至 {formatYear(axisMaxYear)}。
          全时期已记录君主 {totalRecordedRulerCount} 位。
          {isSubTimeline
            ? ` 当前为子时间轴：${subTimelineDynasty.name}。`
            : ` 当前显示${filteredDynasties.length}个朝代/政权、${currentDisplayedRulerCount}位君主（点击朝代行可展开或收起君主）。`}
        </p>
      </header>

      <section className="control-panel">
        <div className="control-head">
          <h2>控制菜单</h2>
        </div>
        <div className="quick-actions">
          <button className="secondary-btn quick-btn" type="button" onClick={fitViewToCurrentRange}>
            适应缩放
          </button>
          <button
            className={`secondary-btn quick-btn ${isYearProbeActive ? 'active' : ''}`}
            type="button"
            onClick={() => {
              if (isYearProbeActive) {
                setProbeCopyStatus('')
                setIsYearProbeActive(false)
                return
              }
              const nextProbeYear = probeInitialYear
              setProbeYear(nextProbeYear)
              setIsYearProbeActive(true)
              window.setTimeout(() => ensureProbeCardRoom(nextProbeYear), 0)
            }}
          >
            时点光轴
          </button>
          <button className="secondary-btn" type="button" onClick={expandAllFiltered}>
            全部展开
          </button>
          <button className="secondary-btn" type="button" onClick={collapseAll}>
            全部收起
          </button>
          <button className="secondary-btn quick-btn" type="button" onClick={() => setIsSettingsOpen(true)}>
            Settings
          </button>
        </div>

        <div className="primary-controls">
          <div className="control-block">
            <label htmlFor="search-input">搜索</label>
            <input
              id="search-input"
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="例如：汉武帝、五代、康熙"
            />
          </div>

          <div className="control-block">
            <label htmlFor="zoom-range">缩放: {zoom.toFixed(2)}</label>
            <input
              id="zoom-range"
              type="range"
              min={MIN_SCALE}
              max={MAX_SCALE}
              step={0.05}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
            />
          </div>

          <div className="control-block">
            <label htmlFor="window-start">时间段</label>
            <div className="range-labels">
              <span>{formatYear(windowStart)}</span>
              <span>{formatYear(windowEnd)}</span>
            </div>
            <div className="range-slider-dual">
              <div className="range-slider-track" />
              <div
                className="range-slider-active"
                style={{
                  left: `${windowStartPercent}%`,
                  width: `${Math.max(0, windowEndPercent - windowStartPercent)}%`
                }}
              />
              <input
                id="window-start"
                className="range-slider-thumb range-slider-thumb-start"
                type="range"
                min={TIMELINE_MIN_YEAR}
                max={TIMELINE_MAX_YEAR}
                value={windowStart}
                onChange={(event) => handleWindowStartChange(event.target.value)}
              />
              <input
                className="range-slider-thumb range-slider-thumb-end"
                type="range"
                min={TIMELINE_MIN_YEAR}
                max={TIMELINE_MAX_YEAR}
                value={windowEnd}
                onChange={(event) => handleWindowEndChange(event.target.value)}
              />
            </div>
            <div className="range-hint">
              主轴范围：{formatYear(mainTimelineBounds.start)} - {formatYear(mainTimelineBounds.end)}
            </div>
          </div>

          <div className="control-block wide">
            <label>朝代过滤</label>
            <div className="dynasty-filter-row">
              <div className="dynasty-grid">
                {sortedDynasties.map((dynasty) => {
                  const active = activeDynastyIds.includes(dynasty.id)
                  return (
                    <button
                      key={dynasty.id}
                      className={`dynasty-chip ${active ? 'active' : ''}`}
                      onClick={() => toggleDynastyFilter(dynasty.id)}
                      type="button"
                      aria-pressed={active}
                    >
                      {dynasty.name}
                    </button>
                  )
                })}
              </div>
              <div className="button-row inline">
                <button className="secondary-btn" type="button" onClick={resetFilters}>
                  重置筛选
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isSettingsOpen ? (
        <div className="settings-modal-backdrop" onClick={() => setIsSettingsOpen(false)}>
          <div
            className="settings-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="settings-modal-head">
              <h2 id="settings-title">Settings</h2>
              <button className="secondary-btn settings-close-btn" type="button" onClick={() => setIsSettingsOpen(false)}>
                关闭
              </button>
            </div>
            <div className="settings-modal-body">
              <div className="settings-groups">
                {DISPLAY_SETTING_GROUPS.map((group) => (
                  <section key={group.title} className="settings-group">
                    <h3 className="settings-group-title">{group.title}</h3>
                    <div className="settings-grid">
                      {group.items.map((item) => (
                        <label key={item.key} className="setting-item">
                          <input
                            type="checkbox"
                            checked={displaySettings[item.key]}
                            onChange={() => toggleDisplaySetting(item.key)}
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <section className="layout-grid">
        <article className="timeline-card">
          <div className="timeline-head">
            <h2>时间轴视图</h2>
            <p>左侧朝代区滚轮可纵向滚动页面，右侧时间轴区滚轮可缩放。拖动空白区域可横向平移，双击名称进入子时间轴。</p>
          </div>

          <div
            ref={timelineViewportRef}
            className={`timeline-viewport ${isDragging ? 'dragging' : ''}`}
            style={{ '--label-width': `${LABEL_WIDTH}px` }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDragging}
            onPointerCancel={stopDragging}
            onPointerLeave={stopDragging}
            onMouseLeave={hideTooltip}
          >
            <div className="timeline-left-pane-mask" aria-hidden="true" />
            <div className="timeline-left-pane-divider" aria-hidden="true" />
            <div className="timeline-stage" style={{ width: `${timelineWidth}px`, height: `${timelineRows.height}px` }}>
              {periodBands.map((item) => {
                const startX = getXByYear(item.startYear)
                const endX = getXByYear(item.endYear)
                const width = Math.max(2, endX - startX)
                return (
                  <div
                    key={item.id}
                    className="period-band"
                    style={{
                      left: `${startX}px`,
                      width: `${width}px`,
                      '--band-color': item.color
                    }}
                  >
                    <span className="period-label">{item.label}</span>
                  </div>
                )
              })}

              <div className="axis-line" style={{ left: `${LABEL_WIDTH}px` }} />

              {isYearProbeActive ? (
                <>
                  <div
                    className="probe-axis-line"
                    style={{ left: `${getXByYear(clampedProbeYear)}px` }}
                    onPointerDown={beginProbeAxisDrag}
                    onPointerMove={moveProbeAxisDrag}
                    onPointerUp={endProbeAxisDrag}
                    onPointerCancel={endProbeAxisDrag}
                  >
                    <span className="probe-axis-label">{formatAxisYear(clampedProbeYear)}</span>
                  </div>
                  <div
                    className="probe-float-card"
                    style={{
                      left: `${getXByYear(clampedProbeYear) + PROBE_CARD_GAP}px`,
                      top: `${AXIS_HEIGHT - 8}px`,
                      width: `${PROBE_CARD_WIDTH}px`
                    }}
                    onPointerDown={(event) => event.stopPropagation()}
                  >
                    <div className="probe-float-head">
                      <div>
                        <strong>{formatYear(clampedProbeYear)}</strong>
                        <span>存活 {probeRecords.length} 位 · 在位 {probeReigningCount} 位</span>
                      </div>
                      <div className="probe-head-actions">
                        <button className="secondary-btn probe-mini-btn" type="button" onClick={handleCopyProbeReport}>
                          复制
                        </button>
                        {probeCopyStatus ? <span className="probe-copy-status">{probeCopyStatus}</span> : null}
                      </div>
                    </div>
                    <div className="probe-float-controls">
                      <button className="secondary-btn probe-mini-btn" type="button" onClick={() => shiftProbeYear(-1)}>
                        -1
                      </button>
                      <button className="secondary-btn probe-mini-btn" type="button" onClick={() => shiftProbeYear(1)}>
                        +1
                      </button>
                      <input
                        className="probe-year-input"
                        type="number"
                        min={axisMinYear}
                        max={axisMaxYear}
                        value={clampedProbeYear}
                        onChange={(event) => updateProbeYear(Number(event.target.value), true)}
                      />
                    </div>
                    <div className="probe-info-box">
                      {probeRecords.length > 0 ? (
                        <div className="probe-list">
                          {probeRecords.map((item) => (
                            <article key={item.id} className={`probe-item ${item.isReigning ? 'reigning' : ''}`}>
                              <strong>
                                {item.name}（{item.title}）
                              </strong>
                              <span className="probe-subline">
                                {item.dynastyName}
                                {item.polityName ? ` / ${item.polityName}` : ''}
                              </span>
                              <span>年龄：{typeof item.age === 'number' ? `${item.age}岁` : '未知'}</span>
                              <span>{item.isReigning ? `在位第${item.reignYearsSoFar}年` : '未在位'}</span>
                              <span>年号：{item.activeEras.length > 0 ? item.activeEras.join('、') : '无对应年号'}</span>
                            </article>
                          ))}
                        </div>
                      ) : (
                        <p className="probe-empty">该时点没有匹配到存活君主。</p>
                      )}
                    </div>
                  </div>
                </>
              ) : null}

              {displaySettings.showAxisEdgeYears ? (
                <>
                  <div className="axis-end-label start" style={{ left: `${LABEL_WIDTH}px` }}>
                    {formatAxisYear(axisMinYear)}
                  </div>
                  <div className="axis-end-label end" style={{ left: `${axisEndX}px` }}>
                    {formatAxisYear(axisMaxYear)}
                  </div>
                </>
              ) : null}

              {displaySettings.showTicks
                ? yearTicks.map((year) => {
                  const x = getXByYear(year)
                  return (
                    <div key={year} className="tick">
                      <div className="tick-line" style={{ left: `${x}px` }} />
                      <div className="tick-label" style={{ left: `${x}px` }}>
                        {formatAxisYear(year)}
                      </div>
                    </div>
                  )
                })
                : null}

              {timelineRows.rows.map((row) => {
                const selected = row.key === effectiveSelectedKey
                const dynasty = row.dynasty
                const dynastyColor = categoryPalette[dynasty.category] ?? '#6f6657'

                if (row.type === 'dynasty') {
                  const startX = getXByYear(dynasty.startYear)
                  const endX = getXByYear(dynasty.endYear)
                  const width = Math.max(12, endX - startX)
                  const expanded = expandedDynasties.has(dynasty.id)
                  const dynastyRulerCount = dynasty.rulers.length

                  return (
                    <div
                      key={row.key}
                      className={`timeline-row dynasty-row ${selected ? 'selected' : ''}`}
                      style={{
                        top: `${row.top}px`,
                        '--row-height': `${row.height}px`,
                        '--dynasty-color': dynastyColor
                      }}
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={() => setSelectedKey(row.key)}
                      onContextMenu={(event) => openWikiContextMenu(event, row.key, dynasty.name)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          setSelectedKey(row.key)
                        }
                        if (event.key === 'ArrowRight' && !expanded) {
                          event.preventDefault()
                          toggleDynastyExpand(dynasty.id)
                        }
                        if (event.key === 'ArrowLeft' && expanded) {
                          event.preventDefault()
                          toggleDynastyExpand(dynasty.id)
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-expanded={expanded}
                    >
                      <div
                        className="name-slot dynasty"
                        title="点击选中，双击名称进入子时间轴"
                      >
                        <button
                          type="button"
                          className="fold-btn"
                          aria-label={expanded ? `收起${dynasty.name}` : `展开${dynasty.name}`}
                          aria-expanded={expanded}
                          onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            toggleDynastyExpand(dynasty.id)
                          }}
                          onDoubleClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                          }}
                        >
                          {expanded ? '▾' : '▸'}
                        </button>
                        <div
                          className="dynasty-label"
                          onDoubleClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            enterSubTimeline(dynasty)
                          }}
                        >
                          <strong>{dynasty.name}</strong>
                          <span className="meta">君主{dynastyRulerCount}位</span>
                          <span className="range">{formatPeriod(dynasty.startYear, dynasty.endYear)}</span>
                        </div>
                      </div>
                      <div
                        className="dynasty-track"
                        style={{ left: `${startX}px`, width: `${width}px` }}
                        onDoubleClick={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                          setRulerContextMenu(null)
                          setSelectedKey(row.key)
                          setHighlightedRulerKey(null)
                          zoomToRange(dynasty.startYear, dynasty.endYear)
                        }}
                        onMouseEnter={(event) =>
                          showTooltip(event, dynasty.name, [
                            `区间：${formatPeriod(dynasty.startYear, dynasty.endYear)}`,
                            `君主：${dynastyRulerCount}位`,
                            '右键菜单可打开中文维基百科'
                          ])
                        }
                        onMouseMove={moveTooltip}
                        onMouseLeave={hideTooltip}
                      />
                      {displaySettings.showDynastyTrackEdgeYears ? (
                        <>
                          <div className="track-edge-label start dynasty" style={{ left: `${startX}px` }}>
                            {formatAxisYear(dynasty.startYear)}
                          </div>
                          <div className="track-edge-label end dynasty" style={{ left: `${endX}px` }}>
                            {formatAxisYear(dynasty.endYear)}
                          </div>
                        </>
                      ) : null}
                    </div>
                  )
                }

                const ruler = row.ruler
                const range = getRulerRange(ruler, dynasty)
                const startX = getXByYear(range.start)
                const endX = getXByYear(range.end)
                const intervalWidth = Math.max(10, endX - startX)
                const hasLife = typeof ruler.birthYear === 'number' && typeof ruler.deathYear === 'number'
                const reignPeriods = getReignPeriods(ruler, dynasty)
                const eraPeriods = getEraPeriods(ruler, reignPeriods, dynasty)
                const hasReign = reignPeriods.length > 0
                const reignSegments = reignPeriods.map((period) => {
                  const segmentStartX = getXByYear(period.start)
                  const segmentEndX = getXByYear(period.end)
                  return {
                    ...period,
                    startX: segmentStartX,
                    endX: segmentEndX,
                    width: Math.max(8, segmentEndX - segmentStartX)
                  }
                })
                const reignYears = hasReign ? getReignTotalYears(reignPeriods) : null
                const maxReignEndX = hasReign ? Math.max(...reignSegments.map((item) => item.endX)) : 0
                const reignBoundStart = hasReign ? Math.min(...reignPeriods.map((item) => item.start)) : range.start
                const reignBoundEnd = hasReign ? Math.max(...reignPeriods.map((item) => item.end)) : range.end
                const reignBoundStartX = getXByYear(reignBoundStart)
                const reignBoundEndX = getXByYear(reignBoundEnd)
                const eraSegments = eraPeriods.map((period, index) => {
                  const next = eraPeriods[index + 1] ?? null
                  const clampedStartYear = clamp(period.start, reignBoundStart, reignBoundEnd)
                  const clampedEndYear = clamp(period.end, reignBoundStart, reignBoundEnd)
                  const segmentStartYear = Math.min(clampedStartYear, clampedEndYear)
                  const segmentEndYear = Math.max(clampedStartYear, clampedEndYear)
                  const rawStartX = getXByYear(segmentStartYear)
                  const shouldSnapToNext = next && next.start === period.end + 1
                  const rawEndX = shouldSnapToNext
                    ? getXByYear(clamp(next.start, reignBoundStart, reignBoundEnd))
                    : getXByYear(segmentEndYear)
                  const boundedStartX = clamp(rawStartX, reignBoundStartX, reignBoundEndX)
                  const boundedEndX = clamp(rawEndX, reignBoundStartX, reignBoundEndX)
                  const safeStartX = Math.min(boundedStartX, boundedEndX)
                  const safeEndX = Math.max(boundedStartX, boundedEndX)
                  const spanX = Math.max(0, reignBoundEndX - reignBoundStartX)
                  const width = spanX > 0 ? Math.min(Math.max(2, safeEndX - safeStartX), spanX) : 0
                  const startX = width > 0 ? clamp(safeStartX, reignBoundStartX, reignBoundEndX - width) : safeStartX
                  return {
                    ...period,
                    startX,
                    endX: startX + width,
                    width,
                    index
                  }
                })
                const hasVisibleLifeTrack = displaySettings.showLifeTimeline
                const hasVisibleReignTrack = displaySettings.showReignTimeline && hasReign
                const hasVisibleEraTrack = displaySettings.showEraTimelineDetail && hasReign
                let rulerEdgeStartYear = null
                let rulerEdgeEndYear = null
                if (hasVisibleLifeTrack) {
                  rulerEdgeStartYear = range.start
                  rulerEdgeEndYear = range.end
                } else if (hasVisibleReignTrack || hasVisibleEraTrack) {
                  rulerEdgeStartYear = reignBoundStart
                  rulerEdgeEndYear = reignBoundEnd
                }
                const rulerEdgeStartX = typeof rulerEdgeStartYear === 'number' ? getXByYear(rulerEdgeStartYear) : 0
                const rulerEdgeEndX = typeof rulerEdgeEndYear === 'number' ? getXByYear(rulerEdgeEndYear) : 0
                const highlighted = row.key === highlightedRulerKey
                const focusRulerTimeline = (event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  setRulerContextMenu(null)
                  setSelectedKey(row.key)
                  setHighlightedRulerKey(row.key)
                  zoomToRange(range.start, range.end)
                }

                return (
                  <div
                    key={row.key}
                    className={`timeline-row ruler-row ${selected ? 'selected' : ''} ${highlighted ? 'highlighted' : ''} ${displaySettings.showEraTimelineDetail ? 'era-detailed' : ''}`}
                    style={{
                      top: `${row.top}px`,
                      '--row-height': `${row.height}px`,
                      '--dynasty-color': dynastyColor
                    }}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => setSelectedKey(row.key)}
                    onContextMenu={(event) => openWikiContextMenu(event, row.key, ruler.name)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        setSelectedKey(row.key)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div
                      className="name-slot ruler"
                      onDoubleClick={focusRulerTimeline}
                      title="双击缩放并高亮该人物时间段"
                    >
                      <strong>{ruler.name}</strong>
                      <span className="ruler-meta-line">
                        {ruler.title}
                        {displaySettings.showRulerListLifeYears
                          ? ` · ${formatCompactLifeYears(ruler.birthYear, ruler.deathYear, range.start, range.end)}`
                          : ''}
                      </span>
                    </div>

                    {displaySettings.showLifeTimeline
                      ? hasLife
                        ? (
                          <div
                            className="life-track"
                            style={{ left: `${startX}px`, width: `${intervalWidth}px` }}
                            onMouseEnter={(event) =>
                              showTooltip(event, `${ruler.name}（${ruler.title}）`, [
                                `所属：${dynasty.name}`,
                                ruler.sourcePolity ? `政权：${ruler.sourcePolity}` : null,
                                formatLifeText(ruler),
                                formatReignText(ruler, dynasty),
                                formatEraText(ruler, dynasty),
                                '右键菜单可打开中文维基百科'
                              ].filter(Boolean))
                            }
                            onMouseMove={moveTooltip}
                            onMouseLeave={hideTooltip}
                            onDoubleClick={focusRulerTimeline}
                          />
                        )
                        : (
                          <div
                            className="life-track dashed"
                            style={{ left: `${startX}px`, width: `${intervalWidth}px` }}
                            onMouseEnter={(event) =>
                              showTooltip(event, `${ruler.name}（${ruler.title}）`, [
                                `所属：${dynasty.name}`,
                                ruler.sourcePolity ? `政权：${ruler.sourcePolity}` : null,
                                `区间：${formatPeriod(range.start, range.end)}`,
                                formatReignText(ruler, dynasty),
                                formatEraText(ruler, dynasty),
                                '右键菜单可打开中文维基百科'
                              ].filter(Boolean))
                            }
                            onMouseMove={moveTooltip}
                            onMouseLeave={hideTooltip}
                            onDoubleClick={focusRulerTimeline}
                          />
                        )
                      : null}

                    {hasReign && displaySettings.showReignTimeline
                      ? reignSegments.map((period, index) => (
                        <div
                          key={`${row.key}:reign:${index}`}
                          className="reign-track"
                          style={{ left: `${period.startX}px`, width: `${period.width}px` }}
                          onMouseEnter={(event) =>
                            showTooltip(event, `${ruler.name}在位时间`, [
                              `所属：${dynasty.name}`,
                              ruler.sourcePolity ? `政权：${ruler.sourcePolity}` : null,
                              `在位分段：${formatPeriod(period.start, period.end)}`,
                              formatReignText(ruler, dynasty),
                              formatEraText(ruler, dynasty),
                              '右键菜单可打开中文维基百科'
                            ].filter(Boolean))
                          }
                          onMouseMove={moveTooltip}
                          onMouseLeave={hideTooltip}
                          onDoubleClick={focusRulerTimeline}
                        />
                      ))
                      : null}

                    {hasReign && displaySettings.showEraTimelineDetail
                      ? eraSegments.map((period, index) => (
                        <div
                          key={`${row.key}:era:${index}`}
                          className={`era-segment ${period.index % 2 === 0 ? 'even' : 'odd'}`}
                          style={{ left: `${period.startX}px`, width: `${period.width}px` }}
                          title={`${period.name} ${formatAxisYear(period.start)}-${formatAxisYear(period.end)}`}
                          onMouseEnter={(event) =>
                            showTooltip(event, `${ruler.name}年号`, [
                              `所属：${dynasty.name}`,
                              ruler.sourcePolity ? `政权：${ruler.sourcePolity}` : null,
                              `年号：${period.name}`,
                              `区间：${formatPeriod(period.start, period.end)}`,
                              '右键菜单可打开中文维基百科'
                            ].filter(Boolean))
                          }
                          onMouseMove={moveTooltip}
                          onMouseLeave={hideTooltip}
                          onDoubleClick={focusRulerTimeline}
                        >
                          <span className="era-segment-text">
                            {period.name} {formatAxisYear(period.start)}-{formatAxisYear(period.end)}
                          </span>
                        </div>
                      ))
                      : null}

                    {hasReign && displaySettings.showReignTimeline && displaySettings.showReignYears && reignYears !== null ? (
                      <div
                        className="reign-years-label"
                        style={{
                          left: `${clamp(maxReignEndX + 6, LABEL_WIDTH + 8, timelineWidth - 42)}px`
                        }}
                      >
                        {reignYears}年
                      </div>
                    ) : null}

                    {displaySettings.showRulerTrackEdgeYears &&
                      typeof rulerEdgeStartYear === 'number' &&
                      typeof rulerEdgeEndYear === 'number' ? (
                      <>
                        <div className="track-edge-label start ruler" style={{ left: `${rulerEdgeStartX}px` }}>
                          {formatAxisYear(rulerEdgeStartYear)}
                        </div>
                        <div className="track-edge-label end ruler" style={{ left: `${rulerEdgeEndX}px` }}>
                          {formatAxisYear(rulerEdgeEndYear)}
                        </div>
                      </>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>
        </article>

        <aside className="detail-card">
          {selectedRow ? (
            selectedRow.type === 'dynasty' ? (
              <>
                <p className="eyebrow">Dynasty Detail</p>
                <h3>{selectedRow.dynasty.name}</h3>
                <p className="dynasty-badge">{selectedRow.dynasty.category}</p>
                <dl>
                  <dt>朝代区间</dt>
                  <dd>{formatPeriod(selectedRow.dynasty.startYear, selectedRow.dynasty.endYear)}</dd>
                  <dt>君主数量</dt>
                  <dd>{selectedRow.dynasty.rulers.length} 位（数据内）</dd>
                  <dt>当前窗口</dt>
                  <dd>{selectedRow.dynasty.visibleRulers.length} 位可见</dd>
                </dl>
                <p className="notes">点击同一朝代行可折叠/展开君主。</p>
              </>
            ) : (
              <>
                <p className="eyebrow">Ruler Detail</p>
                <h3>{selectedRow.ruler.name}</h3>
                <p className="dynasty-badge">{selectedRow.dynasty.name}</p>
                <dl>
                  <dt>称谓</dt>
                  <dd>{selectedRow.ruler.title || '未知'}</dd>
                  <dt>原政权</dt>
                  <dd>{selectedRow.ruler.sourcePolity || selectedRow.dynasty.name}</dd>
                  <dt>出生</dt>
                  <dd>{formatYear(selectedRow.ruler.birthYear)}</dd>
                  <dt>死亡</dt>
                  <dd>{formatYear(selectedRow.ruler.deathYear)}</dd>
                  <dt>在位</dt>
                  <dd>{formatReignText(selectedRow.ruler, selectedRow.dynasty).replace('在位：', '')}</dd>
                  <dt>年号</dt>
                  <dd>{formatEraText(selectedRow.ruler, selectedRow.dynasty).replace('年号：', '')}</dd>
                </dl>
              </>
            )
          ) : (
            <>
              <p className="eyebrow">Detail</p>
              <h3>暂无结果</h3>
              <p className="notes">调整筛选条件后再查看。</p>
            </>
          )}
        </aside>
      </section>

      {tooltip ? (
        <div className="hover-tooltip" style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}>
          <strong>{tooltip.title}</strong>
          {tooltip.lines.map((line, index) => (
            <span key={index}>{line}</span>
          ))}
        </div>
      ) : null}
      {rulerContextMenu ? (
        <div
          className="ruler-context-menu"
          style={{ left: `${rulerContextMenu.x}px`, top: `${rulerContextMenu.y}px` }}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
          onContextMenu={(event) => event.preventDefault()}
        >
          <button
            type="button"
            className="ruler-context-menu-item"
            onClick={() => {
              openWiki(rulerContextMenu.subjectName)
              setRulerContextMenu(null)
            }}
          >
            打开中文维基百科
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default App
