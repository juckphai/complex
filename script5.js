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
    'laovip-2130':  { name: 'ลาว VIP', time: '21.30 น', digits: 5, type: 'samakkhee' },
    'laosamakkeevip': { name: 'ลาวสามัคคี VIP', time: '21.30 น', digits: 5, type: 'samakkhee' },
    'laostar-2200': { name: 'ลาวสตาร์ VIP', time: '22.00 น', digits: 5, type: 'star' },
    'laostar-2330': { name: 'ลาวกาชาด', time: '23.30 น', digits: 5, type: 'star' },
    'thai-government': { name: 'รัฐบาลไทย', type: 'thai' }
};

// === ระบบจัดการผู้รับ Telegram (เพิ่ม/ลบ/แก้ไข) ===
const TG_RECIPIENTS_KEY = 'my_telegram_recipients';
let editingRecipIndex = -1;

// ค่าเริ่มต้นหากเปิดใช้งานครั้งแรก
const defaultRecipients = [
    { type: 'group', id: '-1001556229520', name: 'กลุ่ม 1' },
    { type: 'group', id: '-1003960364296', name: 'กลุ่ม 2' },
    { type: 'personal', id: '5101894762', name: 'บุคคล 1' },
];

function getTelegramRecipients() {
    const data = localStorage.getItem(TG_RECIPIENTS_KEY);
    if (data) {
        try { return JSON.parse(data); } catch(e) { return defaultRecipients; }
    }
    return defaultRecipients;
}

function saveTelegramRecipients(list) {
    localStorage.setItem(TG_RECIPIENTS_KEY, JSON.stringify(list));
}

function renderTgRecipients() {
    const list = getTelegramRecipients();
    const ul = document.getElementById('tgRecipList');
    if (!ul) return;
    ul.innerHTML = '';
    list.forEach((r, index) => {
        const li = document.createElement('li');
        li.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: white; padding: 8px; margin-bottom: 5px; border-radius: 4px; border: 1px solid #ddd;";
        
        const infoSpan = document.createElement('span');
        infoSpan.style.cssText = "font-size: 12px; color: #333; line-height: 1.4;";
        infoSpan.innerHTML = `<b>${r.type === 'group' ? '👥' : '👤'} ${r.name}</b><br><span style="color:#666; font-size:10px;">ID: ${r.id}</span>`;
        
        const btnDiv = document.createElement('div');
        
        const editBtn = document.createElement('button');
        editBtn.innerHTML = '✏️';
        editBtn.style.cssText = "background: #ffc107; border: none; padding: 4px 8px; margin-right: 5px; border-radius: 4px; cursor: pointer;";
        editBtn.onclick = () => editTgRecip(index);
        
        const delBtn = document.createElement('button');
        delBtn.innerHTML = '🗑️';
        delBtn.style.cssText = "background: #dc3545; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; color: white;";
        delBtn.onclick = () => deleteTgRecip(index);

        btnDiv.appendChild(editBtn);
        btnDiv.appendChild(delBtn);
        
        li.appendChild(infoSpan);
        li.appendChild(btnDiv);
        ul.appendChild(li);
    });
}

window.editTgRecip = function(index) {
    const list = getTelegramRecipients();
    const r = list[index];
    document.getElementById('tgRecipType').value = r.type;
    document.getElementById('tgRecipName').value = r.name;
    document.getElementById('tgRecipId').value = r.id;
    
    editingRecipIndex = index;
    const addBtn = document.getElementById('addTgRecipBtn');
    addBtn.innerHTML = '💾 บันทึกการแก้ไข';
    addBtn.style.background = '#007bff';
};

window.deleteTgRecip = function(index) {
    if(confirm('ต้องการลบผู้รับนี้ใช่หรือไม่?')) {
        const list = getTelegramRecipients();
        list.splice(index, 1);
        saveTelegramRecipients(list);
        renderTgRecipients();
    }
};

