export const TIMELINE_MIN_YEAR = -2100
export const TIMELINE_MAX_YEAR = 1920

export const dynastyGroups = [
  {
    id: 'xia',
    name: '夏',
    category: '上古三代',
    startYear: -2070,
    endYear: -1600,
    rulers: [
      { id: 'xia-yu', name: '夏禹', title: '禹', reignStart: -2070, reignEnd: -2061 },
      { id: 'xia-qi', name: '夏启', title: '启', reignStart: -2060, reignEnd: -2050 },
      { id: 'xia-shaokang', name: '夏少康', title: '少康', reignStart: -1972, reignEnd: -1912 },
      { id: 'xia-kongjia', name: '夏孔甲', title: '孔甲', reignStart: -1700, reignEnd: -1675 },
      { id: 'xia-jie', name: '夏桀', title: '桀', reignStart: -1674, reignEnd: -1600 }
    ]
  },
  {
    id: 'shang',
    name: '商',
    category: '上古三代',
    startYear: -1600,
    endYear: -1046,
    rulers: [
      { id: 'shang-tang', name: '商汤', title: '成汤', reignStart: -1600, reignEnd: -1588 },
      { id: 'shang-taijia', name: '太甲', title: '太甲', reignStart: -1534, reignEnd: -1506 },
      { id: 'shang-pangeng', name: '盘庚', title: '盘庚', reignStart: -1401, reignEnd: -1374 },
      { id: 'shang-wuding', name: '武丁', title: '武丁', reignStart: -1250, reignEnd: -1192 },
      { id: 'shang-dixin', name: '帝辛', title: '纣王', reignStart: -1075, reignEnd: -1046 }
    ]
  },
  {
    id: 'western-zhou',
    name: '西周',
    category: '上古三代',
    startYear: -1046,
    endYear: -771,
    rulers: [
      { id: 'wz-wuwang', name: '周武王', title: '姬发', reignStart: -1046, reignEnd: -1043 },
      { id: 'wz-chengwang', name: '周成王', title: '姬诵', reignStart: -1042, reignEnd: -1021 },
      { id: 'wz-kangwang', name: '周康王', title: '姬钊', reignStart: -1020, reignEnd: -996 },
      { id: 'wz-muwang', name: '周穆王', title: '姬满', reignStart: -976, reignEnd: -922 },
      { id: 'wz-xuanwang', name: '周宣王', title: '姬静', reignStart: -827, reignEnd: -782 },
      { id: 'wz-youwang', name: '周幽王', title: '姬宫湦', reignStart: -781, reignEnd: -771 }
    ]
  },
  {
    id: 'eastern-zhou',
    name: '东周（周王室）',
    category: '春秋战国',
    startYear: -770,
    endYear: -256,
    rulers: [
      { id: 'ez-pingwang', name: '周平王', title: '姬宜臼', reignStart: -770, reignEnd: -720 },
      { id: 'ez-huanwang', name: '周桓王', title: '姬林', reignStart: -719, reignEnd: -697 },
      { id: 'ez-xiangwang', name: '周襄王', title: '姬郑', reignStart: -651, reignEnd: -619 },
      { id: 'ez-jingwang', name: '周敬王', title: '姬匄', reignStart: -519, reignEnd: -476 },
      { id: 'ez-xianwang', name: '周显王', title: '姬扁', reignStart: -368, reignEnd: -321 },
      { id: 'ez-nanwang', name: '周赧王', title: '姬延', reignStart: -314, reignEnd: -256 }
    ]
  },
  {
    id: 'state-qi',
    name: '齐（春秋战国）',
    category: '春秋战国',
    startYear: -1046,
    endYear: -221,
    rulers: [
      { id: 'qi-huangong', name: '齐桓公', title: '姜小白', reignStart: -685, reignEnd: -643 },
      { id: 'qi-jinggong', name: '齐景公', title: '姜杵臼', reignStart: -547, reignEnd: -490 },
      { id: 'qi-weiwang', name: '齐威王', title: '田因齐', reignStart: -356, reignEnd: -320 },
      { id: 'qi-xuanwang', name: '齐宣王', title: '田辟疆', reignStart: -319, reignEnd: -301 },
      { id: 'qi-minwang', name: '齐湣王', title: '田地', reignStart: -300, reignEnd: -284 },
      { id: 'qi-wangjian', name: '齐王建', title: '田建', reignStart: -264, reignEnd: -221 }
    ]
  },
  {
    id: 'state-jin',
    name: '晋（春秋）',
    category: '春秋战国',
    startYear: -1033,
    endYear: -349,
    rulers: [
      { id: 'jin-wengong', name: '晋文公', title: '重耳', reignStart: -636, reignEnd: -628 },
      { id: 'jin-jinggong', name: '晋景公', title: '獳', reignStart: -599, reignEnd: -581 },
      { id: 'jin-daogong', name: '晋悼公', title: '周', reignStart: -573, reignEnd: -558 },
      { id: 'jin-pinggong', name: '晋平公', title: '彪', reignStart: -557, reignEnd: -532 },
      { id: 'jin-jingjinggong', name: '晋静公', title: '俱酒', reignStart: -376, reignEnd: -349 }
    ]
  },
  {
    id: 'state-chu',
    name: '楚（春秋战国）',
    category: '春秋战国',
    startYear: -1042,
    endYear: -223,
    rulers: [
      { id: 'chu-wuwang', name: '楚武王', title: '熊通', reignStart: -740, reignEnd: -690 },
      { id: 'chu-zhuangwang', name: '楚庄王', title: '熊侣', reignStart: -613, reignEnd: -591 },
      { id: 'chu-lingwang', name: '楚灵王', title: '熊围', reignStart: -540, reignEnd: -529 },
      { id: 'chu-huaiwang', name: '楚怀王', title: '熊槐', reignStart: -328, reignEnd: -299 },
      { id: 'chu-kaoliewang', name: '楚考烈王', title: '熊完', reignStart: -262, reignEnd: -238 },
      { id: 'chu-fuchu', name: '楚王负刍', title: '负刍', reignStart: -227, reignEnd: -223 }
    ]
  },
  {
    id: 'state-wu',
    name: '吴（春秋）',
    category: '春秋战国',
    startYear: -585,
    endYear: -473,
    rulers: [
      { id: 'wu-shoumeng', name: '吴王寿梦', title: '寿梦', reignStart: -585, reignEnd: -561 },
      { id: 'wu-helv', name: '吴王阖闾', title: '阖闾', reignStart: -514, reignEnd: -496 },
      { id: 'wu-fuchai', name: '吴王夫差', title: '夫差', reignStart: -495, reignEnd: -473 }
    ]
  },
  {
    id: 'state-yue',
    name: '越（春秋战国）',
    category: '春秋战国',
    startYear: -496,
    endYear: -306,
    rulers: [
      { id: 'yue-goujian', name: '越王勾践', title: '勾践', reignStart: -496, reignEnd: -465 },
      { id: 'yue-zhuju', name: '越王朱句', title: '朱句', reignStart: -448, reignEnd: -412 },
      { id: 'yue-wujiang', name: '越王无疆', title: '无疆', reignStart: -376, reignEnd: -334 }
    ]
  },
  {
    id: 'state-qin',
    name: '秦（战国）',
    category: '春秋战国',
    startYear: -770,
    endYear: -221,
    rulers: [
      { id: 'qin-mugong', name: '秦穆公', title: '嬴任好', reignStart: -659, reignEnd: -621 },
      { id: 'qin-xiaogong', name: '秦孝公', title: '嬴渠梁', reignStart: -361, reignEnd: -338 },
      { id: 'qin-huiwen', name: '秦惠文王', title: '嬴驷', reignStart: -337, reignEnd: -311 },
      { id: 'qin-zhaoxiang', name: '秦昭襄王', title: '嬴稷', reignStart: -306, reignEnd: -251 },
      { id: 'qin-zhuangxiang', name: '秦庄襄王', title: '嬴子楚', reignStart: -249, reignEnd: -247 },
      { id: 'qin-king-zheng', name: '秦王政', title: '嬴政', reignStart: -246, reignEnd: -221 }
    ]
  },
  {
    id: 'state-zhao',
    name: '赵（战国）',
    category: '春秋战国',
    startYear: -403,
    endYear: -222,
    rulers: [
      { id: 'zhao-liehou', name: '赵烈侯', title: '赵籍', reignStart: -403, reignEnd: -387 },
      { id: 'zhao-wuling', name: '赵武灵王', title: '赵雍', reignStart: -325, reignEnd: -299 },
      { id: 'zhao-huiwen', name: '赵惠文王', title: '赵何', reignStart: -298, reignEnd: -266 },
      { id: 'zhao-xiaocheng', name: '赵孝成王', title: '赵丹', reignStart: -265, reignEnd: -245 },
      { id: 'zhao-qian', name: '赵王迁', title: '赵迁', reignStart: -235, reignEnd: -228 },
      { id: 'zhao-jia', name: '赵王嘉', title: '赵嘉', reignStart: -227, reignEnd: -222 }
    ]
  },
  {
    id: 'state-wei',
    name: '魏（战国）',
    category: '春秋战国',
    startYear: -403,
    endYear: -225,
    rulers: [
      { id: 'wei-wenhou', name: '魏文侯', title: '魏斯', reignStart: -403, reignEnd: -396 },
      { id: 'wei-wuhou', name: '魏武侯', title: '魏击', reignStart: -395, reignEnd: -370 },
      { id: 'wei-huiwang', name: '魏惠王', title: '魏罃', reignStart: -369, reignEnd: -319 },
      { id: 'wei-xiangwang', name: '魏襄王', title: '魏嗣', reignStart: -318, reignEnd: -296 },
      { id: 'wei-anliwang', name: '魏安釐王', title: '魏圉', reignStart: -276, reignEnd: -243 },
      { id: 'wei-jia', name: '魏王假', title: '魏假', reignStart: -227, reignEnd: -225 }
    ]
  },
  {
    id: 'state-han',
    name: '韩（战国）',
    category: '春秋战国',
    startYear: -403,
    endYear: -230,
    rulers: [
      { id: 'han-jinghou', name: '韩景侯', title: '韩虔', reignStart: -403, reignEnd: -400 },
      { id: 'han-zhaohou', name: '韩昭侯', title: '韩武', reignStart: -362, reignEnd: -333 },
      { id: 'han-xuanhui', name: '韩宣惠王', title: '韩康', reignStart: -332, reignEnd: -312 },
      { id: 'han-xiangwang', name: '韩襄王', title: '韩仓', reignStart: -311, reignEnd: -296 },
      { id: 'han-huanhui', name: '韩桓惠王', title: '韩然', reignStart: -272, reignEnd: -239 },
      { id: 'han-wangan', name: '韩王安', title: '韩安', reignStart: -238, reignEnd: -230 }
    ]
  },
  {
    id: 'state-yan',
    name: '燕（战国）',
    category: '春秋战国',
    startYear: -1044,
    endYear: -222,
    rulers: [
      { id: 'yan-zhaowang', name: '燕昭王', title: '姬职', reignStart: -311, reignEnd: -279 },
      { id: 'yan-huiwang', name: '燕惠王', title: '姬乐资', reignStart: -278, reignEnd: -272 },
      { id: 'yan-wucheng', name: '燕武成王', title: '姬平', reignStart: -271, reignEnd: -258 },
      { id: 'yan-wangxi', name: '燕王喜', title: '姬喜', reignStart: -255, reignEnd: -222 }
    ]
  },
  {
    id: 'qin-dynasty',
    name: '秦',
    category: '秦汉三国',
    startYear: -221,
    endYear: -207,
    rulers: [
      { id: 'qin-shihuang', name: '秦始皇', title: '嬴政', birthYear: -259, deathYear: -210, reignStart: -221, reignEnd: -210, eraName: '始皇' },
      { id: 'qin-er-shi', name: '秦二世', title: '胡亥', birthYear: -230, deathYear: -207, reignStart: -210, reignEnd: -207, eraName: '二世' }
    ]
  },
  {
    id: 'western-han',
    name: '西汉',
    category: '秦汉三国',
    startYear: -202,
    endYear: 8,
    rulers: [
      { id: 'wh-gaozu', name: '汉高祖', title: '刘邦', birthYear: -256, deathYear: -195, reignStart: -202, reignEnd: -195 },
      { id: 'wh-wendi', name: '汉文帝', title: '刘恒', birthYear: -203, deathYear: -157, reignStart: -180, reignEnd: -157 },
      { id: 'wh-jingdi', name: '汉景帝', title: '刘启', birthYear: -188, deathYear: -141, reignStart: -157, reignEnd: -141 },
      { id: 'wh-wudi', name: '汉武帝', title: '刘彻', birthYear: -156, deathYear: -87, reignStart: -141, reignEnd: -87 },
      { id: 'wh-xuandi', name: '汉宣帝', title: '刘询', birthYear: -91, deathYear: -48, reignStart: -74, reignEnd: -48 },
      { id: 'wh-aidi', name: '汉哀帝', title: '刘欣', birthYear: -27, deathYear: 1, reignStart: -7, reignEnd: 1 },
      { id: 'wh-pingdi', name: '汉平帝', title: '刘衎', birthYear: -9, deathYear: 6, reignStart: 1, reignEnd: 6 }
    ]
  },
  {
    id: 'xin',
    name: '新',
    category: '秦汉三国',
    startYear: 9,
    endYear: 23,
    rulers: [{ id: 'xin-wangmang', name: '新始建国皇帝', title: '王莽', birthYear: -45, deathYear: 23, reignStart: 9, reignEnd: 23 }]
  },
  {
    id: 'eastern-han',
    name: '东汉',
    category: '秦汉三国',
    startYear: 25,
    endYear: 220,
    rulers: [
      { id: 'eh-guangwu', name: '汉光武帝', title: '刘秀', birthYear: -5, deathYear: 57, reignStart: 25, reignEnd: 57 },
      { id: 'eh-mingdi', name: '汉明帝', title: '刘庄', birthYear: 28, deathYear: 75, reignStart: 57, reignEnd: 75 },
      { id: 'eh-zhangdi', name: '汉章帝', title: '刘炟', birthYear: 57, deathYear: 88, reignStart: 75, reignEnd: 88 },
      { id: 'eh-hedi', name: '汉和帝', title: '刘肇', birthYear: 79, deathYear: 106, reignStart: 88, reignEnd: 105 },
      { id: 'eh-huandi', name: '汉桓帝', title: '刘志', birthYear: 132, deathYear: 167, reignStart: 146, reignEnd: 167 },
      { id: 'eh-lingdi', name: '汉灵帝', title: '刘宏', birthYear: 156, deathYear: 189, reignStart: 168, reignEnd: 189 },
      { id: 'eh-xiandi', name: '汉献帝', title: '刘协', birthYear: 181, deathYear: 234, reignStart: 189, reignEnd: 220 }
    ]
  },
  {
    id: 'cao-wei',
    name: '曹魏',
    category: '秦汉三国',
    startYear: 220,
    endYear: 266,
    rulers: [
      { id: 'cw-wendi', name: '魏文帝', title: '曹丕', birthYear: 187, deathYear: 226, reignStart: 220, reignEnd: 226 },
      { id: 'cw-mingdi', name: '魏明帝', title: '曹叡', birthYear: 205, deathYear: 239, reignStart: 226, reignEnd: 239 },
      { id: 'cw-qiwang', name: '魏齐王', title: '曹芳', birthYear: 232, deathYear: 274, reignStart: 239, reignEnd: 254 },
      { id: 'cw-gaogong', name: '高贵乡公', title: '曹髦', birthYear: 241, deathYear: 260, reignStart: 254, reignEnd: 260 },
      { id: 'cw-yuandi', name: '魏元帝', title: '曹奂', birthYear: 246, deathYear: 302, reignStart: 260, reignEnd: 266 }
    ]
  },
  {
    id: 'shu-han',
    name: '蜀汉',
    category: '秦汉三国',
    startYear: 221,
    endYear: 263,
    rulers: [
      { id: 'sh-zhaolie', name: '昭烈帝', title: '刘备', birthYear: 161, deathYear: 223, reignStart: 221, reignEnd: 223 },
      { id: 'sh-houzhu', name: '后主', title: '刘禅', birthYear: 207, deathYear: 271, reignStart: 223, reignEnd: 263 }
    ]
  },
  {
    id: 'sun-wu',
    name: '孙吴',
    category: '秦汉三国',
    startYear: 229,
    endYear: 280,
    rulers: [
      { id: 'sw-dadi', name: '吴大帝', title: '孙权', birthYear: 182, deathYear: 252, reignStart: 229, reignEnd: 252 },
      { id: 'sw-huiji', name: '会稽王', title: '孙亮', birthYear: 243, deathYear: 260, reignStart: 252, reignEnd: 258 },
      { id: 'sw-jingdi', name: '吴景帝', title: '孙休', birthYear: 235, deathYear: 264, reignStart: 258, reignEnd: 264 },
      { id: 'sw-modi', name: '吴末帝', title: '孙皓', birthYear: 242, deathYear: 284, reignStart: 264, reignEnd: 280 }
    ]
  },
  {
    id: 'western-jin',
    name: '西晋',
    category: '魏晋南北朝',
    startYear: 265,
    endYear: 316,
    rulers: [
      { id: 'wj-wudi', name: '晋武帝', title: '司马炎', birthYear: 236, deathYear: 290, reignStart: 265, reignEnd: 290 },
      { id: 'wj-huidi', name: '晋惠帝', title: '司马衷', birthYear: 259, deathYear: 307, reignStart: 290, reignEnd: 307 },
      { id: 'wj-huaidi', name: '晋怀帝', title: '司马炽', birthYear: 284, deathYear: 313, reignStart: 307, reignEnd: 313 },
      { id: 'wj-mindi', name: '晋愍帝', title: '司马邺', birthYear: 300, deathYear: 318, reignStart: 313, reignEnd: 316 }
    ]
  },
  {
    id: 'eastern-jin',
    name: '东晋',
    category: '魏晋南北朝',
    startYear: 317,
    endYear: 420,
    rulers: [
      { id: 'ej-yuandi', name: '晋元帝', title: '司马睿', birthYear: 276, deathYear: 323, reignStart: 317, reignEnd: 323 },
      { id: 'ej-mingdi', name: '晋明帝', title: '司马绍', birthYear: 299, deathYear: 325, reignStart: 323, reignEnd: 325 },
      { id: 'ej-chengdi', name: '晋成帝', title: '司马衍', birthYear: 321, deathYear: 342, reignStart: 325, reignEnd: 342 },
      { id: 'ej-xiaowudi', name: '晋孝武帝', title: '司马曜', birthYear: 362, deathYear: 396, reignStart: 372, reignEnd: 396 },
      { id: 'ej-gongdi', name: '晋恭帝', title: '司马德文', birthYear: 385, deathYear: 421, reignStart: 419, reignEnd: 420 }
    ]
  },
  {
    id: 'liu-song',
    name: '刘宋',
    category: '魏晋南北朝',
    startYear: 420,
    endYear: 479,
    rulers: [
      { id: 'ls-wudi', name: '宋武帝', title: '刘裕', birthYear: 363, deathYear: 422, reignStart: 420, reignEnd: 422 },
      { id: 'ls-wendi', name: '宋文帝', title: '刘义隆', birthYear: 407, deathYear: 453, reignStart: 424, reignEnd: 453 },
      { id: 'ls-xiaowudi', name: '宋孝武帝', title: '刘骏', birthYear: 430, deathYear: 464, reignStart: 453, reignEnd: 464 },
      { id: 'ls-mingdi', name: '宋明帝', title: '刘彧', birthYear: 439, deathYear: 472, reignStart: 465, reignEnd: 472 },
      { id: 'ls-shundi', name: '宋顺帝', title: '刘准', birthYear: 467, deathYear: 479, reignStart: 477, reignEnd: 479 }
    ]
  },
  {
    id: 'southern-qi',
    name: '南齐',
    category: '魏晋南北朝',
    startYear: 479,
    endYear: 502,
    rulers: [
      { id: 'sq-gaodi', name: '齐高帝', title: '萧道成', birthYear: 427, deathYear: 482, reignStart: 479, reignEnd: 482 },
      { id: 'sq-wudi', name: '齐武帝', title: '萧赜', birthYear: 440, deathYear: 493, reignStart: 482, reignEnd: 493 },
      { id: 'sq-mingdi', name: '齐明帝', title: '萧鸾', birthYear: 452, deathYear: 498, reignStart: 494, reignEnd: 498 },
      { id: 'sq-donghunhou', name: '东昏侯', title: '萧宝卷', birthYear: 483, deathYear: 501, reignStart: 498, reignEnd: 501 },
      { id: 'sq-hedi', name: '齐和帝', title: '萧宝融', birthYear: 488, deathYear: 502, reignStart: 501, reignEnd: 502 }
    ]
  },
  {
    id: 'liang',
    name: '梁',
    category: '魏晋南北朝',
    startYear: 502,
    endYear: 557,
    rulers: [
      { id: 'liang-wudi', name: '梁武帝', title: '萧衍', birthYear: 464, deathYear: 549, reignStart: 502, reignEnd: 549 },
      { id: 'liang-jianwendi', name: '梁简文帝', title: '萧纲', birthYear: 503, deathYear: 551, reignStart: 549, reignEnd: 551 },
      { id: 'liang-yuandi', name: '梁元帝', title: '萧绎', birthYear: 508, deathYear: 555, reignStart: 552, reignEnd: 554 },
      { id: 'liang-jingdi', name: '梁敬帝', title: '萧方智', birthYear: 543, deathYear: 558, reignStart: 555, reignEnd: 557 }
    ]
  },
  {
    id: 'chen',
    name: '陈',
    category: '魏晋南北朝',
    startYear: 557,
    endYear: 589,
    rulers: [
      { id: 'chen-wudi', name: '陈武帝', title: '陈霸先', birthYear: 503, deathYear: 559, reignStart: 557, reignEnd: 559 },
      { id: 'chen-wendi', name: '陈文帝', title: '陈蒨', birthYear: 522, deathYear: 566, reignStart: 560, reignEnd: 566 },
      { id: 'chen-xuandi', name: '陈宣帝', title: '陈顼', birthYear: 530, deathYear: 582, reignStart: 569, reignEnd: 582 },
      { id: 'chen-houzhu', name: '陈后主', title: '陈叔宝', birthYear: 553, deathYear: 604, reignStart: 583, reignEnd: 589 }
    ]
  },
  {
    id: 'northern-wei',
    name: '北魏',
    category: '魏晋南北朝',
    startYear: 386,
    endYear: 534,
    rulers: [
      { id: 'nw-daowudi', name: '道武帝', title: '拓跋珪', birthYear: 371, deathYear: 409, reignStart: 386, reignEnd: 409 },
      { id: 'nw-mingyuandi', name: '明元帝', title: '拓跋嗣', birthYear: 392, deathYear: 423, reignStart: 409, reignEnd: 423 },
      { id: 'nw-taiwudi', name: '太武帝', title: '拓跋焘', birthYear: 408, deathYear: 452, reignStart: 424, reignEnd: 452 },
      { id: 'nw-xiaowendi', name: '孝文帝', title: '元宏', birthYear: 467, deathYear: 499, reignStart: 471, reignEnd: 499 },
      { id: 'nw-xuanwudi', name: '宣武帝', title: '元恪', birthYear: 483, deathYear: 515, reignStart: 499, reignEnd: 515 },
      { id: 'nw-xiaomingdi', name: '孝明帝', title: '元诩', birthYear: 510, deathYear: 528, reignStart: 515, reignEnd: 528 },
      { id: 'nw-xiaowudi', name: '孝武帝', title: '元修', birthYear: 510, deathYear: 535, reignStart: 532, reignEnd: 534 }
    ]
  },
  {
    id: 'eastern-wei',
    name: '东魏',
    category: '魏晋南北朝',
    startYear: 534,
    endYear: 550,
    rulers: [{ id: 'ew-xiaojing', name: '孝静帝', title: '元善见', birthYear: 524, deathYear: 552, reignStart: 534, reignEnd: 550 }]
  },
  {
    id: 'western-wei',
    name: '西魏',
    category: '魏晋南北朝',
    startYear: 535,
    endYear: 557,
    rulers: [
      { id: 'ww-wendi', name: '文帝', title: '元宝炬', birthYear: 507, deathYear: 551, reignStart: 535, reignEnd: 551 },
      { id: 'ww-feidi', name: '废帝', title: '元钦', birthYear: 525, deathYear: 554, reignStart: 552, reignEnd: 554 },
      { id: 'ww-gongdi', name: '恭帝', title: '元廓', birthYear: 537, deathYear: 557, reignStart: 554, reignEnd: 557 }
    ]
  },
  {
    id: 'northern-qi',
    name: '北齐',
    category: '魏晋南北朝',
    startYear: 550,
    endYear: 577,
    rulers: [
      { id: 'nq-wenxuan', name: '文宣帝', title: '高洋', birthYear: 529, deathYear: 559, reignStart: 550, reignEnd: 559 },
      { id: 'nq-xiaozhao', name: '孝昭帝', title: '高演', birthYear: 535, deathYear: 561, reignStart: 560, reignEnd: 561 },
      { id: 'nq-wucheng', name: '武成帝', title: '高湛', birthYear: 537, deathYear: 569, reignStart: 561, reignEnd: 565 },
      { id: 'nq-houzhu', name: '后主', title: '高纬', birthYear: 556, deathYear: 577, reignStart: 565, reignEnd: 577 }
    ]
  },
  {
    id: 'northern-zhou',
    name: '北周',
    category: '魏晋南北朝',
    startYear: 557,
    endYear: 581,
    rulers: [
      { id: 'nz-xiaomin', name: '孝闵帝', title: '宇文觉', birthYear: 542, deathYear: 557, reignStart: 557, reignEnd: 557 },
      { id: 'nz-mingdi', name: '明帝', title: '宇文毓', birthYear: 534, deathYear: 560, reignStart: 557, reignEnd: 560 },
      { id: 'nz-wudi', name: '武帝', title: '宇文邕', birthYear: 543, deathYear: 578, reignStart: 560, reignEnd: 578 },
      { id: 'nz-xuandi', name: '宣帝', title: '宇文赟', birthYear: 559, deathYear: 580, reignStart: 578, reignEnd: 579 },
      { id: 'nz-jingdi', name: '静帝', title: '宇文阐', birthYear: 573, deathYear: 581, reignStart: 579, reignEnd: 581 }
    ]
  },
  {
    id: 'sui',
    name: '隋',
    category: '隋唐五代十国',
    startYear: 581,
    endYear: 618,
    rulers: [
      { id: 'sui-wendi', name: '隋文帝', title: '杨坚', birthYear: 541, deathYear: 604, reignStart: 581, reignEnd: 604, eraName: '开皇' },
      { id: 'sui-yangdi', name: '隋炀帝', title: '杨广', birthYear: 569, deathYear: 618, reignStart: 604, reignEnd: 618, eraName: '大业' },
      { id: 'sui-gongdi', name: '隋恭帝', title: '杨侑', birthYear: 605, deathYear: 619, reignStart: 617, reignEnd: 618, eraName: '义宁' }
    ]
  },
  {
    id: 'tang',
    name: '唐',
    category: '隋唐五代十国',
    startYear: 618,
    endYear: 907,
    rulers: [
      { id: 'tang-gaozu', name: '唐高祖', title: '李渊', birthYear: 566, deathYear: 635, reignStart: 618, reignEnd: 626, eraName: '武德' },
      { id: 'tang-taizong', name: '唐太宗', title: '李世民', birthYear: 598, deathYear: 649, reignStart: 626, reignEnd: 649, eraName: '贞观' },
      { id: 'tang-gaozong', name: '唐高宗', title: '李治', birthYear: 628, deathYear: 683, reignStart: 649, reignEnd: 683, eraName: '永徽等' },
      { id: 'tang-xuanzong', name: '唐玄宗', title: '李隆基', birthYear: 685, deathYear: 762, reignStart: 712, reignEnd: 756, eraName: '开元、天宝' },
      { id: 'tang-suzong', name: '唐肃宗', title: '李亨', birthYear: 711, deathYear: 762, reignStart: 756, reignEnd: 762, eraName: '至德等' },
      { id: 'tang-daizong', name: '唐代宗', title: '李豫', birthYear: 726, deathYear: 779, reignStart: 762, reignEnd: 779, eraName: '大历等' },
      { id: 'tang-xianzong', name: '唐宪宗', title: '李纯', birthYear: 778, deathYear: 820, reignStart: 805, reignEnd: 820, eraName: '元和' },
      { id: 'tang-zhaozong', name: '唐昭宗', title: '李晔', birthYear: 867, deathYear: 904, reignStart: 888, reignEnd: 904, eraName: '龙纪等' },
      { id: 'tang-aidi', name: '唐哀帝', title: '李柷', birthYear: 892, deathYear: 908, reignStart: 904, reignEnd: 907, eraName: '天祐' }
    ]
  },
  {
    id: 'wu-zhou',
    name: '武周',
    category: '隋唐五代十国',
    startYear: 690,
    endYear: 705,
    rulers: [{ id: 'wz-wuzetian', name: '武则天', title: '武曌', birthYear: 624, deathYear: 705, reignStart: 690, reignEnd: 705 }]
  },
  {
    id: 'later-liang',
    name: '后梁',
    category: '隋唐五代十国',
    startYear: 907,
    endYear: 923,
    rulers: [
      { id: 'll-taizu', name: '后梁太祖', title: '朱温', birthYear: 852, deathYear: 912, reignStart: 907, reignEnd: 912 },
      { id: 'll-modi', name: '后梁末帝', title: '朱友贞', birthYear: 888, deathYear: 923, reignStart: 913, reignEnd: 923 }
    ]
  },
  {
    id: 'later-tang',
    name: '后唐',
    category: '隋唐五代十国',
    startYear: 923,
    endYear: 936,
    rulers: [
      { id: 'lt-zhuangzong', name: '后唐庄宗', title: '李存勖', birthYear: 885, deathYear: 926, reignStart: 923, reignEnd: 926 },
      { id: 'lt-mingzong', name: '后唐明宗', title: '李嗣源', birthYear: 867, deathYear: 933, reignStart: 926, reignEnd: 933 },
      { id: 'lt-mindi', name: '后唐闵帝', title: '李从厚', birthYear: 914, deathYear: 934, reignStart: 933, reignEnd: 934 },
      { id: 'lt-modi', name: '后唐末帝', title: '李从珂', birthYear: 885, deathYear: 937, reignStart: 934, reignEnd: 936 }
    ]
  },
  {
    id: 'later-jin',
    name: '后晋',
    category: '隋唐五代十国',
    startYear: 936,
    endYear: 947,
    rulers: [
      { id: 'lj-gaozu', name: '后晋高祖', title: '石敬瑭', birthYear: 892, deathYear: 942, reignStart: 936, reignEnd: 942 },
      { id: 'lj-chudi', name: '后晋出帝', title: '石重贵', birthYear: 914, deathYear: 974, reignStart: 942, reignEnd: 947 }
    ]
  },
  {
    id: 'later-han',
    name: '后汉',
    category: '隋唐五代十国',
    startYear: 947,
    endYear: 951,
    rulers: [
      { id: 'lh-gaozu', name: '后汉高祖', title: '刘知远', birthYear: 895, deathYear: 948, reignStart: 947, reignEnd: 948 },
      { id: 'lh-yindi', name: '后汉隐帝', title: '刘承祐', birthYear: 930, deathYear: 951, reignStart: 948, reignEnd: 951 }
    ]
  },
  {
    id: 'later-zhou',
    name: '后周',
    category: '隋唐五代十国',
    startYear: 951,
    endYear: 960,
    rulers: [
      { id: 'lz-taizu', name: '后周太祖', title: '郭威', birthYear: 904, deathYear: 954, reignStart: 951, reignEnd: 954 },
      { id: 'lz-shizong', name: '后周世宗', title: '柴荣', birthYear: 921, deathYear: 959, reignStart: 954, reignEnd: 959 },
      { id: 'lz-gongdi', name: '后周恭帝', title: '柴宗训', birthYear: 953, deathYear: 973, reignStart: 959, reignEnd: 960 }
    ]
  },
  {
    id: 'ten-wu',
    name: '吴（十国）',
    category: '隋唐五代十国',
    startYear: 902,
    endYear: 937,
    rulers: [
      { id: 'tw-yangxingmi', name: '吴太祖', title: '杨行密', birthYear: 852, deathYear: 905, reignStart: 902, reignEnd: 905 },
      { id: 'tw-yanglongyan', name: '吴高祖', title: '杨隆演', birthYear: 897, deathYear: 920, reignStart: 908, reignEnd: 920 },
      { id: 'tw-yangpu', name: '吴睿帝', title: '杨溥', birthYear: 900, deathYear: 938, reignStart: 920, reignEnd: 937 }
    ]
  },
  {
    id: 'ten-min',
    name: '闽',
    category: '隋唐五代十国',
    startYear: 909,
    endYear: 945,
    rulers: [
      { id: 'tm-wangshen', name: '闽太祖', title: '王审知', birthYear: 862, deathYear: 925, reignStart: 909, reignEnd: 925 },
      { id: 'tm-yanjun', name: '闽惠宗', title: '王延钧', birthYear: 897, deathYear: 935, reignStart: 933, reignEnd: 935 },
      { id: 'tm-yanxi', name: '闽景宗', title: '王延曦', birthYear: 911, deathYear: 944, reignStart: 939, reignEnd: 944 }
    ]
  },
  {
    id: 'ten-chu',
    name: '楚（十国）',
    category: '隋唐五代十国',
    startYear: 907,
    endYear: 951,
    rulers: [
      { id: 'tc-mayin', name: '楚武穆王', title: '马殷', birthYear: 852, deathYear: 930, reignStart: 907, reignEnd: 930 },
      { id: 'tc-maxifan', name: '楚文昭王', title: '马希范', birthYear: 899, deathYear: 947, reignStart: 932, reignEnd: 947 },
      { id: 'tc-maxiguang', name: '楚废王', title: '马希广', birthYear: 911, deathYear: 951, reignStart: 947, reignEnd: 951 }
    ]
  },
  {
    id: 'ten-jingnan',
    name: '荆南（南平）',
    category: '隋唐五代十国',
    startYear: 924,
    endYear: 963,
    rulers: [
      { id: 'tj-gaojixing', name: '荆南武信王', title: '高季兴', birthYear: 858, deathYear: 929, reignStart: 924, reignEnd: 929 },
      { id: 'tj-gaoconghui', name: '荆南文献王', title: '高从诲', birthYear: 891, deathYear: 948, reignStart: 929, reignEnd: 948 },
      { id: 'tj-gaojichong', name: '荆南后主', title: '高继冲', birthYear: 943, deathYear: 994, reignStart: 962, reignEnd: 963 }
    ]
  },
  {
    id: 'ten-southern-tang',
    name: '南唐',
    category: '隋唐五代十国',
    startYear: 937,
    endYear: 975,
    rulers: [
      { id: 'st-liezu', name: '南唐烈祖', title: '李昪', birthYear: 888, deathYear: 943, reignStart: 937, reignEnd: 943 },
      { id: 'st-zhongzhu', name: '南唐元宗', title: '李璟', birthYear: 916, deathYear: 961, reignStart: 943, reignEnd: 961 },
      { id: 'st-houzhu', name: '南唐后主', title: '李煜', birthYear: 937, deathYear: 978, reignStart: 961, reignEnd: 975 }
    ]
  },
  {
    id: 'ten-wuyue',
    name: '吴越',
    category: '隋唐五代十国',
    startYear: 907,
    endYear: 978,
    rulers: [
      { id: 'wy-qianliu', name: '吴越武肃王', title: '钱镠', birthYear: 852, deathYear: 932, reignStart: 907, reignEnd: 932 },
      { id: 'wy-qianyuanguan', name: '吴越文穆王', title: '钱元瓘', birthYear: 887, deathYear: 941, reignStart: 932, reignEnd: 941 },
      { id: 'wy-qianhongchu', name: '吴越忠懿王', title: '钱弘俶', birthYear: 929, deathYear: 988, reignStart: 948, reignEnd: 978 }
    ]
  },
  {
    id: 'ten-former-shu',
    name: '前蜀',
    category: '隋唐五代十国',
    startYear: 907,
    endYear: 925,
    rulers: [
      { id: 'fs-wangjian', name: '前蜀高祖', title: '王建', birthYear: 847, deathYear: 918, reignStart: 907, reignEnd: 918 },
      { id: 'fs-wangyan', name: '前蜀后主', title: '王衍', birthYear: 899, deathYear: 926, reignStart: 918, reignEnd: 925 }
    ]
  },
  {
    id: 'ten-later-shu',
    name: '后蜀',
    category: '隋唐五代十国',
    startYear: 934,
    endYear: 965,
    rulers: [
      { id: 'ls-mengzhixiang', name: '后蜀高祖', title: '孟知祥', birthYear: 874, deathYear: 934, reignStart: 934, reignEnd: 934 },
      { id: 'ls-mengchang', name: '后蜀后主', title: '孟昶', birthYear: 919, deathYear: 965, reignStart: 934, reignEnd: 965 }
    ]
  },
  {
    id: 'ten-southern-han',
    name: '南汉',
    category: '隋唐五代十国',
    startYear: 917,
    endYear: 971,
    rulers: [
      { id: 'nh-liuyan', name: '南汉高祖', title: '刘䶮', birthYear: 889, deathYear: 942, reignStart: 917, reignEnd: 942 },
      { id: 'nh-liusheng', name: '南汉中宗', title: '刘晟', birthYear: 920, deathYear: 958, reignStart: 943, reignEnd: 958 },
      { id: 'nh-liuchang', name: '南汉后主', title: '刘鋹', birthYear: 943, deathYear: 980, reignStart: 958, reignEnd: 971 }
    ]
  },
  {
    id: 'ten-northern-han',
    name: '北汉',
    category: '隋唐五代十国',
    startYear: 951,
    endYear: 979,
    rulers: [
      { id: 'nhan-liuchong', name: '北汉世祖', title: '刘崇', birthYear: 895, deathYear: 954, reignStart: 951, reignEnd: 954 },
      { id: 'nhan-liuchengjun', name: '北汉睿宗', title: '刘承钧', birthYear: 926, deathYear: 968, reignStart: 954, reignEnd: 968 },
      { id: 'nhan-liujiyuan', name: '北汉英武帝', title: '刘继元', birthYear: 943, deathYear: 991, reignStart: 968, reignEnd: 979 }
    ]
  },
  {
    id: 'liao',
    name: '辽',
    category: '宋辽夏金元',
    startYear: 916,
    endYear: 1125,
    rulers: [
      { id: 'liao-taizu', name: '辽太祖', title: '耶律阿保机', birthYear: 872, deathYear: 926, reignStart: 916, reignEnd: 926 },
      { id: 'liao-taizong', name: '辽太宗', title: '耶律德光', birthYear: 902, deathYear: 947, reignStart: 926, reignEnd: 947 },
      { id: 'liao-shengzong', name: '辽圣宗', title: '耶律隆绪', birthYear: 971, deathYear: 1031, reignStart: 982, reignEnd: 1031 },
      { id: 'liao-xingzong', name: '辽兴宗', title: '耶律宗真', birthYear: 1016, deathYear: 1055, reignStart: 1031, reignEnd: 1055 },
      { id: 'liao-daozong', name: '辽道宗', title: '耶律洪基', birthYear: 1032, deathYear: 1101, reignStart: 1055, reignEnd: 1101 },
      { id: 'liao-tianzuo', name: '辽天祚帝', title: '耶律延禧', birthYear: 1075, deathYear: 1128, reignStart: 1101, reignEnd: 1125 }
    ]
  },
  {
    id: 'western-xia',
    name: '西夏',
    category: '宋辽夏金元',
    startYear: 1038,
    endYear: 1227,
    rulers: [
      { id: 'xx-jingzong', name: '西夏景宗', title: '李元昊', birthYear: 1003, deathYear: 1048, reignStart: 1038, reignEnd: 1048 },
      { id: 'xx-yizong', name: '西夏毅宗', title: '李谅祚', birthYear: 1047, deathYear: 1067, reignStart: 1048, reignEnd: 1067 },
      { id: 'xx-huizong', name: '西夏惠宗', title: '李秉常', birthYear: 1061, deathYear: 1086, reignStart: 1067, reignEnd: 1086 },
      { id: 'xx-chongzong', name: '西夏崇宗', title: '李乾顺', birthYear: 1083, deathYear: 1139, reignStart: 1086, reignEnd: 1139 },
      { id: 'xx-renzong', name: '西夏仁宗', title: '李仁孝', birthYear: 1124, deathYear: 1193, reignStart: 1139, reignEnd: 1193 },
      { id: 'xx-shenzong', name: '西夏神宗', title: '李遵顼', birthYear: 1163, deathYear: 1226, reignStart: 1211, reignEnd: 1223 },
      { id: 'xx-modi', name: '西夏末帝', title: '李睍', reignStart: 1226, reignEnd: 1227 }
    ]
  },
  {
    id: 'jin-dynasty',
    name: '金',
    category: '宋辽夏金元',
    startYear: 1115,
    endYear: 1234,
    rulers: [
      { id: 'jin-taizu', name: '金太祖', title: '完颜阿骨打', birthYear: 1068, deathYear: 1123, reignStart: 1115, reignEnd: 1123 },
      { id: 'jin-taizong', name: '金太宗', title: '完颜晟', birthYear: 1075, deathYear: 1135, reignStart: 1123, reignEnd: 1135 },
      { id: 'jin-xizong', name: '金熙宗', title: '完颜亶', birthYear: 1119, deathYear: 1149, reignStart: 1135, reignEnd: 1149 },
      { id: 'jin-shizong', name: '金世宗', title: '完颜雍', birthYear: 1123, deathYear: 1189, reignStart: 1161, reignEnd: 1189 },
      { id: 'jin-zhangzong', name: '金章宗', title: '完颜璟', birthYear: 1168, deathYear: 1208, reignStart: 1189, reignEnd: 1208 },
      { id: 'jin-xuanzong', name: '金宣宗', title: '完颜珣', birthYear: 1163, deathYear: 1224, reignStart: 1213, reignEnd: 1224 },
      { id: 'jin-aizong', name: '金哀宗', title: '完颜守绪', birthYear: 1198, deathYear: 1234, reignStart: 1224, reignEnd: 1234 }
    ]
  },
  {
    id: 'northern-song',
    name: '北宋',
    category: '宋辽夏金元',
    startYear: 960,
    endYear: 1127,
    rulers: [
      { id: 'ns-taizu', name: '宋太祖', title: '赵匡胤', birthYear: 927, deathYear: 976, reignStart: 960, reignEnd: 976 },
      { id: 'ns-taizong', name: '宋太宗', title: '赵炅', birthYear: 939, deathYear: 997, reignStart: 976, reignEnd: 997 },
      { id: 'ns-zhenzong', name: '宋真宗', title: '赵恒', birthYear: 968, deathYear: 1022, reignStart: 997, reignEnd: 1022 },
      { id: 'ns-renzong', name: '宋仁宗', title: '赵祯', birthYear: 1010, deathYear: 1063, reignStart: 1022, reignEnd: 1063 },
      { id: 'ns-shenzong', name: '宋神宗', title: '赵顼', birthYear: 1048, deathYear: 1085, reignStart: 1067, reignEnd: 1085 },
      { id: 'ns-huizong', name: '宋徽宗', title: '赵佶', birthYear: 1082, deathYear: 1135, reignStart: 1100, reignEnd: 1126 },
      { id: 'ns-qinzong', name: '宋钦宗', title: '赵桓', birthYear: 1100, deathYear: 1161, reignStart: 1126, reignEnd: 1127 }
    ]
  },
  {
    id: 'southern-song',
    name: '南宋',
    category: '宋辽夏金元',
    startYear: 1127,
    endYear: 1279,
    rulers: [
      { id: 'ss-gaozong', name: '宋高宗', title: '赵构', birthYear: 1107, deathYear: 1187, reignStart: 1127, reignEnd: 1162 },
      { id: 'ss-xiaozong', name: '宋孝宗', title: '赵昚', birthYear: 1127, deathYear: 1194, reignStart: 1162, reignEnd: 1189 },
      { id: 'ss-ningzong', name: '宋宁宗', title: '赵扩', birthYear: 1168, deathYear: 1224, reignStart: 1194, reignEnd: 1224 },
      { id: 'ss-lizong', name: '宋理宗', title: '赵昀', birthYear: 1205, deathYear: 1264, reignStart: 1224, reignEnd: 1264 },
      { id: 'ss-duzong', name: '宋度宗', title: '赵禥', birthYear: 1240, deathYear: 1274, reignStart: 1264, reignEnd: 1274 },
      { id: 'ss-gongdi', name: '宋恭帝', title: '赵㬎', birthYear: 1271, deathYear: 1323, reignStart: 1274, reignEnd: 1276 },
      { id: 'ss-bing', name: '宋帝昺', title: '赵昺', birthYear: 1272, deathYear: 1279, reignStart: 1278, reignEnd: 1279 }
    ]
  },
  {
    id: 'yuan',
    name: '元',
    category: '宋辽夏金元',
    startYear: 1271,
    endYear: 1368,
    rulers: [
      { id: 'yuan-shizu', name: '元世祖', title: '忽必烈', birthYear: 1215, deathYear: 1294, reignStart: 1260, reignEnd: 1294 },
      { id: 'yuan-chengzong', name: '元成宗', title: '铁穆耳', birthYear: 1265, deathYear: 1307, reignStart: 1294, reignEnd: 1307 },
      { id: 'yuan-wuzong', name: '元武宗', title: '海山', birthYear: 1281, deathYear: 1311, reignStart: 1307, reignEnd: 1311 },
      { id: 'yuan-renzong', name: '元仁宗', title: '爱育黎拔力八达', birthYear: 1285, deathYear: 1320, reignStart: 1311, reignEnd: 1320 },
      { id: 'yuan-wenzong', name: '元文宗', title: '图帖睦尔', birthYear: 1304, deathYear: 1332, reignStart: 1328, reignEnd: 1332 },
      { id: 'yuan-huizong', name: '元惠宗', title: '妥懽帖睦尔', birthYear: 1320, deathYear: 1370, reignStart: 1333, reignEnd: 1368 }
    ]
  },
  {
    id: 'ming',
    name: '明',
    category: '明清',
    startYear: 1368,
    endYear: 1644,
    rulers: [
      { id: 'ming-taizu', name: '明太祖', title: '朱元璋', birthYear: 1328, deathYear: 1398, reignStart: 1368, reignEnd: 1398, eraName: '洪武' },
      { id: 'ming-jianwen', name: '建文帝', title: '朱允炆', birthYear: 1377, deathYear: 1402, reignStart: 1398, reignEnd: 1402, eraName: '建文' },
      { id: 'ming-chengzu', name: '明成祖', title: '朱棣', birthYear: 1360, deathYear: 1424, reignStart: 1402, reignEnd: 1424, eraName: '永乐' },
      { id: 'ming-xuanzong', name: '明宣宗', title: '朱瞻基', birthYear: 1399, deathYear: 1435, reignStart: 1425, reignEnd: 1435, eraName: '宣德' },
      { id: 'ming-xiaozong', name: '明孝宗', title: '朱祐樘', birthYear: 1470, deathYear: 1505, reignStart: 1487, reignEnd: 1505, eraName: '弘治' },
      { id: 'ming-shizong', name: '明世宗', title: '朱厚熜', birthYear: 1507, deathYear: 1567, reignStart: 1521, reignEnd: 1567, eraName: '嘉靖' },
      { id: 'ming-shenzong', name: '明神宗', title: '朱翊钧', birthYear: 1563, deathYear: 1620, reignStart: 1572, reignEnd: 1620, eraName: '万历' },
      { id: 'ming-sizong', name: '明思宗', title: '朱由检', birthYear: 1611, deathYear: 1644, reignStart: 1627, reignEnd: 1644, eraName: '崇祯' }
    ]
  },
  {
    id: 'qing',
    name: '清',
    category: '明清',
    startYear: 1636,
    endYear: 1912,
    rulers: [
      { id: 'qing-taizong', name: '清太宗', title: '皇太极', birthYear: 1592, deathYear: 1643, reignStart: 1636, reignEnd: 1643 },
      { id: 'qing-shunzhi', name: '顺治帝', title: '福临', birthYear: 1638, deathYear: 1661, reignStart: 1644, reignEnd: 1661 },
      { id: 'qing-kangxi', name: '康熙帝', title: '玄烨', birthYear: 1654, deathYear: 1722, reignStart: 1661, reignEnd: 1722 },
      { id: 'qing-yongzheng', name: '雍正帝', title: '胤禛', birthYear: 1678, deathYear: 1735, reignStart: 1722, reignEnd: 1735 },
      { id: 'qing-qianlong', name: '乾隆帝', title: '弘历', birthYear: 1711, deathYear: 1799, reignStart: 1735, reignEnd: 1796 },
      { id: 'qing-jiaqing', name: '嘉庆帝', title: '颙琰', birthYear: 1760, deathYear: 1820, reignStart: 1796, reignEnd: 1820 },
      { id: 'qing-daoguang', name: '道光帝', title: '旻宁', birthYear: 1782, deathYear: 1850, reignStart: 1820, reignEnd: 1850 },
      { id: 'qing-xianfeng', name: '咸丰帝', title: '奕詝', birthYear: 1831, deathYear: 1861, reignStart: 1850, reignEnd: 1861 },
      { id: 'qing-tongzhi', name: '同治帝', title: '载淳', birthYear: 1856, deathYear: 1875, reignStart: 1861, reignEnd: 1875 },
      { id: 'qing-guangxu', name: '光绪帝', title: '载湉', birthYear: 1871, deathYear: 1908, reignStart: 1875, reignEnd: 1908 },
      { id: 'qing-xuantong', name: '宣统帝', title: '溥仪', birthYear: 1906, deathYear: 1967, reignStart: 1908, reignEnd: 1912 }
    ]
  }
]
