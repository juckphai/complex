// --- Data Configuration ---
        const lotteryTypes = {
            'laostar-0545': { name: 'ลาวประตูชัย', time: '05.45 น', digits: 5, type: 'star' },
            'laostar-0645': { name: 'ลาวสันติภาพ', time: '06.45 น', digits: 5, type: 'star' },
            'laostar-0745': { name: 'ประชาชนลาว', time: '07.45 น', digits: 5, type: 'star' },
            'laostar-0830': { name: 'ลาว Extra', time: '08.30 น', digits: 5, type: 'star' },
            'laostar-1030': { name: 'ลาว TV', time: '10.30 น', digits: 5, type: 'star' },
            'laostar-1345': { name: 'ลาว HD', time: '13.45 น', digits: 5, type: 'star' },
            'laostar-1545': { name: 'ลาวสตาร์', time: '15.45 น', digits: 5, type: 'star' },
            'laopattana':   { name: 'ลาวพัฒนา', time: '20.30 น', digits: 6, type: 'pattana' },
            'laosamakkee':  { name: 'ลาวสามัคคี', time: '20.30 น', digits: 5, type: 'samakkhee' },
            'laostar-2100': { name: 'ลาวอาเซียน', time: '21.00 น', digits: 5, type: 'star' },
            'laovip-2130':  { name: 'ลาว VIP', time: '21.30 น', digits: 5, type: 'samakkhee' }, // Re-using samakkhee logic
            'laosamakkeevip': { name: 'ลาวสามัคคี VIP', time: '21.30 น', digits: 5, type: 'samakkhee' },
            'laostar-2200': { name: 'ลาวสตาร์ VIP', time: '22.00 น', digits: 5, type: 'star' },
            'laostar-2330': { name: 'ลาวกาชาด', time: '23.30 น', digits: 5, type: 'star' },
            'thai-government': { name: 'รัฐบาลไทย', type: 'thai' } // เพิ่มตัวเลือกสำหรับรัฐบาลไทย
        };

// --- Core Functions ---
// Function to create a single ping-pong ball (Lao lottery style)
function createPingPongBall(number, type = 'red', size = 42, fontSize = 22) {
    const gradientId = `grad-${type}-${Math.random().toString(36).substring(2, 9)}`;
    const highlightId = `highlight-${type}-${Math.random().toString(36).substring(2, 9)}`;
    let highlightColor, midColor, shadowColor;

    if (type === 'blue') { 
        highlightColor = '#B3E5FF'; midColor = '#007FFF'; shadowColor = '#004080';
    } else if (type === 'red') { 
        highlightColor = '#FFC0CB'; midColor = '#E800E8'; shadowColor = '#800080';
    } else if (type === 'orange') { 
        highlightColor = '#FFE3A0'; midColor = '#FF8C00'; shadowColor = '#B35A00';
    } else if (type === 'thai-red') { 
        highlightColor = '#FFC0CB'; midColor = '#E800E8'; shadowColor = '#800080';
    } else if (type === 'thai-blue') { 
        highlightColor = '#B3E5FF'; midColor = '#007FFF'; shadowColor = '#004080';
    } else if (type === 'thai-green') { 
        highlightColor = '#B2FFB2'; midColor = '#008000'; shadowColor = '#004d00';
    } else if (type === 'thai-orange') { 
        highlightColor = '#FFE3A0'; midColor = '#FF8C00'; shadowColor = '#B35A00';
    } else { 
        highlightColor = '#F0F0F0'; midColor = '#A0A0A0'; shadowColor = '#707070';
    }

    const r = (size / 2) - 1;
    const cx = size / 2;
    const cy = size / 2;

    const svgContent = `
        <defs>
            <radialGradient id="${gradientId}" cx="35%" cy="35%" r="70%">
                <stop offset="0%" stop-color="${highlightColor}" />
                <stop offset="50%" stop-color="${midColor}" />
                <stop offset="100%" stop-color="${shadowColor}" />
            </radialGradient>
            
            <radialGradient id="${highlightId}" cx="30%" cy="30%" r="30%">
                <stop offset="0%" stop-color="white" stop-opacity="0.9"/>
                <stop offset="100%" stop-color="white" stop-opacity="0"/>
            </radialGradient>
        </defs>

        <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${gradientId})" stroke="rgba(0,0,0,0.4)" stroke-width="1"/>

        <circle cx="${cx - r * 0.3}" cy="${cy - r * 0.3}" r="${r * 0.35}" fill="url(#${highlightId})"/>
    `;

    return `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="margin: 0 0.5px;">
            ${svgContent}
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
                  font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold"
                  fill="white" stroke="black" stroke-width="0.8" paint-order="stroke">
                ${number}
            </text>
        </svg>
    `;
}