function setupTelegramRecipientsUI() {
    const addBtn = document.getElementById('addTgRecipBtn');
    if(!addBtn) return;
    
    renderTgRecipients();

    addBtn.onclick = () => {
        const type = document.getElementById('tgRecipType').value;
        const name = document.getElementById('tgRecipName').value.trim();
        const id = document.getElementById('tgRecipId').value.trim();
        
        if(!name || !id) {
            alert('⚠️ กรุณากรอกชื่อและ Chat ID ให้ครบถ้วน');
            return;
        }

        const list = getTelegramRecipients();
        
        if(editingRecipIndex > -1) {
            list[editingRecipIndex] = { type, name, id };
            editingRecipIndex = -1;
            addBtn.innerHTML = '➕ เพิ่มผู้รับ';
            addBtn.style.background = '#28a745';
        } else {
            list.push({ type, name, id });
        }
        
        saveTelegramRecipients(list);
        renderTgRecipients();
        
        // ล้างค่าฟอร์ม
        document.getElementById('tgRecipName').value = '';
        document.getElementById('tgRecipId').value = '';
    };
}

// === ระบบโหลดและเซฟ Telegram Token ===
function getTelegramToken() {
    return localStorage.getItem('my_telegram_token') || '';
}

function saveTelegramToken(token) {
    if (token && token.trim().length > 20) {
        localStorage.setItem('my_telegram_token', token.trim());
        return true;
    }
    return false;
}

function setupTelegramTokenUI() {
    const tokenInput = document.getElementById("tgTokenInput");
    const saveBtn = document.getElementById("saveTokenBtn");
    
    if (!tokenInput || !saveBtn) return;
    
    const savedToken = getTelegramToken();
    if (savedToken) {
        tokenInput.value = savedToken;
    }
    
    saveBtn.addEventListener("click", function() {
        const tokenValue = tokenInput.value.trim();
        if (tokenValue && tokenValue.length > 20) {
            if (saveTelegramToken(tokenValue)) {
                alert("✅ บันทึก Token ลงในเครื่องเรียบร้อยแล้ว!\nระบบจะใช้ Token นี้ในการส่งข้อความไปยัง Telegram");
            } else {
                alert("❌ ไม่สามารถบันทึก Token ได้");
            }
        } else if (tokenValue) {
            alert("⚠️ Token ไม่ถูกต้อง (ควรยาวประมาณ 40-50 ตัวอักษร)");
        } else {
            alert("⚠️ กรุณากรอก Token ก่อนบันทึก");
        }
    });
}

// === TELEGRAM SHARE FUNCTION ===
async function shareToTelegram(blob, caption = '') {
    const TELEGRAM_BOT_TOKEN = getTelegramToken();
    
    if (!TELEGRAM_BOT_TOKEN) {
        alert('⚠️ กรุณาตั้งค่า Telegram Bot Token ก่อน!\n\nไปที่ปุ่ม ⚙️ > ตั้งค่า Telegram Bot');
        return false;
    }

    const recipients = getTelegramRecipients();
    if (recipients.length === 0) {
        alert('⚠️ ไม่พบรายชื่อผู้รับ กรุณาเพิ่มผู้รับ Telegram ในเมนูตั้งค่าก่อน');
        return false;
    }
    
    let successCount = 0;
    let failCount = 0;
    const totalRecipients = recipients.length;
    
    // ❌ นำเอาบรรทัด alert("กำลังส่ง...") ออกจากตรงนี้ เพื่อให้ระบบทำงานทันทีโดยไม่ต้องรอผู้ใช้กดยืนยัน
    
    for (const recipient of recipients) {
        const formData = new FormData();
        const fileName = `lottery_result_${Date.now()}_${recipient.id}.png`;
        const file = new File([blob], fileName, { type: 'image/png' });
        formData.append('chat_id', recipient.id);
        formData.append('photo', file);
        if (caption) formData.append('caption', caption);
        
        try {
            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.ok) {
                successCount++;
                console.log(`✅ ส่งไปยัง ${recipient.name} (${recipient.id}) สำเร็จ`);
            } else {
                failCount++;
                console.error(`❌ ส่งไปยัง ${recipient.name} ล้มเหลว:`, result.description);
            }
        } catch (error) {
            failCount++;
            console.error(`❌ ส่งไปยัง ${recipient.name} เกิดข้อผิดพลาด:`, error.message);
        }
    }
    
    // ✅ แจ้งเตือนเฉพาะเมื่อกระบวนการส่งทั้งหมดเสร็จสิ้นแล้ว
    if (failCount === 0) {
        alert(`✅ ส่งสำเร็จทั้งหมด ${successCount}/${totalRecipients} ที่!`);
    } else {
        alert(`⚠️ ส่งสำเร็จ ${successCount}/${totalRecipients} ที่\n❌ ล้มเหลว ${failCount} ที่ (ดู Console)`);
    }
    
    return successCount > 0;
}

