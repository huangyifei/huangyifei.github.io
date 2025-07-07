// 汉字笔顺练习程序

class HanziPractice {
    constructor() {
        this.demoCanvas = document.getElementById('demoCanvas');
        this.practiceCanvas = document.getElementById('practiceCanvas');
        this.demoCtx = this.demoCanvas.getContext('2d');
        this.practiceCtx = this.practiceCanvas.getContext('2d');
        
        this.currentCharIndex = 0;
        this.isDrawing = false;
        this.userStrokes = [];
        this.currentStroke = [];
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.bindEvents();
        this.loadRandomCharacter();
    }
    
    setupCanvas() {
        // 设置画布高DPI支持
        this.setupHighDPICanvas(this.demoCanvas, this.demoCtx);
        this.setupHighDPICanvas(this.practiceCanvas, this.practiceCtx);
        
        // 绘制田字格
        this.drawGrid(this.demoCtx);
        this.drawGrid(this.practiceCtx);
    }
    
    setupHighDPICanvas(canvas, ctx) {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        ctx.scale(dpr, dpr);
        
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
    }
    
    drawGrid(ctx) {
        const size = 300;
        const half = size / 2;
        
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        
        // 外框
        ctx.strokeRect(0, 0, size, size);
        
        // 十字线
        ctx.beginPath();
        ctx.moveTo(half, 0);
        ctx.lineTo(half, size);
        ctx.moveTo(0, half);
        ctx.lineTo(size, half);
        ctx.stroke();
        
        // 对角线
        ctx.strokeStyle = '#eee';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(size, size);
        ctx.moveTo(size, 0);
        ctx.lineTo(0, size);
        ctx.stroke();
    }
    
