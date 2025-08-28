document.addEventListener('DOMContentLoaded', function() {
    
    // 照片墙模态框逻辑
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const galleryImages = document.querySelectorAll('.gallery-img');
    const closeBtn = document.querySelector('.close');

    if(galleryImages.length > 0 && modal) {
        galleryImages.forEach(img => {
            img.onclick = function() {
                modal.style.display = "block";
                modalImg.src = this.src;
            }
        });

        closeBtn.onclick = function() {
            modal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    // --- “星河心事” 逻辑 ---
    const reasons = [
        "时光因为充满了你的欢声笑语，才变得值得珍藏与回味。", "只要一想到你，就觉得整个世界都温柔了起来。",
        "想和你一起解锁这世界上所有的美好风景。", "你眼里的热忱与善意，是我见过最动人的风景。",
        "每一次牵你的手，都感觉无比的踏实。", "因为你的出现，我变成了更好、更完整的自己。",
        "我爱你的善良，你总是温柔地对待这个世界。", "有你在身边，再平淡的日月也变得熠熠生辉。"
    ];

    const starContainer = document.querySelector('.star-container');
    const reasonModal = document.getElementById('reason-modal');
    const reasonTextModal = document.getElementById('reason-text-modal');

    let clickedStarsCount = 0;
    const numberOfStars = reasons.length;

    if (starContainer) {
        // 星星随机分布
        for (let i = 0; i < numberOfStars; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            star.style.top = `${Math.random() * 85 + 5}%`;
            star.style.left = `${Math.random() * 90 + 5}%`;
            star.style.animationDelay = `${Math.random() * 2}s`;
            
            star.dataset.reason = reasons[i]; 
            starContainer.appendChild(star);

            star.onclick = function() {
                if (this.classList.contains('active')) return;

                this.classList.add('active');
                clickedStarsCount++;

                reasonTextModal.innerText = this.dataset.reason;
                reasonModal.style.display = "flex";

                if (clickedStarsCount === numberOfStars) {
                    setTimeout(triggerFinalEffect, 1500); // 当所有星星被点亮时，触发最终特效
                }
            };
        }
    }
    
    /**
     * @description 最终特效函数 - 星光连线动画
     */
    function triggerFinalEffect() {
        const canvas = document.getElementById('star-canvas');
        const finalMessage = document.getElementById('final-message');
        if (!canvas || !finalMessage) return;

        // 立即隐藏理由弹窗
        if(reasonModal) reasonModal.style.display = "none";

        const ctx = canvas.getContext('2d');
        const container = document.querySelector('.star-container');
        // 确保canvas尺寸与容器一致
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;

        const stars = Array.from(document.querySelectorAll('.star.active'));
        // 按照星星的水平位置（从左到右）排序
        stars.sort((a, b) => a.offsetLeft - b.offsetLeft);

        const points = stars.map(star => ({
            x: star.offsetLeft + star.offsetWidth / 2,
            y: star.offsetTop + star.offsetHeight / 2
        }));

        let i = 0;
        function connectStars() {
            if (i < points.length - 1) {
                animateLine(points[i], points[i + 1], () => {
                    i++;
                    connectStars(); // 递归调用以连接下一对星星
                });
            } else {
                // 所有星星连接完毕，显示最终寄语
                setTimeout(() => {
                    finalMessage.innerText = "其实爱你的理由又何止这些，它们是藏在点滴日常里的星光，往后的日子，让我慢慢说给你听。";
                    finalMessage.classList.add('visible');
                }, 500); // 延迟半秒显示
            }
        }

        function animateLine(p1, p2, callback) {
            let progress = 0;
            const duration = 200; // 每段线的绘制时间（毫秒）
            let startTime = null;

            function draw(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                progress = Math.min(elapsed / duration, 1);

                // 计算当前点的位置
                const currentX = p1.x + (p2.x - p1.x) * progress;
                const currentY = p1.y + (p2.y - p1.y) * progress;

                // 绘制从起点到当前点的线段
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(currentX, currentY);
                ctx.strokeStyle = '#ffd700'; // 金色光线
                ctx.lineWidth = 2;
                ctx.shadowBlur = 10; // 发光效果
                ctx.shadowColor = '#ffd700';
                ctx.stroke();
                
                if (progress < 1) {
                    requestAnimationFrame(draw);
                } else {
                    if (callback) callback();
                }
            }
            requestAnimationFrame(draw);
        }
        
        // 延迟一小段时间开始动画，等待弹窗消失
        setTimeout(connectStars, 300);
    }

    if (reasonModal) {
        reasonModal.onclick = function() {
            reasonModal.style.display = "none";
        };
    }
    
    // --- “时光信笺” 打字机效果逻辑 ---
    const letterTextElement = document.getElementById('letter-text');
    let originalLetterHTML = letterTextElement ? letterTextElement.innerHTML : '';
    let letterAnimated = false;

    function typeWriter(element, text, i, callback) {
        if (i < text.length) {
            if (text.charAt(i) === '<') {
                const endIndex = text.indexOf('>', i);
                if (endIndex !== -1) {
                    element.innerHTML = text.substring(0, endIndex + 1);
                    setTimeout(() => typeWriter(element, text, endIndex + 1, callback), 50); 
                    return;
                }
            }
            element.innerHTML = text.substring(0, i + 1) + '<span class="cursor">|</span>';
            setTimeout(() => typeWriter(element, text, i + 1, callback), 100);
        } else {
            element.innerHTML = text; 
            if (callback) callback();
        }
    }

    // 背景音乐播放器逻辑
    const music = document.getElementById('bg-music');
    const playBtn = document.getElementById('play-pause-btn');
    let isPlaying = false;

    if (playBtn && music) {
        playBtn.onclick = function() {
            if (isPlaying) {
                music.pause();
                playBtn.innerText = "播放音乐";
            } else {
                music.play();
                playBtn.innerText = "暂停音乐";
            }
            isPlaying = !isPlaying;
        };
    }
    
    // 页面滚动动画
    const animatedElements = document.querySelectorAll('.timeline-item, .gallery-img, .letter-content, #star-reasons h2');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                if (entry.target.classList.contains('letter-content') && !letterAnimated) {
                    letterAnimated = true;
                    const textToAnimate = originalLetterHTML; 
                    letterTextElement.innerHTML = ''; 
                    typeWriter(letterTextElement, textToAnimate, 0);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2 
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    const style = document.createElement('style');
    style.innerHTML = `
        .timeline-item, .gallery-img, .letter-content, #star-reasons h2 {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 1s ease-out, transform 1s ease-out;
        }
        .timeline-item.visible, .gallery-img.visible, .letter-content.visible, #star-reasons h2.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
});