import { useEffect, useMemo, useRef, useState } from 'react'
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
  showTrackEdgeYears: true,
  showRulerListLifeYears: true,
  showReignYears: true,
  showEraTimelineDetail: false,
  showTicks: true,
  showPeriodBands: true,
  showTooltips: true
}

const DISPLAY_SETTING_ITEMS = [
  { key: 'showAxisEdgeYears', label: '显示时间轴首尾年份' },
  { key: 'showTrackEdgeYears', label: '显示每行首尾年份' },
  { key: 'showRulerListLifeYears', label: '左侧显示君主生卒' },
  { key: 'showReignYears', label: '显示在位年数标记' },
  { key: 'showEraTimelineDetail', label: '显示年号时间轴（并排，自动适配粗细）' },
  { key: 'showTicks', label: '显示刻度线与年份' },
  { key: 'showPeriodBands', label: '显示分期背景色带' },
  { key: 'showTooltips', label: '显示悬浮详情提示' }
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
  const pendingScrollLeftRef = useRef(null)

  const sortedDynasties = useMemo(() => {
    const merged = mergePeriodGroups(dynastyGroups)
    return [...merged].sort((a, b) => {
      if (a.startYear !== b.startYear) {
        return a.startYear - b.startYear
      }
      return a.endYear - b.endYear
    })
  }, [])

  const categories = useMemo(() => {
    return [...new Set(sortedDynasties.map((item) => item.category))]
  }, [sortedDynasties])

  const [isDragging, setIsDragging] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [zoom, setZoom] = useState(DEFAULT_SCALE)
  const [yearWindow, setYearWindow] = useState([TIMELINE_MIN_YEAR, TIMELINE_MAX_YEAR])
  const [activeCategories, setActiveCategories] = useState(categories)
  const [expandedDynasties, setExpandedDynasties] = useState(new Set())
  const [selectedKey, setSelectedKey] = useState(`dynasty:${sortedDynasties[0]?.id ?? ''}`)
  const [tooltip, setTooltip] = useState(null)
  const [subTimelineId, setSubTimelineId] = useState(null)
  const [highlightedRulerKey, setHighlightedRulerKey] = useState(null)
  const [displaySettings, setDisplaySettings] = useState(DEFAULT_DISPLAY_SETTINGS)

  const normalizedSearch = searchText.trim().toLowerCase()
  const [windowStart, windowEnd] = yearWindow

  const filteredDynasties = useMemo(() => {
    return sortedDynasties.reduce((result, dynasty) => {
      if (!activeCategories.includes(dynasty.category)) {
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
  }, [activeCategories, normalizedSearch, sortedDynasties, windowEnd, windowStart])

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

  const axisMinYear = isSubTimeline ? subTimelineBounds.start : TIMELINE_MIN_YEAR
  const axisMaxYear = isSubTimeline ? subTimelineBounds.end : TIMELINE_MAX_YEAR
  const totalYears = Math.max(1, axisMaxYear - axisMinYear)
  const timelineWidth = LABEL_WIDTH + totalYears * zoom + 64
  const yearTicks = useMemo(() => getYearTicks(axisMinYear, axisMaxYear), [axisMaxYear, axisMinYear])
  const periodBands = useMemo(() => {
    if (isSubTimeline || !displaySettings.showPeriodBands) {
      return []
    }
    return PERIOD_BANDS.filter((item) => overlap(item.startYear, item.endYear, TIMELINE_MIN_YEAR, TIMELINE_MAX_YEAR))
  }, [displaySettings.showPeriodBands, isSubTimeline])
  const axisEndX = LABEL_WIDTH + totalYears * zoom

  const getXByYear = (year) => {
    const clampedYear = clamp(year, axisMinYear, axisMaxYear)
    return LABEL_WIDTH + (clampedYear - axisMinYear) * zoom
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

  const enterSubTimeline = (dynasty) => {
    const bounds = getDynastyLifeBounds(dynasty)
    setSubTimelineId(dynasty.id)
    setSelectedKey(`dynasty:${dynasty.id}`)
    setExpandedDynasties((current) => {
      const next = new Set(current)
      next.add(dynasty.id)
      return next
    })

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
  }

  const exitSubTimeline = () => {
    setSubTimelineId(null)
    if (timelineViewportRef.current && Math.abs(zoom - DEFAULT_SCALE) < 0.0001) {
      timelineViewportRef.current.scrollLeft = 0
      return
    }
    pendingScrollLeftRef.current = 0
    setZoom(DEFAULT_SCALE)
  }

  useEffect(() => {
    if (pendingScrollLeftRef.current === null || !timelineViewportRef.current) {
      return
    }
    timelineViewportRef.current.scrollLeft = pendingScrollLeftRef.current
    pendingScrollLeftRef.current = null
  }, [zoom])

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

  const handleWindowStartChange = (value) => {
    const nextStart = Number(value)
    setYearWindow(([, end]) => [Math.min(nextStart, end), end])
  }

  const handleWindowEndChange = (value) => {
    const nextEnd = Number(value)
    setYearWindow(([start]) => [start, Math.max(nextEnd, start)])
  }

  const toggleCategory = (category) => {
    setActiveCategories((current) => {
      if (current.includes(category)) {
        const next = current.filter((item) => item !== category)
        return next.length ? next : current
      }
      return [...current, category]
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
    setSearchText('')
    setActiveCategories(categories)
    setYearWindow([TIMELINE_MIN_YEAR, TIMELINE_MAX_YEAR])
    setSubTimelineId(null)
    setZoom(DEFAULT_SCALE)
    setHighlightedRulerKey(null)
  }

  const resetView = () => {
    if (timelineViewportRef.current && Math.abs(zoom - DEFAULT_SCALE) < 0.0001) {
      timelineViewportRef.current.scrollLeft = 0
      return
    }
    pendingScrollLeftRef.current = 0
    setZoom(DEFAULT_SCALE)
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
      event.preventDefault()
      event.stopPropagation()

      const rect = viewport.getBoundingClientRect()
      const pointerX = event.clientX - rect.left
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

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">Imperial Timeline</p>
        <h1>中国君主时间轴（按朝代可展开）</h1>
        <p>
          范围：{formatYear(axisMinYear)} 至 {formatYear(axisMaxYear)}。
          {isSubTimeline
            ? ` 当前为子时间轴：${subTimelineDynasty.name}。`
            : ` 当前显示${filteredDynasties.length}个朝代/政权（点击朝代行可展开或收起君主）。`}
        </p>
      </header>

      <section className="control-panel">
        <div className="quick-actions">
          <button className="secondary-btn quick-btn" type="button" onClick={resetView}>
            重置视图
          </button>
          <button className="secondary-btn quick-btn" type="button" onClick={fitViewToCurrentRange}>
            适应视图缩放
          </button>
        </div>

        <details className="settings-menu">
          <summary className="settings-summary">
            <span>Settings</span>
            <span className="settings-hint">搜索、过滤、显示开关</span>
          </summary>
          <div className="settings-body">
            <div className="control-block">
              <label htmlFor="search-input">搜索（朝代 / 君主 / 名号）</label>
              <input
                id="search-input"
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="例如：汉武帝、五代、康熙"
              />
            </div>

            <div className="control-block">
              <label htmlFor="zoom-range">时间轴缩放（每年像素）: {zoom.toFixed(2)}</label>
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
              <label htmlFor="window-start">时间段过滤</label>
              <div className="range-labels">
                <span>{formatYear(windowStart)}</span>
                <span>{formatYear(windowEnd)}</span>
              </div>
              <input
                id="window-start"
                type="range"
                min={TIMELINE_MIN_YEAR}
                max={TIMELINE_MAX_YEAR}
                value={windowStart}
                onChange={(event) => handleWindowStartChange(event.target.value)}
              />
              <input
                type="range"
                min={TIMELINE_MIN_YEAR}
                max={TIMELINE_MAX_YEAR}
                value={windowEnd}
                onChange={(event) => handleWindowEndChange(event.target.value)}
              />
            </div>

            <div className="control-block">
              <label>时代分类过滤（至少保留一项）</label>
              <div className="dynasty-grid">
                {categories.map((category) => {
                  const active = activeCategories.includes(category)
                  return (
                    <button
                      key={category}
                      className={`dynasty-chip ${active ? 'active' : ''}`}
                      onClick={() => toggleCategory(category)}
                      type="button"
                      aria-pressed={active}
                    >
                      {category}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="control-block">
              <label>显示设置</label>
              <div className="settings-grid">
                {DISPLAY_SETTING_ITEMS.map((item) => (
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
            </div>

            <div className="button-row">
              <button className="secondary-btn" type="button" onClick={resetFilters}>
                重置筛选
              </button>
              {isSubTimeline ? (
                <button className="secondary-btn" type="button" onClick={exitSubTimeline}>
                  退出子时间轴
                </button>
              ) : null}
              <button className="secondary-btn" type="button" onClick={expandAllFiltered}>
                展开当前结果
              </button>
              <button className="secondary-btn" type="button" onClick={collapseAll}>
                收起全部
              </button>
            </div>
          </div>
        </details>
      </section>

      <section className="layout-grid">
        <article className="timeline-card">
          <div className="timeline-head">
            <h2>时间轴视图</h2>
            <p>拖动空白区域可横向平移，滚轮可缩放。点击朝代行仅选中，点箭头折叠/展开，双击名称进入子时间轴。</p>
          </div>

          <div
            ref={timelineViewportRef}
            className={`timeline-viewport ${isDragging ? 'dragging' : ''}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDragging}
            onPointerCancel={stopDragging}
            onPointerLeave={stopDragging}
            onMouseLeave={hideTooltip}
          >
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
                          <span className="meta">{dynasty.category}</span>
                          <span className="range">{formatPeriod(dynasty.startYear, dynasty.endYear)}</span>
                        </div>
                      </div>
                      <div
                        className="dynasty-track"
                        style={{ left: `${startX}px`, width: `${width}px` }}
                        onMouseEnter={(event) =>
                          showTooltip(event, dynasty.name, [
                            `类别：${dynasty.category}`,
                            `区间：${formatPeriod(dynasty.startYear, dynasty.endYear)}`,
                            '点击可打开中文维基百科'
                          ])
                        }
                        onMouseMove={moveTooltip}
                        onMouseLeave={hideTooltip}
                        onClick={(event) => {
                          event.stopPropagation()
                          openWiki(dynasty.name)
                        }}
                      />
                      {displaySettings.showTrackEdgeYears ? (
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
                const highlighted = row.key === highlightedRulerKey

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
                      onDoubleClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        setSelectedKey(row.key)
                        setHighlightedRulerKey(row.key)
                        zoomToRange(range.start, range.end)
                      }}
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

                    {hasLife ? (
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
                            '点击可打开中文维基百科'
                          ].filter(Boolean))
                        }
                        onMouseMove={moveTooltip}
                        onMouseLeave={hideTooltip}
                        onClick={(event) => {
                          event.stopPropagation()
                          openWiki(ruler.name)
                        }}
                      />
                    ) : (
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
                            '点击可打开中文维基百科'
                          ].filter(Boolean))
                        }
                        onMouseMove={moveTooltip}
                        onMouseLeave={hideTooltip}
                        onClick={(event) => {
                          event.stopPropagation()
                          openWiki(ruler.name)
                        }}
                      />
                    )}

                    {hasReign
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
                                '点击可打开中文维基百科'
                              ].filter(Boolean))
                            }
                            onMouseMove={moveTooltip}
                            onMouseLeave={hideTooltip}
                            onClick={(event) => {
                              event.stopPropagation()
                              openWiki(ruler.name)
                            }}
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
                                '点击可打开中文维基百科'
                              ].filter(Boolean))
                            }
                            onMouseMove={moveTooltip}
                            onMouseLeave={hideTooltip}
                            onClick={(event) => {
                              event.stopPropagation()
                              openWiki(ruler.name)
                            }}
                          >
                            <span className="era-segment-text">
                              {period.name} {formatAxisYear(period.start)}-{formatAxisYear(period.end)}
                            </span>
                          </div>
                        ))
                      : null}

                    {hasReign && displaySettings.showReignYears && reignYears !== null ? (
                      <div
                        className="reign-years-label"
                        style={{
                          left: `${clamp(maxReignEndX + 6, LABEL_WIDTH + 8, timelineWidth - 42)}px`
                        }}
                      >
                        {reignYears}年
                      </div>
                    ) : null}

                    {displaySettings.showTrackEdgeYears ? (
                      <>
                        <div className="track-edge-label start ruler" style={{ left: `${startX}px` }}>
                          {formatAxisYear(range.start)}
                        </div>
                        <div className="track-edge-label end ruler" style={{ left: `${endX}px` }}>
                          {formatAxisYear(range.end)}
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
    </div>
  )
}

export default App