    bindEvents() {
        // 演示区域按钮
        document.getElementById('replayBtn').addEventListener('click', () => {
            this.playAnimation();
        });
        
        // 练习区域按钮
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearPracticeArea();
        });
        
        document.getElementById('checkBtn').addEventListener('click', () => {
            this.checkStrokeOrder();
        });
        
        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextCharacter();
        });
        
        // 练习画布事件
        this.practiceCanvas.addEventListener('mousedown', (e) => {
            this.startDrawing(e);
        });
        
        this.practiceCanvas.addEventListener('mousemove', (e) => {
            this.draw(e);
        });
        
        this.practiceCanvas.addEventListener('mouseup', (e) => {
            this.stopDrawing(e);
        });
        
        // 触摸事件支持
        this.practiceCanvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrawing(e.touches[0]);
        });
        
        this.practiceCanvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.draw(e.touches[0]);
        });
        
        this.practiceCanvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopDrawing();
        });
    }
    
    getCanvasPosition(e) {
        const rect = this.practiceCanvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    startDrawing(e) {
        this.isDrawing = true;
        this.currentStroke = [];
        const pos = this.getCanvasPosition(e);
        this.currentStroke.push(pos);
        
        this.practiceCtx.beginPath();
        this.practiceCtx.moveTo(pos.x, pos.y);
    }
    
    draw(e) {
        if (!this.isDrawing) return;
        
        const pos = this.getCanvasPosition(e);
        this.currentStroke.push(pos);
        
        this.practiceCtx.lineWidth = 3;
        this.practiceCtx.strokeStyle = '#2c3e50';
        this.practiceCtx.lineCap = 'round';
        this.practiceCtx.lineJoin = 'round';
        
        this.practiceCtx.lineTo(pos.x, pos.y);
        this.practiceCtx.stroke();
    }
    
    stopDrawing() {
        if (!this.isDrawing) return;
        
        this.isDrawing = false;
        if (this.currentStroke.length > 0) {
            this.userStrokes.push([...this.currentStroke]);
            this.currentStroke = [];
        }
    }
    
    clearPracticeArea() {
        this.practiceCtx.clearRect(0, 0, this.practiceCanvas.width, this.practiceCanvas.height);
        this.drawGrid(this.practiceCtx);
        this.userStrokes = [];
        this.hideResult();
    }
    
    hideResult() {
        const resultPanel = document.getElementById('resultPanel');
        resultPanel.classList.remove('show');
    }
    
    showResult(content) {
        const resultPanel = document.getElementById('resultPanel');
        const resultContent = document.getElementById('resultContent');
        
        resultContent.innerHTML = content;
        resultPanel.classList.add('show');
    }
    
    loadRandomCharacter() {
        // 从字库中随机选择字符
        const char = getRandomCharacter();
        this.currentCharacter = char;
        this.currentCharData = getCharacterData(char);
        
        document.getElementById('currentChar').textContent = char;
        this.clearPracticeArea();
        this.clearDemoArea();
        
        // 开始播放动画
        setTimeout(() => {
            this.playAnimation();
        }, 500);
    }
    
    clearDemoArea() {
        this.demoCtx.clearRect(0, 0, this.demoCanvas.width, this.demoCanvas.height);
        this.drawGrid(this.demoCtx);
    }
    
    playAnimation() {
        this.clearDemoArea();
        
        if (!this.currentCharData) {
            console.error('没有找到当前字符的数据');
            return;
        }
        
        // 停止之前的动画
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        const strokes = this.currentCharData.strokes;
        let currentStrokeIndex = 0;
        let currentPointIndex = 0;
        const animationSpeed = 50; // 毫秒
        
        const drawStroke = () => {
            if (currentStrokeIndex >= strokes.length) {
                // 动画完成
                this.animationId = null;
                return;
            }
            
            const stroke = strokes[currentStrokeIndex];
            
            if (currentPointIndex === 0) {
                // 开始新的笔画
                this.demoCtx.beginPath();
                this.demoCtx.moveTo(stroke[0].x, stroke[0].y);
                this.demoCtx.strokeStyle = '#e74c3c';
                this.demoCtx.lineWidth = 4;
                this.demoCtx.lineCap = 'round';
                this.demoCtx.lineJoin = 'round';
            }
            
            if (currentPointIndex < stroke.length) {
                const point = stroke[currentPointIndex];
                this.demoCtx.lineTo(point.x, point.y);
                this.demoCtx.stroke();
                
                currentPointIndex++;
                
                // 继续绘制当前笔画
                setTimeout(() => {
                    this.animationId = requestAnimationFrame(drawStroke);
                }, animationSpeed);
            } else {
                // 当前笔画完成，开始下一笔画
                currentStrokeIndex++;
                currentPointIndex = 0;
                
                // 稍微停顿一下再开始下一笔画
                setTimeout(() => {
                    this.animationId = requestAnimationFrame(drawStroke);
                }, animationSpeed * 3);
            }
        };
        
        // 开始动画
        drawStroke();
    }
    
    checkStrokeOrder() {
        if (this.userStrokes.length === 0) {
            this.showResult('<div class="result-incorrect">请先在练习区域写字!</div>');
            return;
        }
        
        if (!this.currentCharData) {
            this.showResult('<div class="result-incorrect">没有找到当前字符的数据!</div>');
            return;
        }
        
        const char = this.currentCharacter;
        const userStrokeCount = this.userStrokes.length;
        const expectedStrokeCount = this.currentCharData.strokeCount;
        const standardStrokes = this.currentCharData.strokes;
        
        let result = `<div class="stroke-info">`;
        result += `<strong>当前字符:</strong> ${char}<br>`;
        result += `<strong>您的笔画数:</strong> ${userStrokeCount}<br>`;
        result += `<strong>标准笔画数:</strong> ${expectedStrokeCount}<br>`;
        
        // 检查笔画数
        if (userStrokeCount !== expectedStrokeCount) {
            result += `<div class="result-incorrect">✗ 笔画数不正确</div>`;
        } else {
            result += `<div class="result-correct">✓ 笔画数正确</div>`;
            
            // 如果笔画数正确，检查笔顺
            const strokeOrderResult = this.compareStrokeOrder(this.userStrokes, standardStrokes);
            result += strokeOrderResult;
        }
        
        result += `</div>`;
        this.showResult(result);
    }
    
    compareStrokeOrder(userStrokes, standardStrokes) {
        let result = '<br><strong>笔顺分析:</strong><br>';
        let correctCount = 0;
        const totalStrokes = Math.min(userStrokes.length, standardStrokes.length);
        
        for (let i = 0; i < totalStrokes; i++) {
            const userStroke = userStrokes[i];
            const standardStroke = standardStrokes[i];
            
            // 简化的笔顺比对：比较笔画的起点和终点
            const similarity = this.calculateStrokeSimilarity(userStroke, standardStroke);
            
            if (similarity > 0.6) { // 相似度阈值
                result += `<div class="result-correct">第${i + 1}笔: ✓ 正确</div>`;
                correctCount++;
            } else {
                result += `<div class="result-incorrect">第${i + 1}笔: ✗ 不正确</div>`;
                result += `<div style="margin-left: 20px; color: #666;">`;
                result += `提示: 检查笔画的起点和方向`;
                result += `</div>`;
            }
        }
        
        const accuracy = (correctCount / totalStrokes * 100).toFixed(1);
        result += `<br><strong>准确率:</strong> ${accuracy}%`;
        
        if (accuracy >= 80) {
            result += `<div class="result-correct">🎉 很棒！笔顺基本正确</div>`;
        } else if (accuracy >= 60) {
            result += `<div style="color: #f39c12;">📝 不错，还需要多练习</div>`;
        } else {
            result += `<div class="result-incorrect">💪 继续加油，多看看标准笔顺演示</div>`;
        }
        
        return result;
    }
    
    calculateStrokeSimilarity(userStroke, standardStroke) {
        if (!userStroke || !standardStroke || userStroke.length === 0 || standardStroke.length === 0) {
            return 0;
        }
        
        // 获取笔画的起点和终点
        const userStart = userStroke[0];
        const userEnd = userStroke[userStroke.length - 1];
        const standardStart = standardStroke[0];
        const standardEnd = standardStroke[standardStroke.length - 1];
        
        // 计算起点和终点的距离
        const startDistance = this.getDistance(userStart, standardStart);
        const endDistance = this.getDistance(userEnd, standardEnd);
        
        // 计算笔画方向的相似度
        const userDirection = this.getStrokeDirection(userStart, userEnd);
        const standardDirection = this.getStrokeDirection(standardStart, standardEnd);
        const directionSimilarity = this.getDirectionSimilarity(userDirection, standardDirection);
        
        // 综合相似度计算
        const maxDistance = 100; // 最大允许距离
        const startSimilarity = Math.max(0, 1 - startDistance / maxDistance);
        const endSimilarity = Math.max(0, 1 - endDistance / maxDistance);
        
        // 权重：起点40%，终点30%，方向30%
        const similarity = startSimilarity * 0.4 + endSimilarity * 0.3 + directionSimilarity * 0.3;
        
        return similarity;
    }
    
    getDistance(point1, point2) {
        const dx = point1.x - point2.x;
        const dy = point1.y - point2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    getStrokeDirection(start, end) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        return Math.atan2(dy, dx);
    }
    
    getDirectionSimilarity(dir1, dir2) {
        let diff = Math.abs(dir1 - dir2);
        if (diff > Math.PI) {
            diff = 2 * Math.PI - diff;
        }
        return Math.max(0, 1 - diff / Math.PI);
    }
    
    getExpectedStrokeCount(char) {
        // 从字库获取笔画数
        const charData = getCharacterData(char);
        return charData ? charData.strokeCount : 1;
    }
    
    nextCharacter() {
        this.loadRandomCharacter();
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new HanziPractice();
});