import { useMemo, useRef, useState } from 'react'
import { TIMELINE_MAX_YEAR, TIMELINE_MIN_YEAR, dynastyGroups } from './data/timelineData'

const LABEL_WIDTH = 280
const AXIS_HEIGHT = 72
const DYNASTY_ROW_HEIGHT = 52
const RULER_ROW_HEIGHT = 44
const YEAR_TICK_STEP = 100
const MIN_SCALE = 0.4
const MAX_SCALE = 2.4
const DEFAULT_SCALE = 0.85

const categoryPalette = {
  上古三代: '#78543a',
  春秋战国: '#84603d',
  秦汉三国: '#8f3f2f',
  魏晋南北朝: '#3f5d7a',
  隋唐五代十国: '#5f4a7f',
  宋辽夏金元: '#3f6a5a',
  明清: '#8f5b2f'
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

function formatPeriod(start, end) {
  return `${formatYear(start)} - ${formatYear(end)}`
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
  let start = ruler.birthYear ?? ruler.reignStart ?? dynasty.startYear
  let end = ruler.deathYear ?? ruler.reignEnd ?? dynasty.endYear
  if (start > end) {
    const temp = start
    start = end
    end = temp
  }
  return { start, end }
}

function getYearTicks() {
  const ticks = []
  for (let year = TIMELINE_MIN_YEAR; year <= TIMELINE_MAX_YEAR; year += YEAR_TICK_STEP) {
    ticks.push(year)
  }
  if (ticks[ticks.length - 1] !== TIMELINE_MAX_YEAR) {
    ticks.push(TIMELINE_MAX_YEAR)
  }
  return ticks
}

function App() {
  const timelineViewportRef = useRef(null)
  const dragStateRef = useRef({ active: false, startX: 0, startScrollLeft: 0 })

  const sortedDynasties = useMemo(() => {
    return [...dynastyGroups].sort((a, b) => {
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
              matchFields([ruler.name, ruler.title, ruler.eraName], normalizedSearch)
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

  const timelineRows = useMemo(() => {
    const rows = []
    let top = AXIS_HEIGHT

    filteredDynasties.forEach((dynasty) => {
      rows.push({
        key: `dynasty:${dynasty.id}`,
        type: 'dynasty',
        top,
        height: DYNASTY_ROW_HEIGHT,
        dynasty
      })
      top += DYNASTY_ROW_HEIGHT

      if (expandedDynasties.has(dynasty.id)) {
        dynasty.visibleRulers.forEach((ruler) => {
          rows.push({
            key: `ruler:${ruler.id}`,
            type: 'ruler',
            top,
            height: RULER_ROW_HEIGHT,
            dynasty,
            ruler
          })
          top += RULER_ROW_HEIGHT
        })
      }
    })

    return {
      rows,
      height: top + 24
    }
  }, [expandedDynasties, filteredDynasties])

  const rowMap = useMemo(() => {
    const map = new Map()
    timelineRows.rows.forEach((row) => map.set(row.key, row))
    return map
  }, [timelineRows.rows])

  const fallbackKey = timelineRows.rows[0]?.key ?? null
  const effectiveSelectedKey = selectedKey && rowMap.has(selectedKey) ? selectedKey : fallbackKey
  const selectedRow = effectiveSelectedKey ? rowMap.get(effectiveSelectedKey) : null

  const totalYears = TIMELINE_MAX_YEAR - TIMELINE_MIN_YEAR
  const timelineWidth = LABEL_WIDTH + totalYears * zoom + 64
  const yearTicks = useMemo(() => getYearTicks(), [])

  const getXByYear = (year) => {
    const clampedYear = clamp(year, TIMELINE_MIN_YEAR, TIMELINE_MAX_YEAR)
    return LABEL_WIDTH + (clampedYear - TIMELINE_MIN_YEAR) * zoom
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

  const expandAllFiltered = () => {
    setExpandedDynasties(new Set(filteredDynasties.map((item) => item.id)))
  }

  const collapseAll = () => {
    setExpandedDynasties(new Set())
  }

  const resetFilters = () => {
    setSearchText('')
    setActiveCategories(categories)
    setYearWindow([TIMELINE_MIN_YEAR, TIMELINE_MAX_YEAR])
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

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">Imperial Timeline</p>
        <h1>中国君主时间轴（按朝代可展开）</h1>
        <p>
          范围：{formatYear(TIMELINE_MIN_YEAR)} 至 {formatYear(TIMELINE_MAX_YEAR)}。当前显示
          {filteredDynasties.length} 个朝代/政权（点击朝代行可展开或收起君主）。
        </p>
      </header>

      <section className="control-panel">
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

        <div className="button-row">
          <button className="secondary-btn" type="button" onClick={resetFilters}>
            重置筛选
          </button>
          <button className="secondary-btn" type="button" onClick={expandAllFiltered}>
            展开当前结果
          </button>
          <button className="secondary-btn" type="button" onClick={collapseAll}>
            收起全部
          </button>
        </div>
      </section>

      <section className="layout-grid">
        <article className="timeline-card">
          <div className="timeline-head">
            <h2>时间轴视图</h2>
            <p>拖动空白区域可横向平移。点击朝代行展开君主，点击具体君主查看详情。</p>
          </div>

          <div
            ref={timelineViewportRef}
            className={`timeline-viewport ${isDragging ? 'dragging' : ''}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDragging}
            onPointerCancel={stopDragging}
            onPointerLeave={stopDragging}
          >
            <div className="timeline-stage" style={{ width: `${timelineWidth}px`, height: `${timelineRows.height}px` }}>
              <div className="axis-line" style={{ left: `${LABEL_WIDTH}px` }} />

              {yearTicks.map((year) => {
                const x = getXByYear(year)
                return (
                  <div key={year} className="tick">
                    <div className="tick-line" style={{ left: `${x}px` }} />
                    <div className="tick-label" style={{ left: `${x}px` }}>
                      {year < 0 ? `前${Math.abs(year)}` : year}
                    </div>
                  </div>
                )
              })}

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
                      onClick={() => toggleDynastyExpand(dynasty.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          toggleDynastyExpand(dynasty.id)
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-expanded={expanded}
                    >
                      <div className="name-slot dynasty">
                        <span className="caret">{expanded ? '▾' : '▸'}</span>
                        <strong>{dynasty.name}</strong>
                        <span>{dynasty.category}</span>
                      </div>
                      <div className="dynasty-track" style={{ left: `${startX}px`, width: `${width}px` }} />
                    </div>
                  )
                }

                const ruler = row.ruler
                const range = getRulerRange(ruler, dynasty)
                const startX = getXByYear(range.start)
                const endX = getXByYear(range.end)
                const intervalWidth = Math.max(10, endX - startX)
                const hasLife = typeof ruler.birthYear === 'number' && typeof ruler.deathYear === 'number'
                const hasReign = typeof ruler.reignStart === 'number' && typeof ruler.reignEnd === 'number'
                const reignStartX = hasReign ? getXByYear(ruler.reignStart) : 0
                const reignEndX = hasReign ? getXByYear(ruler.reignEnd) : 0
                const reignWidth = hasReign ? Math.max(8, reignEndX - reignStartX) : 0

                return (
                  <div
                    key={row.key}
                    className={`timeline-row ruler-row ${selected ? 'selected' : ''}`}
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
                    <div className="name-slot ruler">
                      <strong>{ruler.name}</strong>
                      <span>{ruler.title}</span>
                    </div>

                    {hasLife ? (
                      <div className="life-track" style={{ left: `${startX}px`, width: `${intervalWidth}px` }} />
                    ) : (
                      <div className="life-track dashed" style={{ left: `${startX}px`, width: `${intervalWidth}px` }} />
                    )}

                    {hasReign ? (
                      <div className="reign-track" style={{ left: `${reignStartX}px`, width: `${reignWidth}px` }} />
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
                  <dt>出生</dt>
                  <dd>{formatYear(selectedRow.ruler.birthYear)}</dd>
                  <dt>死亡</dt>
                  <dd>{formatYear(selectedRow.ruler.deathYear)}</dd>
                  <dt>在位</dt>
                  <dd>{formatPeriod(selectedRow.ruler.reignStart, selectedRow.ruler.reignEnd)}</dd>
                  <dt>年号</dt>
                  <dd>{selectedRow.ruler.eraName || '未知'}</dd>
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
    </div>
  )
}

export default App
