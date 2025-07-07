/**
 * 汉字笔顺练习 - 完整实现
 * 功能：
 * 1. 随机选择汉字并展示笔顺动画
 * 2. 允许用户在田字格中书写
 * 3. 检查笔顺正确性
 * 4. 提供反馈和清空功能
 */

document.addEventListener('DOMContentLoaded', function() {
    // ==================== 汉字数据库 ====================
    const hanziDatabase = [
        {
            character: "人",
            strokes: 2,
            strokeOrder: [
                {path: "M30 20 L10 80", duration: 1000}, // 第一笔：撇
                {path: "M70 20 L50 80", duration: 1000}  // 第二笔：捺
            ],
            gridSize: 100
        },
       // {
       //     character: "木",
       //     strokes: 4,
       //     strokeOrder: [
       //         {path: "M50 20 L50 80", duration: 800},  // 第一笔：竖
       //         {path: "M30 50 L70 50", duration: 600},  // 第二笔：横
       //         {path: "M30 20 L50 50", duration: 700}, // 第三笔：撇
       //         {path: "M50 50 L70 20", duration: 700}   // 第四笔：捺
       //     ],
       //     gridSize: 100
       // },
       // {
       //     character: "水",
       //     strokes: 4,
       //     strokeOrder: [
       //         {path: "M50 20 L50 35", duration: 400},  // 第一笔：竖钩
       //         {path: "M30 40 L70 40", duration: 600},  // 第二笔：横撇
       //         {path: "M35 60 L50 40", duration: 700},  // 第三笔：撇
       //         {path: "M65 60 L50 40", duration: 700}   // 第四笔：捺
       //     ],
       //     gridSize: 100
       // },
       // {
       //     character: "火",
       //     strokes: 4,
       //     strokeOrder: [
       //         {path: "M30 50 L70 50", duration: 600},  // 第一笔：点
       //         {path: "M70 50 L50 20", duration: 700},  // 第二笔：撇
       //         {path: "M50 20 L30 80", duration: 800},  // 第三笔：竖撇
       //         {path: "M30 80 L70 80", duration: 800}   // 第四笔：捺
       //     ],
       //     gridSize: 100
       // },
       // {
       //     character: "日",
       //     strokes: 4,
       //     strokeOrder: [
       //         {path: "M30 30 L70 30", duration: 600},  // 第一笔：竖
       //         {path: "M70 30 L70 70", duration: 600},   // 第二笔：横折
       //         {path: "M70 70 L30 70", duration: 600},   // 第三笔：横
       //         {path: "M30 70 L30 30", duration: 600}    // 第四笔：横
       //     ],
       //     gridSize: 100
       // }
    ];

    // ==================== DOM元素 ====================
    const demoGrid = document.getElementById('demo-grid');
    const demoCanvas = document.getElementById('demo-canvas');
    const practiceGrid = document.getElementById('practice-grid');
    const practiceCanvas = document.getElementById('practice-canvas');
    const replayBtn = document.getElementById('replay-btn');
    const clearBtn = document.getElementById('clear-btn');
    const nextBtn = document.getElementById('next-btn');
    const feedbackEl = document.getElementById('feedback');

    // ==================== 状态变量 ====================
    let currentCharacter = null;
    let userStrokes = [];
    let currentStroke = null;
    let isDrawing = false;
    let currentStrokeIndex = 0;

    // ==================== 初始化 ====================
    init();

    function init() {
        // 随机选择一个汉字
        selectRandomCharacter();
        
        // 设置事件监听器
        replayBtn.addEventListener('click', replayDemo);
        clearBtn.addEventListener('click', clearPracticeArea);
        nextBtn.addEventListener('click', selectRandomCharacter);
        
        // 练习区绘图事件
        practiceCanvas.addEventListener('mousedown', startStroke);
        practiceCanvas.addEventListener('mousemove', drawStroke);
        practiceCanvas.addEventListener('mouseup', endStroke);
        practiceCanvas.addEventListener('mouseleave', endStroke);
        
        // 触摸设备支持
        practiceCanvas.addEventListener('touchstart', handleTouchStart);
        practiceCanvas.addEventListener('touchmove', handleTouchMove);
        practiceCanvas.addEventListener('touchend', handleTouchEnd);
        
        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes dash {
                to {
                    stroke-dashoffset: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ==================== 主要功能函数 ====================

    function selectRandomCharacter() {
        // 清空反馈
        feedbackEl.textContent = '请观察上方笔顺示范';
        feedbackEl.className = 'feedback';
        
        // 清空用户笔画
        userStrokes = [];
        clearCanvas(practiceCanvas);
        
        // 随机选择汉字
        const randomIndex = Math.floor(Math.random() * hanziDatabase.length);
        console.log(randomIndex)
        currentCharacter = hanziDatabase[randomIndex];
        
        // 设置田字格大小
        const size = currentCharacter.gridSize;
        demoGrid.style.width = practiceGrid.style.width = `${size}px`;
        demoGrid.style.height = practiceGrid.style.height = `${size}px`;
        demoCanvas.setAttribute('width', size);
        demoCanvas.setAttribute('height', size);
        demoCanvas.setAttribute('viewBox', `0 0 ${size} ${size}`);
        practiceCanvas.setAttribute('width', size);
        practiceCanvas.setAttribute('height', size);
        practiceCanvas.setAttribute('viewBox', `0 0 ${size} ${size}`);
        
        // 更新田字格背景
        updateGridBackground();
        
        // 播放演示动画
        replayDemo();
    }

    function updateGridBackground() {
        const size = currentCharacter.gridSize;
        const bgSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="none" stroke="gray" stroke-width="1"/><path d="M${size/2} 0 V${size} M0 ${size/2} H${size}" stroke="lightgray" stroke-width="1"/></svg>`;
        
        demoGrid.style.backgroundImage = `url('${bgSvg}')`;
        practiceGrid.style.backgroundImage = `url('${bgSvg}')`;
    }

    function replayDemo() {
        clearCanvas(demoCanvas);
        animateStrokes(demoCanvas, currentCharacter.strokeOrder);
    }

    function animateStrokes(canvas, strokes) {
        clearCanvas(canvas);
        let delay = 0;
        
        strokes.forEach((stroke, index) => {
            setTimeout(() => {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', stroke.path);
                path.setAttribute('stroke', 'black');
                path.setAttribute('stroke-width', '3');
                path.setAttribute('fill', 'none');
                path.setAttribute('stroke-linecap', 'round');
                
                // 添加笔画序号
                const firstPoint = getFirstPointFromPath(stroke.path);
                if (firstPoint) {
                    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    text.setAttribute('x', firstPoint.x);
                    text.setAttribute('y', firstPoint.y - 5);
                    text.setAttribute('font-size', '12');
                    text.setAttribute('fill', 'red');
                    text.textContent = (index + 1).toString();
                    canvas.appendChild(text);
                }
                
                // 动画效果
                const length = getPathLength(path);
                path.style.strokeDasharray = length;
                path.style.strokeDashoffset = length;
                path.style.animation = `dash ${stroke.duration/1000}s linear forwards`;
                
                canvas.appendChild(path);
            }, delay);
            
            delay += stroke.duration + 200; // 增加200ms间隔
        });
    }

    function clearPracticeArea() {
        userStrokes = [];
        currentStroke = null;
        isDrawing = false;
        clearCanvas(practiceCanvas);
        updateGridBackground();
        
        feedbackEl.textContent = '请按照上方示范书写';
        feedbackEl.className = 'feedback';
    }

    // ==================== 笔顺检查功能 ====================

    function checkStrokeOrder() {
        // 检查笔画数量
        if (userStrokes.length > currentCharacter.strokeOrder.length) {
            feedbackEl.textContent = `笔画数量超过了标准笔顺！应为 ${currentCharacter.strokeOrder.length} 笔`;
            feedbackEl.className = 'feedback incorrect';
            return;
        }
        
        // 检查每一笔的顺序和形状
        let allCorrect = true;
        let feedbackMessage = '';
        let incorrectIndices = [];
        
        for (let i = 0; i < userStrokes.length; i++) {
            const userStroke = userStrokes[i];
            const standardStroke = currentCharacter.strokeOrder[i];
            
            const similarity = compareStrokes(userStroke, standardStroke.path);
            console.log("similarity:" + similarity)
            
            if (similarity < 0.7) { // 相似度阈值
                allCorrect = false;
                incorrectIndices.push(i);
                
                // 提供具体的错误反馈
                const standardPoints = parsePathData(standardStroke.path);
                const userStart = userStroke.points[0];
                const standardStart = standardPoints[0];
                
                if (distance(userStart, standardStart) > 20) {
                    feedbackMessage += `第 ${i+1} 笔起始位置不正确。`;
                } else {
                    const dirDiff = getDirectionDifference(userStroke.points, standardPoints);
                    if (dirDiff > 45) {
                        feedbackMessage += `第 ${i+1} 笔方向不正确。`;
                    } else {
                        feedbackMessage += `第 ${i+1} 笔形状不正确。`;
                    }
                }
            }
        }
        
        // 高亮所有错误的笔画
        highlightIncorrectStrokes(incorrectIndices);
        
        if (allCorrect) {
            if (userStrokes.length === currentCharacter.strokeOrder.length) {
                feedbackEl.textContent = `正确！共 ${currentCharacter.strokeOrder.length} 笔`;
                feedbackEl.className = 'feedback correct';
            } else {
                feedbackEl.textContent = `已写 ${userStrokes.length} 笔，还差 ${currentCharacter.strokeOrder.length - userStrokes.length} 笔`;
                feedbackEl.className = 'feedback';
            }
        } else {
            feedbackEl.textContent = feedbackMessage || '笔顺不正确';
            feedbackEl.className = 'feedback incorrect';
        }
    }

    // ==================== 辅助函数 ====================

    function parsePathData(pathData) {
        const points = [];
        const commands = pathData.split(/(?=[A-Z])/);
        let currentX = 0;
        let currentY = 0;
        
        commands.forEach(cmd => {
            const type = cmd[0];
            const args = cmd.substring(1).trim().split(/[ ,]+/).filter(Boolean).map(parseFloat);
            
            switch(type) {
                case 'M': // MoveTo
                    currentX = args[0];
                    currentY = args[1];
                    points.push({x: currentX, y: currentY});
                    break;
                    
                case 'L': // LineTo
                    for (let i = 0; i < args.length; i += 2) {
                        currentX = args[i];
                        currentY = args[i+1];
                        points.push({x: currentX, y: currentY});
                    }
                    break;
                    
                case 'H': // Horizontal LineTo
                    currentX = args[0];
                    points.push({x: currentX, y: currentY});
                    break;
                    
                case 'V': // Vertical LineTo
                    currentY = args[0];
                    points.push({x: currentX, y: currentY});
                    break;
                    
                default:
                    // 简单处理其他命令为直线
                    for (let i = 0; i < args.length; i += 2) {
                        if (!isNaN(args[i]) && !isNaN(args[i+1])) {
                            currentX = args[i];
                            currentY = args[i+1];
                            points.push({x: currentX, y: currentY});
                        }
                    }
            }
        });
        
        return points;
    }

    function compareStrokes(userStroke, standardPath) {
        const standardPoints = parsePathData(standardPath);
        if (standardPoints.length < 2 || userStroke.points.length < 2) return 0;
        
        // 1. 检查起始点位置
        const startDist = distance(userStroke.points[0], standardPoints[0]);
        console.log("1: startDist:" + startDist)
        if (startDist > 25) return 0;
        
        // 2. 检查结束点位置
        const endDist = distance(
            userStroke.points[userStroke.points.length - 1], 
            standardPoints[standardPoints.length - 1]
        );
        console.log("2: endDist:" + endDist);
        
        // 3. 检查笔画方向
        const dirDiff = getDirectionDifference(userStroke.points, standardPoints);
        console.log("2: dirDiff:" + dirDiff);
        
        // 4. 检查笔画长度比例
        const userLength = calculateStrokeLength(userStroke.points);
        const standardLength = calculateStrokeLength(standardPoints);
        const lengthRatio = userLength > 0 ? Math.min(userLength, standardLength) / Math.max(userLength, standardLength) : 0;
        console.log("3: len ratio:" + lengthRatio);
        
        // 评分标准
        const maxStartDist = 25;
        const maxEndDist = 30;
        const maxDirDiff = 60;
        
        const startScore = 1 - Math.min(startDist / maxStartDist, 1);
        const endScore = 1 - Math.min(endDist / maxEndDist, 1);
        const dirScore = 1 - Math.min(dirDiff / maxDirDiff, 1);
        const lengthScore = lengthRatio;
        console.log(startScore + "," + endScore + ","+dirScore+","+lengthScore);
        
        // 综合评分
        v = (startScore * 0.3 + endScore * 0.3 + dirScore * 0.2 + lengthScore * 0.2);
        return v;
    }

    function distance(p1, p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

    function getDirectionDifference(points1, points2) {
        const dir1 = getStrokeDirection(points1);
        const dir2 = getStrokeDirection(points2);
        let diff = Math.abs(dir1 - dir2);
        return Math.min(diff, 360 - diff); // 处理角度环绕
    }

    function getStrokeDirection(points) {
        if (points.length < 2) return 0;
        const start = points[0];
        const end = points[points.length - 1];
        return Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI);
    }

    function calculateStrokeLength(points) {
        let length = 0;
        for (let i = 1; i < points.length; i++) {
            length += distance(points[i-1], points[i]);
        }
        return length;
    }

    function highlightIncorrectStrokes(indices) {
        const practiceCanvas = document.getElementById('practice-canvas');
        const paths = practiceCanvas.querySelectorAll('path');
        const texts = practiceCanvas.querySelectorAll('text');
        
        // 重置所有笔画颜色
        paths.forEach(path => {
            path.setAttribute('stroke', 'blue');
            path.setAttribute('stroke-width', '3');
        });
        texts.forEach(text => {
            text.setAttribute('fill', 'green');
        });
        
        // 高亮错误笔画
        indices.forEach(i => {
            if (i < paths.length) {
                paths[i].setAttribute('stroke', 'red');
                paths[i].setAttribute('stroke-width', '4');
            }
            if (i < texts.length) {
                texts[i].setAttribute('fill', 'red');
            }
        });
    }

    function getFirstPointFromPath(pathData) {
        const points = parsePathData(pathData);
        return points.length > 0 ? points[0] : null;
    }

    function getPathLength(path) {
        return path.getTotalLength().toString();
    }

    function clearCanvas(canvas) {
        while (canvas.firstChild) {
            canvas.removeChild(canvas.firstChild);
        }
    }

    // ==================== 用户绘图功能 ====================

    function startStroke(e) {
        e.preventDefault();
        isDrawing = true;
        currentStroke = {
            points: [getPointerPosition(e)],
            startTime: Date.now()
        };
    }

    function drawStroke(e) {
        e.preventDefault();
        if (!isDrawing || !currentStroke) return;
        
        const point = getPointerPosition(e);
        currentStroke.points.push(point);
        
        // 实时显示笔画
        clearCanvas(practiceCanvas);
        drawAllStrokes();
    }

    function endStroke(e) {
        e.preventDefault();
        if (!isDrawing || !currentStroke) return;
        
        isDrawing = false;
        
        // 完成当前笔画 (至少需要2个点)
        if (currentStroke.points.length > 1) {
            userStrokes.push(currentStroke);
            currentStroke = null;
            
            // 检查笔顺
            checkStrokeOrder();
        } else {
            currentStroke = null;
        }
    }

    function drawAllStrokes() {
        userStrokes.forEach((stroke, index) => {
            const pathData = generatePathData(stroke.points);
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', pathData);
            path.setAttribute('stroke', 'blue');
            path.setAttribute('stroke-width', '3');
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke-linecap', 'round');
            practiceCanvas.appendChild(path);
            
            // 显示笔画序号
            if (stroke.points.length > 0) {
                const firstPoint = stroke.points[0];
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', firstPoint.x);
                text.setAttribute('y', firstPoint.y - 5);
                text.setAttribute('font-size', '12');
                text.setAttribute('fill', 'green');
                text.textContent = (index + 1).toString();
                practiceCanvas.appendChild(text);
            }
        });
        
        // 绘制当前未完成的笔画
        if (currentStroke && currentStroke.points.length > 1) {
            const pathData = generatePathData(currentStroke.points);
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', pathData);
            path.setAttribute('stroke', 'blue');
            path.setAttribute('stroke-width', '3');
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke-linecap', 'round');
            practiceCanvas.appendChild(path);
        }
    }

    function generatePathData(points) {
        if (points.length === 0) return '';
        
        let pathData = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            pathData += ` L ${points[i].x} ${points[i].y}`;
        }
        return pathData;
    }

    function getPointerPosition(e) {
        const rect = practiceCanvas.getBoundingClientRect();
        const scaleX = practiceCanvas.width.baseVal.value / rect.width;
        const scaleY = practiceCanvas.height.baseVal.value / rect.height;
        
        let clientX, clientY;
        
        if (e.type.includes('touch')) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    // ==================== 触摸事件处理 ====================

    function handleTouchStart(e) {
        e.preventDefault();
        startStroke(e.touches[0]);
    }

    function handleTouchMove(e) {
        e.preventDefault();
        drawStroke(e.touches[0]);
    }

    function handleTouchEnd(e) {
        e.preventDefault();
        if (e.touches.length === 0) {
            endStroke(e.changedTouches[0]);
        }
    }
});