// === SHARE SETTINGS LOGIC ===
const SHARE_PREF_KEY = 'sharePreference_universal';

function loadSharePreference() {
    return localStorage.getItem(SHARE_PREF_KEY) || 'system';
}

function updateShareButtonsUI() {
    const mode = loadSharePreference();
    const laoBtn = document.getElementById("shareLaoImageButton");
    const thaiBtn = document.getElementById("shareThaiImageButton");
    
    const text = mode === 'copy' ? "📋 คัดลอกรูป (วางแชท)" : "📤 ส่งต่อไปแอป";
    const color = mode === 'copy' ? "#ff9800" : "#28a745";

    if (laoBtn) {
        laoBtn.textContent = text;
        laoBtn.style.backgroundColor = color;
    }
    if (thaiBtn) {
        thaiBtn.textContent = mode === 'copy' ? "📋 คัดลอกรูป" : "📤 ส่งต่อ";
        thaiBtn.style.backgroundColor = color;
    }
}

async function copyImageToClipboard(blob) {
    try {
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);
        alert("คัดลอกรูปภาพแล้ว! \nคุณสามารถไปที่แอป Line หรือ Messenger แล้วกด 'วาง' ในช่องแชทได้เลย");
    } catch (err) {
        console.error("Copy failed", err);
        alert("อุปกรณ์นี้ไม่รองรับการคัดลอกรูปภาพโดยตรง (ลองใช้แบบแชร์ปกติ)");
    }
}

function initShareSettings() {
    updateShareButtonsUI();
    setupTelegramTokenUI();
    setupTelegramRecipientsUI(); // เริ่มต้น UI จัดการผู้รับ

    const openModal = () => {
        const currentMode = loadSharePreference();
        const radios = document.getElementsByName("shareMode");
        radios.forEach(r => { if (r.value === currentMode) r.checked = true; });
        
        const tokenInput = document.getElementById("tgTokenInput");
        if (tokenInput) {
            tokenInput.value = getTelegramToken();
        }
        
        document.getElementById("shareSettingsModal").style.display = "flex";
    };

    const btnLao = document.getElementById("shareSettingsBtnLao");
    const btnThai = document.getElementById("shareSettingsBtnThai");
    if(btnLao) btnLao.addEventListener("click", openModal);
    if(btnThai) btnThai.addEventListener("click", openModal);

    const closeBtn = document.getElementById("closeShareSettingsBtn");
    if(closeBtn) {
        closeBtn.addEventListener("click", () => {
            document.getElementById("shareSettingsModal").style.display = "none";
            // ล้างค่าฟอร์มเผื่อกดแก้ไขค้างไว้แล้วกดปิด
            editingRecipIndex = -1;
            const addBtn = document.getElementById('addTgRecipBtn');
            if(addBtn) {
                addBtn.innerHTML = '➕ เพิ่มผู้รับ';
                addBtn.style.background = '#28a745';
                document.getElementById('tgRecipName').value = '';
                document.getElementById('tgRecipId').value = '';
            }
        });
    }

    const saveBtn = document.getElementById("saveShareSettingsBtn");
    if(saveBtn) {
        saveBtn.addEventListener("click", () => {
            const radios = document.getElementsByName("shareMode");
            let selected = 'system';
            radios.forEach(r => { if(r.checked) selected = r.value; });
            
            localStorage.setItem(SHARE_PREF_KEY, selected);
            updateShareButtonsUI();
            document.getElementById("shareSettingsModal").style.display = "none";
        });
    }
}