function createPingPongNumbers(numbers, type = 'red', size = 42, fontSize = 22) {
    return numbers.split('').map(digit => createPingPongBall(digit, type, size, fontSize)).join('');
}

        
        function setDefaultDate() {
            const dateInput = document.getElementById("dateInput");
            if (dateInput) {
                const localDate = new Date(new Date().getTime() + (7 * 60 * 60 * 1000));
                dateInput.value = localDate.toISOString().split('T')[0];
            }

            const thaiDrawDateInput = document.getElementById('draw-date');
            if (thaiDrawDateInput) {
                const today = new Date();
                thaiDrawDateInput.value = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear() + 543}`;
            }
        }

        function getThaiDate(date = new Date()) {
            const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
            const months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
            return `วัน${days[date.getDay()]}ที่ ${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]} พ.ศ. ${date.getFullYear() + 543}`;
        }
        
        function showPopup() { document.getElementById("popupOverlay").style.display = "flex"; }
        function closePopup() { document.getElementById("popupOverlay").style.display = "none"; }

        function showThaiPopup() { document.getElementById("thaiLotteryPopupOverlay").style.display = "flex"; }
        function closeThaiPopup() { document.getElementById("thaiLotteryPopupOverlay").style.display = "none"; }

        function updateFormVisibility(selectedType) {
            const laoFormContent = document.getElementById('laoLotteryFormContent');
            const thaiFormContent = document.getElementById('thaiLotteryFormContent');
            const numberInput = document.getElementById("numberInput");
            const dateInput = document.getElementById("dateInput");
            const convertButton = document.getElementById("convertButton");

            if (selectedType === 'thai-government') {
                laoFormContent.style.display = 'none';
                thaiFormContent.style.display = 'block';
            } else {
                laoFormContent.style.display = 'block';
                thaiFormContent.style.display = 'none';
                const config = lotteryTypes[selectedType];
                if (config) {
                    numberInput.maxLength = config.digits;
                    numberInput.placeholder = `กรุณากรอกตัวเลข ${config.digits} หลัก`;
                    numberInput.value = "";
                } else {
                     numberInput.maxLength = "";
                     numberInput.placeholder = "กรุณาเลือกชนิดผลรางวัลก่อน";
                     numberInput.value = "";
                }
            }
        }

        function populateTopicSelect() {
            const select = document.getElementById("topicSelect");
            select.innerHTML = '';

            const laoKeys = Object.keys(lotteryTypes).filter(key => lotteryTypes[key].type !== 'thai');
            const sortedLaoKeys = laoKeys.sort((a, b) => {
                const timeA = lotteryTypes[a].time.replace('.', '');
                const timeB = lotteryTypes[b].time.replace('.', '');
                return parseInt(timeA) - parseInt(timeB);
            });

            sortedLaoKeys.forEach(key => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = `${lotteryTypes[key].name} เวลา ${lotteryTypes[key].time}`;
                select.appendChild(option);
            });

            const thaiOption = document.createElement('option');
            thaiOption.value = 'thai-government';
            thaiOption.textContent = 'ผลฉลากกินแบ่งรัฐบาล';
            select.appendChild(thaiOption);
        }
        
        function convertNumber() {
            const selectedKey = document.getElementById("topicSelect").value;
            const config = lotteryTypes[selectedKey];
            const num = document.getElementById("numberInput").value;

            if (num.length !== config.digits || isNaN(num)) {
                alert(`กรุณากรอกตัวเลข ${config.digits} หลัก`);
                return;
            }

            const date = document.getElementById("dateInput").value ? new Date(document.getElementById("dateInput").value) : new Date();
            
            const popupNameDisplay = document.getElementById("popupNameDisplay");
            popupNameDisplay.className = 'topic-box';
            popupNameDisplay.innerHTML = `<span>ผล${config.name}</span>`;

            const popupTimeDisplay = document.getElementById("popupTimeDisplay");
            popupTimeDisplay.className = 'topic-time';
            popupTimeDisplay.textContent = `เวลา ${config.time}`;

            document.getElementById("popupDateDisplay").textContent = getThaiDate(date);
            document.getElementById("popupPrizeTitle").textContent = `รางวัลเลข ${config.digits} ตัว`;

            let twoDigits, threeDigits;
            
            switch (config.type) {
                case 'pattana':
                    threeDigits = num.slice(3);
                    twoDigits = num.slice(2, 4);
                    break;
                case 'samakkhee':
                    threeDigits = num.slice(2);
                    twoDigits = num.slice(1, 3);
                    break;
                case 'star':
                default:
                    threeDigits = num.slice(2);
                    twoDigits = num.slice(0, 2);
                    break;
            }

            document.getElementById("popupMainDigitsDisplay").innerHTML = createPingPongNumbers(num, 'red', 42, 22);
            document.getElementById("popupThreeDigitsDisplay").innerHTML = createPingPongNumbers(threeDigits, 'blue', 42, 22);
            document.getElementById("popupTwoDigitsDisplay").innerHTML = createPingPongNumbers(twoDigits, 'orange', 42, 22);

            ["popupCircleButton", "popupSquareButton", "popupCircleTopButton"].forEach(id => document.getElementById(id).classList.remove("active"));
            
            showPopup();
            setupSaveLaoImageButton();
            setupShareLaoImageButton(); // 👈 เพิ่มบรรทัดนี้
        }

        function getNumbersForToggle() {
            const selectedKey = document.getElementById("topicSelect").value;
            const config = lotteryTypes[selectedKey];
            const num = document.getElementById('numberInput').value;

            let twoDigits, threeDigits, threeDigits_first, threeDigits_lastTwo;

            switch (config.type) {
                case 'pattana':
                    threeDigits = num.slice(3);
                    twoDigits = num.slice(2, 4);
                    break;
                case 'samakkhee':
                    threeDigits = num.slice(2);
                    twoDigits = num.slice(1, 3);
                    break;
                case 'star':
                default:
                    threeDigits = num.slice(2);
                    twoDigits = num.slice(0, 2);
                    break;
            }
            threeDigits_first = threeDigits[0];
            threeDigits_lastTwo = threeDigits.slice(1);
            
            return { twoDigits, threeDigits, threeDigits_first, threeDigits_lastTwo };
        }

       function toggleCirclePopup() {
            const display = document.getElementById("popupTwoDigitsDisplay");
            const button = document.getElementById("popupCircleButton");
            const { twoDigits } = getNumbersForToggle();
            
            if (button.classList.toggle("active")) {
                display.innerHTML = `
                    <div class="circle-container">
                        ${createPingPongNumbers(twoDigits, 'orange', 42, 22)}
                        <div class="checkmark">✓</div>
                    </div>
                `;
            } else {
                display.innerHTML = createPingPongNumbers(twoDigits, 'orange', 42, 22);
            }
        }

        function toggleSquarePopup() {
            const display = document.getElementById("popupThreeDigitsDisplay");
            const button = document.getElementById("popupSquareButton");
            const { threeDigits } = getNumbersForToggle();

            if (button.classList.toggle("active")) {
                display.innerHTML = `
                    <div class="square-container">
                        ${createPingPongNumbers(threeDigits, 'blue', 42, 22)}
                        <div class="checkmark">✓</div>
                    </div>
                `;
            } else {
                display.innerHTML = createPingPongNumbers(threeDigits, 'blue', 42, 22);
            }
        }

        function toggleSquareTopPopup() {
            const display = document.getElementById("popupThreeDigitsDisplay");
            const button = document.getElementById("popupCircleTopButton");
            const { threeDigits, threeDigits_first, threeDigits_lastTwo } = getNumbersForToggle();

            if (button.classList.toggle("active")) {
                display.innerHTML = `
                    ${createPingPongBall(threeDigits_first, 'blue', 42, 22)}
                    <div class="square-two-container">
                        ${createPingPongNumbers(threeDigits_lastTwo, 'blue', 42, 22)}
                        <div class="checkmark">✓</div>
                    </div>
                `;
            } else {
                display.innerHTML = createPingPongNumbers(threeDigits, 'blue', 42, 22);
            }
        }

// --- 2️⃣ เพิ่มฟังกชัน "แชร์รูป" (ไม่ยุ่งของเดิม) ---
async function shareCanvasImage(canvas, fileName) {
    if (!navigator.canShare) {
        alert("อุปกรณ์นี้ไม่รองรับการแชร์");
        return;
    }

    const blob = await new Promise(resolve =>
        canvas.toBlob(resolve, "image/png")
    );

    const file = new File([blob], fileName, { type: "image/png" });

    if (navigator.canShare({ files: [file] })) {
        await navigator.share({
            files: [file],
            title: "ผลรางวัล",
            text: "ส่งต่อผลรางวัล"
        });
    } else {
        alert("ไม่สามารถแชร์ไฟล์นี้ได้");
    }
}
        
        function setupSaveLaoImageButton() {
            const saveBtn = document.getElementById("saveLaoAsImageButton");
            const newSaveBtn = saveBtn.cloneNode(true);
            saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

            newSaveBtn.addEventListener("click", function() {
                const captureElement = document.querySelector("#popupOverlay .popup-content");
                const controlsElement = captureElement.querySelector('.popup-buttons-container');

                if (controlsElement) controlsElement.style.display = 'none';

                // ใช้ timeout เพื่อให้แน่ใจว่า DOM อัพเดทก่อนการจับภาพ
                setTimeout(() => {
                    html2canvas(captureElement, {
                        useCORS: true,
                        scale: 4,
                        backgroundColor: '#fffde7',
                        allowTaint: true,
                        onclone: function(clonedDoc) {
                            // ตรวจสอบให้แน่ใจว่าเอฟเฟกต์เงายังคงแสดงใน cloned document
                            const balls = clonedDoc.querySelectorAll('.ball-shadow, .ball-text-shadow');
                            balls.forEach(ball => {
                                ball.style.filter = getComputedStyle(ball).filter;
                            });
                        }
                    }).then(canvas => {
                        const link = document.createElement('a');
                        const num = document.getElementById("numberInput").value || "result";
                        const selectedKey = document.getElementById("topicSelect").value;
                        const topicName = lotteryTypes[selectedKey].name.replace(/\s+/g, '');
                        
                        link.download = `Result-${topicName}-${num}-${Date.now()}.png`;
                        link.href = canvas.toDataURL("image/png");
                        link.click();
                    }).catch(err => {
                        console.error("เกิดข้อผิดพลาดในการสร้างรูปภาพ:", err);
                        alert("ขออภัย, ไม่สามารถบันทึกเป็นรูปภาพได้");
                    }).finally(() => {
                        if (controlsElement) controlsElement.style.display = 'flex';
                    });
                }, 100);
            });
        }

// --- 3️⃣ เชื่อมกับ popup ลาว (เพิ่มเฉพาะส่วน share) ---
function setupShareLaoImageButton() {
    const btn = document.getElementById("shareLaoImageButton");
    if (!btn) return;

    btn.onclick = () => {
        const captureElement = document.querySelector("#popupOverlay .popup-content");
        const controls = captureElement.querySelector('.popup-buttons-container');

        controls.style.display = "none";

        setTimeout(() => {
            html2canvas(captureElement, {
                scale: 4,
                backgroundColor: '#fffde7',
                useCORS: true
            }).then(canvas => {
                const num = document.getElementById("numberInput").value || "result";
                const key = document.getElementById("topicSelect").value;
                const name = lotteryTypes[key].name.replace(/\s+/g, '');

                shareCanvasImage(canvas, `Result-${name}-${num}.png`);
            }).finally(() => {
                controls.style.display = "flex";
            });
        }, 100);
    };
}

        function formatThaiDate(dateString) {
            const parts = dateString.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            if (!parts) return `งวดวันที่ ${dateString}`;
            const day = parseInt(parts[1], 10);
            const month = parseInt(parts[2], 10);
            const thaiYear = parseInt(parts[3], 10);
            const gregorianYear = thaiYear - 543;
            const date = new Date(gregorianYear, month - 1, day);
            if (isNaN(date.getTime()) || date.getDate() !== day || date.getMonth() !== month - 1) {
                return `งวดวันที่ ${dateString}`;
            }
            const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
            const months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
            const dayOfWeek = days[date.getDay()];
            const monthName = months[date.getMonth()];
            return `งวดวัน${dayOfWeek}ที่ ${day} ${monthName} พ.ศ. ${thaiYear}`;
        }

        function displayNumberGroup(elementId, numberString, type, size, fontSize) {
            const container = document.getElementById(elementId);
            container.innerHTML = "";
            if (!numberString) return;
            let ballsHtml = "";
            for (let i = 0; i < numberString.length; i++) {
                ballsHtml += createPingPongBall(numberString[i], type, size, fontSize);
            }
            container.innerHTML = ballsHtml;
        }

        function displayThaiResults() {
            const rawDate = document.getElementById("draw-date").value;
            if (!rawDate || !rawDate.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)) {
                alert("กรุณากรอกวันที่ให้ถูกต้องตามรูปแบบ วว/ดด/ปปปป");
                return;
            }
            document.getElementById("display-draw-date").innerText = formatThaiDate(rawDate);
            
            // รางวัลที่ 1
            displayNumberGroup("first-prize-display", document.getElementById("first-prize").value, "thai-red", 42, 22);

            // --- แก้ไขส่วนแสดงผลเลขหน้า 3 ตัว ---
            const frontThree1 = document.getElementById("front-three-1").value;
            const frontThree2 = document.getElementById("front-three-2").value;
            const frontThreeGroupDisplay = document.getElementById("front-three-group-display");
            
            if (frontThreeGroupDisplay) {
                frontThreeGroupDisplay.innerHTML = `
                    ${createPingPongNumbers(frontThree1, "thai-blue", 42, 22)}
                    <span class="prize-divider">|</span>
                    ${createPingPongNumbers(frontThree2, "thai-blue", 42, 22)}
                `;
            }

            // --- แก้ไขส่วนแสดงผลเลขท้าย 3 ตัว ---
            const backThree1 = document.getElementById("back-three-1").value;
            const backThree2 = document.getElementById("back-three-2").value;
            const backThreeGroupDisplay = document.getElementById("back-three-group-display");
            
            if (backThreeGroupDisplay) {
                backThreeGroupDisplay.innerHTML = `
                    ${createPingPongNumbers(backThree1, "thai-green", 42, 22)}
                    <span class="prize-divider">|</span>
                    ${createPingPongNumbers(backThree2, "thai-green", 42, 22)}
                `;
            }
            
            // เลขท้าย 2 ตัว (ลูกบอลใหญ่)
            displayNumberGroup("display-back-two", document.getElementById("back-two").value, "thai-orange", 52, 32);

            showThaiPopup();
            setupSaveThaiImageButton();
            setupShareThaiImageButton(); // 👈 เพิ่มบรรทัดนี้
        }

        function setupSaveThaiImageButton() {
            const saveBtn = document.getElementById("saveThaiAsImageButton");
            const newSaveBtn = saveBtn.cloneNode(true);
            saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

            newSaveBtn.addEventListener("click", function() {
                const captureElement = document.querySelector("#thaiLotteryPopupContent");
                const controlsElement = captureElement.querySelector('.popup-controls');
                const dateText = document.getElementById("display-draw-date").innerText.replace(/[^a-zA-Z0-9-]/g, '_');
                const firstPrize = document.getElementById("first-prize").value || "XXXXXX";

                if (controlsElement) { controlsElement.style.display = 'none'; }

                // ใช้ timeout เพื่อให้แน่ใจว่า DOM อัพเดทก่อนการจับภาพ
                setTimeout(() => {
                    html2canvas(captureElement, {
                        useCORS: true,
                        scale: 4,
                        backgroundColor: '#FFFFD1',
                        logging: false,
                        allowTaint: true,
                        onclone: (clonedDoc) => {
                            const clonedElement = clonedDoc.querySelector("#thaiLotteryPopupContent");
                            if (clonedElement) {
                                clonedElement.style.boxShadow = 'none';
                            }
                            
                            // ตรวจสอบให้แน่ใจว่าเอฟเฟกต์เงายังคงแสดงใน cloned document
                            const balls = clonedDoc.querySelectorAll('.ball-shadow, .ball-text-shadow');
                            balls.forEach(ball => {
                                ball.style.filter = getComputedStyle(ball).filter;
                            });
                        }
                    }).then(canvas => {
                        const link = document.createElement('a');
                        link.download = `ผลสลากรัฐบาล-${firstPrize}-${dateText}.png`;
                        link.href = canvas.toDataURL("image/png", 1.0);
                        link.click();
                    }).catch(err => {
                        console.error("เกิดข้อผิดพลาดในการสร้างรูปภาพ:", err);
                        alert("ขออภัย, ไม่สามารถบันทึกเป็นรูปภาพได้");
                    }).finally(() => {
                        if (controlsElement) { controlsElement.style.display = 'flex'; }
                    });
                }, 100);
            });
        }

// --- 4️⃣ ฝั่งรัฐบาลไทย (เพิ่มฟังก์ชันแชร์) ---
function setupShareThaiImageButton() {
    const btn = document.getElementById("shareThaiAsImageButton");
    if (!btn) return;

    btn.onclick = () => {
        const captureElement = document.querySelector("#thaiLotteryPopupContent");
        const controls = captureElement.querySelector('.popup-controls');

        controls.style.display = "none";

        setTimeout(() => {
            html2canvas(captureElement, {
                scale: 4,
                backgroundColor: '#FFFFD1',
                useCORS: true
            }).then(canvas => {
                const firstPrize = document.getElementById("first-prize").value || "XXXXXX";
                const dateText = document.getElementById("display-draw-date").innerText.replace(/[^a-zA-Z0-9-]/g, '_');

                shareCanvasImage(canvas, `ผลสลากรัฐบาล-${firstPrize}-${dateText}.png`);
            }).finally(() => {
                controls.style.display = "flex";
            });
        }, 100);
    };
}

        document.addEventListener('contextmenu', e => e.preventDefault());
        document.addEventListener("DOMContentLoaded", () => {
            populateTopicSelect();
            setDefaultDate();
            updateFormVisibility(document.getElementById("topicSelect").value);
            
            document.getElementById("topicSelect").addEventListener("change", (event) => {
                updateFormVisibility(event.target.value);
            });

            document.getElementById("convertButton").addEventListener("click", convertNumber);

            document.getElementById("displayThaiResultsButton").addEventListener("click", displayThaiResults);

            const thaiCalendarButton = document.getElementById('calendarButton');
            const thaiHiddenDateInput = document.getElementById('hiddenDateInput');
            const thaiDrawDateInput = document.getElementById('draw-date');

            if (thaiCalendarButton && thaiHiddenDateInput && thaiDrawDateInput) {
                thaiCalendarButton.addEventListener('click', () => {
                    try {
                        thaiHiddenDateInput.showPicker();
                    } catch (error) {
                        thaiHiddenDateInput.click();
                    }
                });

                thaiHiddenDateInput.addEventListener('change', (e) => {
                    const selectedDate = e.target.value;
                    if (selectedDate) {
                        const parts = selectedDate.split('-');
                        thaiDrawDateInput.value = `${parts[2]}/${parts[1]}/${parseInt(parts[0], 10) + 543}`;
                    } else {
                        const today = new Date();
                        thaiDrawDateInput.value = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear() + 543}`;
                    }
                });
            }
        });

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw-all-lao.js')
                    .then(reg => console.log('Service Worker for All Lao registered.', reg))
                    .catch(err => console.error('Service Worker registration failed:', err));
            });
        }