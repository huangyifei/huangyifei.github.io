// 汉字字库数据
// 每个汉字包含：字符、笔画数、笔顺路径数据

const CHARACTER_DATA = {
    '人': {
        char: '人',
        strokeCount: 2,
        strokes: [
            // 第一笔：撇
            [
                { x: 180, y: 80 },
                { x: 170, y: 100 },
                { x: 160, y: 120 },
                { x: 150, y: 140 },
                { x: 140, y: 160 },
                { x: 130, y: 180 },
                { x: 120, y: 200 },
                { x: 110, y: 220 }
            ],
            // 第二笔：捺
            [
                { x: 120, y: 80 },
                { x: 130, y: 100 },
                { x: 140, y: 120 },
                { x: 150, y: 140 },
                { x: 160, y: 160 },
                { x: 170, y: 180 },
                { x: 180, y: 200 },
                { x: 190, y: 220 }
            ]
        ]
    },
    
    '大': {
        char: '大',
        strokeCount: 3,
        strokes: [
            // 第一笔：横
            [
                { x: 100, y: 100 },
                { x: 200, y: 100 }
            ],
            // 第二笔：撇
            [
                { x: 150, y: 100 },
                { x: 140, y: 130 },
                { x: 130, y: 160 },
                { x: 120, y: 190 },
                { x: 110, y: 220 }
            ],
            // 第三笔：捺
            [
                { x: 150, y: 100 },
                { x: 160, y: 130 },
                { x: 170, y: 160 },
                { x: 180, y: 190 },
                { x: 190, y: 220 }
            ]
        ]
    },
    
    '小': {
        char: '小',
        strokeCount: 3,
        strokes: [
            // 第一笔：竖钩
            [
                { x: 150, y: 80 },
                { x: 150, y: 180 },
                { x: 160, y: 190 }
            ],
            // 第二笔：左点
            [
                { x: 130, y: 120 },
                { x: 135, y: 130 }
            ],
            // 第三笔：右点
            [
                { x: 170, y: 120 },
                { x: 165, y: 130 }
            ]
        ]
    },
    
    '山': {
        char: '山',
        strokeCount: 3,
        strokes: [
            // 第一笔：竖
            [
                { x: 150, y: 80 },
                { x: 150, y: 220 }
            ],
            // 第二笔：竖
            [
                { x: 120, y: 120 },
                { x: 120, y: 220 }
            ],
            // 第三笔：竖
            [
                { x: 180, y: 120 },
                { x: 180, y: 220 }
            ]
        ]
    },
    
    '水': {
        char: '水',
        strokeCount: 4,
        strokes: [
            // 第一笔：竖钩
            [
                { x: 150, y: 60 },
                { x: 150, y: 180 },
                { x: 160, y: 190 }
            ],
            // 第二笔：横撇
            [
                { x: 120, y: 120 },
                { x: 150, y: 120 },
                { x: 140, y: 140 },
                { x: 130, y: 160 }
            ],
            // 第三笔：撇
            [
                { x: 170, y: 140 },
                { x: 160, y: 160 },
                { x: 150, y: 180 }
            ],
            // 第四笔：捺
            [
                { x: 150, y: 160 },
                { x: 160, y: 180 },
                { x: 170, y: 200 },
                { x: 180, y: 220 }
            ]
        ]
    },
    
    '火': {
        char: '火',
        strokeCount: 4,
        strokes: [
            // 第一笔：点
            [
                { x: 150, y: 70 },
                { x: 155, y: 80 }
            ],
            // 第二笔：撇
            [
                { x: 130, y: 100 },
                { x: 120, y: 130 },
                { x: 110, y: 160 },
                { x: 100, y: 190 }
            ],
            // 第三笔：捺
            [
                { x: 170, y: 100 },
                { x: 180, y: 130 },
                { x: 190, y: 160 },
                { x: 200, y: 190 }
            ],
            // 第四笔：点
            [
                { x: 150, y: 140 },
                { x: 155, y: 150 }
            ]
        ]
    },
    
    '土': {
        char: '土',
        strokeCount: 3,
        strokes: [
            // 第一笔：横
            [
                { x: 120, y: 120 },
                { x: 180, y: 120 }
            ],
            // 第二笔：竖
            [
                { x: 150, y: 100 },
                { x: 150, y: 180 }
            ],
            // 第三笔：横
            [
                { x: 130, y: 180 },
                { x: 170, y: 180 }
            ]
        ]
    },
    
    '木': {
        char: '木',
        strokeCount: 4,
        strokes: [
            // 第一笔：横
            [
                { x: 120, y: 120 },
                { x: 180, y: 120 }
            ],
            // 第二笔：竖
            [
                { x: 150, y: 80 },
                { x: 150, y: 200 }
            ],
            // 第三笔：撇
            [
                { x: 150, y: 140 },
                { x: 130, y: 180 },
                { x: 120, y: 200 }
            ],
            // 第四笔：捺
            [
                { x: 150, y: 140 },
                { x: 170, y: 180 },
                { x: 180, y: 200 }
            ]
        ]
    },
    
    '金': {
        char: '金',
        strokeCount: 8,
        strokes: [
            // 第一笔：撇
            [
                { x: 120, y: 60 },
                { x: 110, y: 80 },
                { x: 100, y: 100 }
            ],
            // 第二笔：横
            [
                { x: 110, y: 80 },
                { x: 150, y: 80 }
            ],
            // 第三笔：横
            [
                { x: 120, y: 100 },
                { x: 180, y: 100 }
            ],
            // 第四笔：竖
            [
                { x: 150, y: 80 },
                { x: 150, y: 130 }
            ],
            // 第五笔：横
            [
                { x: 130, y: 130 },
                { x: 170, y: 130 }
            ],
            // 第六笔：竖
            [
                { x: 130, y: 120 },
                { x: 130, y: 160 }
            ],
            // 第七笔：竖
            [
                { x: 170, y: 120 },
                { x: 170, y: 160 }
            ],
            // 第八笔：横
            [
                { x: 120, y: 160 },
                { x: 180, y: 160 }
            ]
        ]
    }
};

// 获取所有可用字符
function getAvailableCharacters() {
    return Object.keys(CHARACTER_DATA);
}

// 获取指定字符的数据
function getCharacterData(char) {
    return CHARACTER_DATA[char] || null;
}

// 获取随机字符
function getRandomCharacter() {
    const chars = getAvailableCharacters();
    const randomIndex = Math.floor(Math.random() * chars.length);
    return chars[randomIndex];
}

// 导出数据（如果在Node.js环境中使用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CHARACTER_DATA,
        getAvailableCharacters,
        getCharacterData,
        getRandomCharacter
    };
}