// --- Core Functions ---
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

// --- Lao Lottery Logic ---
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
    popupNameDisplay.innerHTML = `
        <img src="logo.png" alt="Logo" class="header-logo">
        <span>ผล${config.name}</span>
        <img src="logo.png" alt="Logo" class="header-logo">
    `;

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
    setupShareLaoImageButton();
    setupTelegramLaoShareButton();
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
        display.innerHTML = `<div class="circle-container">${createPingPongNumbers(twoDigits, 'orange', 42, 22)}<div class="checkmark">✓</div></div>`;
    } else {
        display.innerHTML = createPingPongNumbers(twoDigits, 'orange', 42, 22);
    }
}

function toggleSquarePopup() {
    const display = document.getElementById("popupThreeDigitsDisplay");
    const button = document.getElementById("popupSquareButton");
    const { threeDigits } = getNumbersForToggle();
    if (button.classList.toggle("active")) {
        display.innerHTML = `<div class="square-container">${createPingPongNumbers(threeDigits, 'blue', 42, 22)}<div class="checkmark">✓</div></div>`;
    } else {
        display.innerHTML = createPingPongNumbers(threeDigits, 'blue', 42, 22);
    }
}

function toggleSquareTopPopup() {
    const display = document.getElementById("popupThreeDigitsDisplay");
    const button = document.getElementById("popupCircleTopButton");
    const { threeDigits, threeDigits_first, threeDigits_lastTwo } = getNumbersForToggle();
    if (button.classList.toggle("active")) {
        display.innerHTML = `${createPingPongBall(threeDigits_first, 'blue', 42, 22)}<div class="square-two-container">${createPingPongNumbers(threeDigits_lastTwo, 'blue', 42, 22)}<div class="checkmark">✓</div></div>`;
    } else {
        display.innerHTML = createPingPongNumbers(threeDigits, 'blue', 42, 22);
    }
}

function setupSaveLaoImageButton() {
    const saveBtn = document.getElementById("saveLaoAsImageButton");
    if (!saveBtn) return;
    
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

    newSaveBtn.addEventListener("click", function() {
        const captureElement = document.querySelector("#popupOverlay .popup-content");
        const controlsElement = captureElement.querySelector('.popup-buttons-container');
        if (controlsElement) controlsElement.style.display = 'none';

        setTimeout(() => {
            html2canvas(captureElement, {
                useCORS: true,
                scale: 4,
                backgroundColor: '#fffde7',
                allowTaint: true,
            }).then(canvas => {
                const link = document.createElement('a');
                const num = document.getElementById("numberInput").value || "result";
                const selectedKey = document.getElementById("topicSelect").value;
                const topicName = lotteryTypes[selectedKey]?.name.replace(/\s+/g, '') || 'result';
                link.download = `Result-${topicName}-${num}-${Date.now()}.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();
            }).catch(err => {
                console.error("Error:", err);
                alert("ขออภัย, ไม่สามารถบันทึกเป็นรูปภาพได้");
            }).finally(() => {
                if (controlsElement) controlsElement.style.display = 'flex';
            });
        }, 100);
    });
}

function setupShareLaoImageButton() {
    const shareBtn = document.getElementById("shareLaoImageButton");
    if (!shareBtn) return;

    const newBtn = shareBtn.cloneNode(true);
    shareBtn.parentNode.replaceChild(newBtn, shareBtn);

    newBtn.addEventListener("click", async () => {
        const captureElement = document.querySelector("#popupOverlay .popup-content");
        const controls = captureElement.querySelector('.popup-buttons-container');
        const mode = loadSharePreference();

        if (controls) controls.style.display = "none";

        try {
            const canvas = await html2canvas(captureElement, {
                scale: 3,
                backgroundColor: '#fffde7',
                useCORS: true
            });

            const blob = await new Promise(res => canvas.toBlob(res, "image/png"));

            if (mode === 'copy') {
                await copyImageToClipboard(blob);
            } else {
                if (!navigator.share) { alert("อุปกรณ์นี้ไม่รองรับการส่งต่อ"); return; }
                const file = new File([blob], "lottery-result.png", { type: "image/png" });
                await navigator.share({ files: [file] });
            }

        } catch (err) {
            console.error(err);
            if (err.name !== 'AbortError') alert("เกิดข้อผิดพลาด: " + err.message);
        } finally {
            if (controls) controls.style.display = "flex";
        }
    });
}

function setupTelegramLaoShareButton() {
    const tgBtn = document.getElementById("telegramShareLaoBtn");
    if (!tgBtn) return;
    
    const newBtn = tgBtn.cloneNode(true);
    tgBtn.parentNode.replaceChild(newBtn, tgBtn);
    
    newBtn.addEventListener("click", async () => {
        const captureElement = document.querySelector("#popupOverlay .popup-content");
        const controls = captureElement.querySelector('.popup-buttons-container');
        
        if (controls) controls.style.display = "none";
        
        try {
            const canvas = await html2canvas(captureElement, {
                scale: 3,
                backgroundColor: '#fffde7',
                useCORS: true
            });
            
            const blob = await new Promise(res => canvas.toBlob(res, "image/png"));
            const caption = "";
            
            await shareToTelegram(blob, caption);
            
        } catch (err) {
            console.error(err);
            alert('เกิดข้อผิดพลาดในการส่งไป Telegram');
        } finally {
            if (controls) controls.style.display = "flex";
        }
    });
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
    displayNumberGroup("first-prize-display", document.getElementById("first-prize").value, "thai-red", 42, 22);
    displayNumberGroup("display-front-three-1", document.getElementById("front-three-1").value, "thai-blue", 42, 22);
    displayNumberGroup("display-front-three-2", document.getElementById("front-three-2").value, "thai-blue", 42, 22);
    displayNumberGroup("display-back-three-1", document.getElementById("back-three-1").value, "thai-green", 42, 22);
    displayNumberGroup("display-back-three-2", document.getElementById("back-three-2").value, "thai-green", 42, 22);
    displayNumberGroup("display-back-two", document.getElementById("back-two").value, "thai-orange", 52, 32);
    
    showThaiPopup();
    setupSaveThaiImageButton();
    setupShareThaiImageButton();
    setupTelegramThaiShareButton();
}

function setupSaveThaiImageButton() {
    const saveBtn = document.getElementById("saveThaiAsImageButton");
    if (!saveBtn) return;
    
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

    newSaveBtn.addEventListener("click", function() {
        const captureElement = document.querySelector("#thaiLotteryPopupContent");
        const controlsElement = captureElement.querySelector('.popup-controls');
        const dateText = document.getElementById("display-draw-date").innerText.replace(/[^a-zA-Z0-9-]/g, '_');
        const firstPrize = document.getElementById("first-prize").value || "XXXXXX";

        if (controlsElement) { controlsElement.style.display = 'none'; }

        setTimeout(() => {
            html2canvas(captureElement, {
                useCORS: true,
                scale: 4,
                backgroundColor: '#FFFFD1',
                logging: false,
                allowTaint: true,
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = `ผลสลากรัฐบาล-${firstPrize}-${dateText}.png`;
                link.href = canvas.toDataURL("image/png", 1.0);
                link.click();
            }).catch(err => {
                console.error("Error:", err);
                alert("ขออภัย, ไม่สามารถบันทึกเป็นรูปภาพได้");
            }).finally(() => {
                if (controlsElement) { controlsElement.style.display = 'flex'; }
            });
        }, 100);
    });
}

function setupShareThaiImageButton() {
    const shareBtn = document.getElementById("shareThaiImageButton");
    if (!shareBtn) return;

    const newBtn = shareBtn.cloneNode(true);
    shareBtn.parentNode.replaceChild(newBtn, shareBtn);

    newBtn.addEventListener("click", async () => {
        const captureElement = document.querySelector("#thaiLotteryPopupContent");
        const controls = captureElement.querySelector('.popup-controls');
        const mode = loadSharePreference();
        
        if (controls) controls.style.display = "none";

        try {
            const canvas = await html2canvas(captureElement, {
                scale: 4, 
                backgroundColor: '#FFFFD1',
                useCORS: true,
                logging: false
            });

            const blob = await new Promise(res => canvas.toBlob(res, "image/png"));

            if (mode === 'copy') {
                await copyImageToClipboard(blob);
            } else {
                if (!navigator.share) { alert("อุปกรณ์นี้ไม่รองรับฟีเจอร์การแชร์"); return; }
                
                const dateText = document.getElementById("display-draw-date").innerText || "result";
                const fileName = `thai-lottery-${dateText.replace(/\s/g, '_')}.png`;
                const file = new File([blob], fileName, { type: "image/png" });

                if (navigator.canShare && !navigator.canShare({ files: [file] })) {
                    alert("อุปกรณ์ไม่รองรับการแชร์ไฟล์นี้");
                    return;
                }
                await navigator.share({ files: [file] });
            }

        } catch (err) {
            console.error("Error:", err);
            if (err.name !== 'AbortError') alert("เกิดข้อผิดพลาด: " + err.message);
        } finally {
            if (controls) controls.style.display = "flex";
        }
    });
}

function setupTelegramThaiShareButton() {
    const tgBtn = document.getElementById("telegramShareThaiBtn");
    if (!tgBtn) return;
    
    const newBtn = tgBtn.cloneNode(true);
    tgBtn.parentNode.replaceChild(newBtn, tgBtn);
    
    newBtn.addEventListener("click", async () => {
        const captureElement = document.querySelector("#thaiLotteryPopupContent");
        const controls = captureElement.querySelector('.popup-controls');
        
        if (controls) controls.style.display = "none";
        
        try {
            const canvas = await html2canvas(captureElement, {
                scale: 4,
                backgroundColor: '#FFFFD1',
                useCORS: true,
                logging: false
            });
            
            const blob = await new Promise(res => canvas.toBlob(res, "image/png"));
            const caption = "";
            
            await shareToTelegram(blob, caption);
            
        } catch (err) {
            console.error(err);
            alert('เกิดข้อผิดพลาดในการส่งไป Telegram');
        } finally {
            if (controls) controls.style.display = "flex";
        }
    });
}

// --- PWA Installation Handler ---
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    const installBtn = document.createElement('button');
    installBtn.id = 'installPwaBtn';
    installBtn.innerHTML = '📲 ติดตั้งแอป';
    installBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #28a745, #1e7e34);
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 20px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to install prompt: ${outcome}`);
            deferredPrompt = null;
            installBtn.style.display = 'none';
        }
    });
    
    document.body.appendChild(installBtn);
});

window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    const installBtn = document.getElementById('installPwaBtn');
    if (installBtn) installBtn.style.display = 'none';
});

// --- Event Listeners ---
document.addEventListener('contextmenu', e => e.preventDefault());

document.addEventListener("DOMContentLoaded", () => {
    initShareSettings();
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
            try { thaiHiddenDateInput.showPicker(); } catch (error) { thaiHiddenDateInput.click(); }
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

// --- Service Worker Registration ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw-main.js')
            .then(reg => {
                console.log('Service Worker registered successfully for 5.html:', reg);
            })
            .catch(err => {
                console.error('Service Worker registration failed:', err);
            });
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            window.location.reload();
            refreshing = true;
        }
    });
}