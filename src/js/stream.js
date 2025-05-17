import {
    api
} from './api';
import token from './api';
import checkAdmin from './permission';
import QRious from 'qrious';
import {
    snackbar
} from "mdui/functions/snackbar";
import router from "@/router";

let page = 1;
const size = 9;
let maxPage = 1;
let hdVideoPrice = 0;
let videoPrice = 0;
let picPrice = 0;
let buyId = 0;
let buyStatus = false;
let buyStatusBtn;
let changeId = 0;
let materialId = 0;

export default function init() {
    const paymentDialog = document.getElementById('paymentDialog');
    const qrcodeDialog = document.getElementById('qrcodeDialog');
    document.getElementById('materialBtn').addEventListener('click', function() {
        router.push("/material");
    });
    fetchStreamLibrary()
        .then(data => {
            if (data && data.code === 401) {
                router.push('/?login=1');
                return;
            }
            renderStreamList(data);
        })
        .catch(error => {
            console.error('处理响应时出错:', error);
        });
    fetchMaterialLibrary(1, 30)
        .then(data => {
            renderMaterialList(data);
        })
        .catch(error => {
            console.error('处理响应时出错:', error);
        });
    fetch(api + '/price', {
            headers: {
                Authorization: `Bearer ${token()}`
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('错误响应码');
            }
            return response.json();
        })
        .then(data => {
            if (data.code === 200) {
                picPrice = data.picPrice;
                videoPrice = data.videoPrice;
                hdVideoPrice = data.hdVideoPrice;
            } else {
                switchBtn.checked = false;
                snackbar({
                    message: data.msg
                });
            }

        })
        .catch(error => {
            console.error('检测到错误', error);
        });
    checkAdmin();

    document.getElementById('lastPageBtn')
        .addEventListener('click', function() {
            if (page > 1) {
                page--;
                fetchStreamLibrary()
                    .then(data => {
                        renderStreamList(data);
                    })
                    .catch(error => {
                        console.error('处理响应时出错:', error);
                    });
            } else {
                snackbar({
                    message: "已经到尽头啦>.<"
                });
            }
        });
    document.getElementById('nextPageBtn')
        .addEventListener('click', function() {
            if (maxPage > page) {
                page++;
                fetchStreamLibrary()
                    .then(data => {
                        renderStreamList(data);
                    })
                    .catch(error => {
                        console.error('处理响应时出错:', error);
                    });
            } else {
                snackbar({
                    message: "已经到尽头啦>.<"
                });
            }
        });
    // 登出
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userAdmin');
        router.push('/');
    });
    // 取消订单
    const cancelOrderBtn = document.getElementById('cancelOrderBtn');
    cancelOrderBtn.addEventListener('click', function() {
        qrcodeDialog.open = false;
        const qrCodeElement = document.getElementById('qrcode');
        while (qrCodeElement.firstChild) {
            qrCodeElement.removeChild(qrCodeElement.firstChild);
        }
    });
    const radio = document.getElementById('radio');
    radio.addEventListener('click', function() {
        updatePriceText();
    });
    const monthSlider = document.getElementById('monthSlider');
    monthSlider.value = 1;
    monthSlider.min = 1;
    monthSlider.max = 12;
    monthSlider.addEventListener('input', function() {
        updatePriceText();
    });
    const dialogAlipayBtn = document.getElementById('dialogAlipayBtn');
    dialogAlipayBtn.addEventListener('click', function() {
        buy("ALIPAY", monthSlider.value);
        paymentDialog.open = false;
    });
    const cancelPaymentBtn = document.getElementById('cancelPaymentBtn');
    cancelPaymentBtn.addEventListener('click', function() {
        paymentDialog.open = false;
    });
    const dialogWechatBtn = document.getElementById('dialogWechatBtn');
    dialogWechatBtn.addEventListener('click', function() {
        buy("WECHAT", monthSlider.value);
        paymentDialog.open = false;
    });

    const updateDialog = document.getElementById('updateDialog');
    const cancelUpdateBtn = document.getElementById('cancelUpdateBtn');
    cancelUpdateBtn.addEventListener('click', function() {
        updateDialog.open = false;
    });
    const updateAlipayBtn = document.getElementById('updateAlipayBtn');
    updateAlipayBtn.addEventListener('click', function() {
        buy("ALIPAY", 0);
        updateDialog.open = false;
    });
    const updateWechatBtn = document.getElementById('updateWechatBtn');
    updateWechatBtn.addEventListener('click', function() {
        buy("WECHAT", 0);
        updateDialog.open = false;
    });
    const cdkDialog = document.getElementById('cdkDialog');
    const useCdkBtn = document.getElementById('useCdkBtn');
    useCdkBtn.addEventListener('click', function() {
        cdkDialog.open = true;
    });

    const cdkCancelBtn = document.getElementById('cdkCancelBtn');
    cdkCancelBtn.addEventListener('click', function() {
        cdkDialog.open = false;
    });
    const cdkConfirmBtn = document.getElementById('cdkConfirmBtn');
    cdkConfirmBtn.addEventListener('click', function() {
        cdkConfirmBtn.loading = true;
        cdk();
    });

    const createStreamBtn = document.getElementById('createStreamBtn');
    createStreamBtn.addEventListener('click', function() {
        const changeDialog = document.getElementById("changeDialog");
        changeDialog.headline = "新增推流";
        changeDialog.description = "";
        changeDialog.open = true;
        changeId = 0;
    });
    const changeConfirmBtn = document.getElementById('changeConfirmBtn');
    changeConfirmBtn.addEventListener('click', function() {
        if (changeId === 0) {
            const params = {
                name: document.getElementById('streamName').value,
                url: document.getElementById('streamUrl').value,
                key: document.getElementById('streamKey').value,
                materialId: materialId
            };
            fetch(api + '/stream', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + token(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(params)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('错误响应码');
                    }
                    return response.json();
                })
                .then(data => {
                    changeDialog.open = false;
                    if (data.code === 200) {
                        snackbar({
                            message: '创建成功'
                        });
                        fetchStreamLibrary()
                            .then(data => {
                                renderStreamList(data);
                            })
                            .catch(error => {
                                console.error('处理响应时出错:', error);
                            });
                    } else {
                        snackbar({
                            message: data.msg
                        });
                    }

                })
                .catch(error => {
                    console.error('检测到错误', error);
                    snackbar({
                        message: '操作出错，请重试！'
                    });
                });
        } else {
            const streamName = document.getElementById('streamName').value;
            const streamUrl = document.getElementById('streamUrl').value;
            const streamKey = document.getElementById('streamKey').value;

            const params = {
                id: changeId,
                name: streamName ? streamName : undefined,
                url: streamUrl ? streamUrl : undefined,
                key: streamKey ? streamKey : undefined,
                materialId: materialId ? materialId : undefined
            };

            fetch(api + '/stream', {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer ' + token(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(params)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('错误响应码');
                    }
                    return response.json();
                })
                .then(data => {
                    changeDialog.open = false;
                    if (data.code === 200) {
                        snackbar({
                            message: '更新成功'
                        });
                        fetchStreamLibrary()
                            .then(data => {
                                renderStreamList(data);
                            })
                            .catch(error => {
                                console.error('处理响应时出错:', error);
                            });
                    } else {
                        snackbar({
                            message: data.msg
                        });
                    }

                })
                .catch(error => {
                    console.error('检测到错误', error);
                    snackbar({
                        message: '操作出错，请重试！'
                    });
                });
        }
    });
    const changeCancelBtn = document.getElementById('changeCancelBtn');
    changeCancelBtn.addEventListener('click', function() {
        changeDialog.open = false;
    });
    const refreshStreamBtn = document.getElementById('refreshStreamBtn');
    refreshStreamBtn.addEventListener('click', function() {
        refreshStreamBtn.loading = true;
        fetchStreamLibrary()
            .then(data => {
                if (data.code === 200) {
                    renderStreamList(data);
                    snackbar({
                        message: "刷新成功"
                    });
                    refreshStreamBtn.loading = false;
                }
            })
            .catch(error => {
                console.error('处理响应时出错:', error);
                snackbar({
                    message: "刷新失败"
                });
                refreshStreamBtn.loading = false;
            });
    });
}

function truncateString(str) {
    if (str.length > 20) {
        return str.substring(0, 20) + "...";
    }
    return str;
}

function switchStream(streamId) {
    const params = {
        id: streamId
    };
    fetch(api + '/switch-stream', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('错误响应码');
            }
            return response.json();
        })
        .then(data => {
            if (data.code === 200) {
                const on = data.status === "ON";
                buyStatusBtn.disabled = true;
                snackbar({
                    message: '推流' + (on ? "开启" : "关闭") + "中，请稍等..."
                });
            } else {
                buyStatusBtn.disabled = true;
                snackbar({
                    message: data.msg
                });
            }
            setTimeout(() => {
                fetchStreamLibrary()
                    .then(data => {
                        renderStreamList(data);
                    })
                    .catch(error => {
                        console.error('处理响应时出错:', error);
                    });
            }, 5000);
        })
        .catch(error => {
            console.error('检测到错误', error);
            snackbar({
                message: '操作出错，请重试！'
            });
        });
}

function renderStreamList(data) {
    const dialog = document.getElementById("deleteDialog");
    const paymentDialog = document.getElementById('paymentDialog');
    const container = document.getElementById("streamCardList");
    container.innerHTML = '';
    if (data && data.list) {
        maxPage = data.total / size;
        maxPage = Math.ceil(data.total / size);
        if (maxPage === 0) maxPage = 1;
        document.getElementById("countText").textContent = "已创建 " + data.total + " 个推流";
        document.getElementById("pageText").textContent = "第" + page + "页，共" + maxPage + "页";
        if (data.list.length === 0) {
            container.innerHTML = '<h3>此页没有素材，请先上传</h3>';
            return;
        }
        data.list.forEach(item => {
            const expired = item.expired <= 0;
            const card = document.createElement('mdui-card');
            card.style = "width: 360px; background-color: rgba(var(--mdui-color-on-secondary-light, 0.8));";

            const content = document.createElement('div');
            content.style = "padding: 16px";
            const titleRow = document.createElement('div');
            titleRow.style = "display: flex; align-items: center;";

            const tooltip = document.createElement('mdui-tooltip');
            const icon = document.createElement('mdui-icon');
            if (item.materialType === "HD_VIDEO") {
                tooltip.content = "该推流允许使用高清视频或图片素材"
                icon.style = "color: orange";
                icon.name = "hd";
            } else if (item.materialType === "VIDEO") {
                tooltip.content = "该推流允许使用视频或图片素材";
                icon.style = "color: orange";
                icon.name = "ondemand_video";
            } else {
                tooltip.content = "该推流仅能使用图片素材";
                icon.style = "color: gray";
                icon.name = "photo";
            }
            tooltip.appendChild(icon);
            titleRow.appendChild(tooltip);

            const name = document.createElement('div');
            name.textContent = item["name"];
            name.style = "font-size: 18px; font-weight: bold; margin-left: 6px;flex-grow: 1";
            titleRow.appendChild(name);

            const switchBtn = document.createElement('mdui-switch');
            switchBtn.style.transform = 'scale(0.7)';
            switchBtn.checked = item["status"] !== "OFF";
            switchBtn.addEventListener('change', () => {
                buyStatusBtn = switchBtn;
                switchStream(item.id);
            });
            titleRow.appendChild(switchBtn);

            content.appendChild(titleRow);

            // 信息
            const stats = document.createElement('div');

            let expiredTime;
            if (item.expired <= 0) {
                expiredTime = "已到期";
            } else if (item.expired < 1000 * 60) {
                expiredTime = "即将到期";
            } else if (item.expired < 1000 * 60 * 60) {
                expiredTime = (item.expired / (1000 * 60)).toFixed(0) + "分钟";
            } else {
                expiredTime = (item.expired / (1000 * 60 * 60)).toFixed(1) + "小时";
            }
            stats.innerHTML = `
                <div style="font-size: 15px; color: gray;margin-top: 6px;">推流地址：${truncateString(item["streamUrl"]) || "未知"}</div>
                <div style="font-size: 15px; color: gray;">推流密钥：${truncateString(item["streamKey"]) || "未知"}</div>
                <div style="font-size: 15px; color: gray;">素材名称：${item["materialName"] || "未知"}</div>
                <div style="font-size: 15px; color: gray;">剩余时长：${expiredTime || "未知"}</div>
            `;
            stats.style = "margin-bottom: 8px;";
            content.appendChild(stats);

            // 按钮
            const btnDiv = document.createElement('div');
            btnDiv.style = "display: flex; gap: 2px";
            const payButton = document.createElement('mdui-chip');
            if (expired) {
                payButton.innerHTML = '开通';
            } else {
                payButton.innerHTML = '续费';
            }
            payButton.style = "margin-right: 1px";
            payButton.addEventListener('click', () => {
                updatePriceText();
                const radio = document.getElementById('radio');
                let updatable = false;
                const materialTypeText = document.getElementById("paymentUpdateBtn");
                if (expired) {
                    paymentDialog.headline = '开通推流';
                    radio.disabled = false;
                    materialTypeText.style.display = "none";
                } else {
                    paymentDialog.headline = '续费推流';
                    radio.disabled = true;
                    let des;
                    let priceDay;
                    if (item.materialType === "VIDEO") {
                        updatable = true;
                        radio.value = "video";
                        des = "可使用高清视频及图片素材";
                        priceDay = (hdVideoPrice - videoPrice) / 30;
                    }
                    if (item.materialType === "PIC") {
                        updatable = true;
                        radio.value = "pic";
                        des = "可使用视频及图片素材";
                        priceDay = (videoPrice - picPrice) / 30;
                    }
                    if (item.materialType === "HD_VIDEO") radio.value = "hdVideo";

                    if (updatable) {
                        materialTypeText.style.display = "";
                        materialTypeText.addEventListener('click', () => {
                            const day = item.expired / (24 * 60 * 60 * 1000);
                            document.getElementById('lastDayText').textContent = day.toFixed() + " 天";
                            document.getElementById('updatePriceText').textContent = (priceDay * day).toFixed(2) + " 元";
                            const updateDialog = document.getElementById('updateDialog');
                            updateDialog.description = des;
                            updateDialog.open = true;
                            buyId = item.id;
                        });
                    } else {
                        materialTypeText.style.display = "none";
                    }
                }
                paymentDialog.open = true;
                updatePriceText();
                buyId = item.id;
                buyStatusBtn = switchBtn;
                buyStatus = item.status !== "OFF";
            });
            btnDiv.appendChild(payButton);

            const changeButton = document.createElement('mdui-chip');
            changeButton.innerHTML = '更改';
            changeButton.style = "margin-right: 1px";
            changeButton.addEventListener('click', () => {
                const changeDialog = document.getElementById("changeDialog");
                changeDialog.headline = "更新推流";
                changeDialog.description = "无变更内容可留空";
                changeDialog.open = true;
                changeId = item.id;
            });
            btnDiv.appendChild(changeButton);

            const logButton = document.createElement('mdui-chip');
            logButton.innerHTML = '日志';
            logButton.style = "margin-right: 1px";
            logButton.addEventListener('click', () => {
                const logDialog = document.getElementById("logDialog");
                const logDiv = document.getElementById("logDiv");
                logDiv.innerHTML = '';
                const params = new URLSearchParams({
                    id: item.id
                });
                const url = api + `/stream-log?${params.toString()}`;
                fetch(url, {
                        headers: {
                            Authorization: `Bearer ${token()}`
                        }
                    })
                    .then(response => {
                        if (!response.ok) {
                            snackbar({
                                message: "获取日志出错"
                            });
                            throw new Error('错误响应码');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.code === 200) {
                            if (data.log.length === 0) {
                                snackbar({
                                    message: "该推流暂无日志，请先启动"
                                });
                            } else {
                                data.log.forEach(line => {
                                    const p = document.createElement('p');
                                    p.innerHTML = line;
                                    logDiv.appendChild(p);
                                });
                                logDialog.open = true;
                            }
                        } else {
                            snackbar({
                                message: "获取日志失败" + resJson.msg
                            });
                        }
                    })
                    .catch(error => {
                        console.error('检测到错误', error);
                    });
                const closeButton = document.getElementById("logDialogCloseBtn");
                closeButton.addEventListener("click", () => logDialog.open = false);
            });
            btnDiv.appendChild(logButton);

            const deleteButton = document.createElement('mdui-chip');
            deleteButton.innerHTML = '删除';
            deleteButton.addEventListener('click', () => {
                dialog.open = true;
                dialog.description = item.name;
                const dialogCancelBtn = document.getElementById('dialogCancelBtn');
                const dialogConfirmBtn = document.getElementById('dialogConfirmBtn');
                dialogCancelBtn.addEventListener('click', () => {
                    dialog.open = false;
                });
                dialogConfirmBtn.addEventListener('click', () => {
                    dialog.open = false;
                    const params = {
                        id: item.id
                    };
                    fetch(api + '/stream', {
                            method: 'DELETE',
                            headers: {
                                'Authorization': 'Bearer ' + token(),
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(params)
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('错误响应码');
                            }
                            return response.json();
                        })
                        .then(data => {
                            if (data.code === 200) {
                                snackbar({
                                    message: "删除成功"
                                });
                                tr.parentNode.removeChild(tr);
                            } else {
                                snackbar({
                                    message: data.msg
                                });
                            }
                        })
                        .catch(error => {
                            console.error('检测到错误', error);
                        });
                });
            });
            btnDiv.appendChild(deleteButton);
            content.appendChild(btnDiv);

            card.appendChild(content);
            container.appendChild(card);
        });
    } else {
        container.innerHTML = '<h3>获取推流失败，请刷新列表</h3>';
    }
}

function buy(type = "ALIPAY", month = 1) {
    if (buyStatus) switchStream(buyId);
    snackbar({
        message: '正在创建订单，请稍后...'
    });
    let materialType;
    const radio = document.getElementById('radio');
    if (radio.value === "pic") {
        materialType = "PIC";
    } else if (radio.value === "video") {
        materialType = "VIDEO";
    } else {
        materialType = "HD_VIDEO";
    }
    const params = {
        id: buyId,
        type: type,
        month: month,
        materialType: materialType
    };
    fetch(api + '/pay', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('错误响应码');
            }
            return response.json();
        })
        .then(data => {
            if (data.code === 200) {
                const qr = new QRious();
                qr.backgroundAlpha = 0.5;
                qr.foregroundAlpha = 0.9;
                qr.size = 250;
                qr.value = data.qrcode;
                const qrCodeDataUrl = qr.toDataURL();
                const qrCodeImage = new Image();
                qrCodeImage.src = qrCodeDataUrl;
                const qrCodeElement = document.getElementById('qrcode');
                while (qrCodeElement.firstChild) {
                    qrCodeElement.removeChild(qrCodeElement.firstChild);
                }
                qrCodeImage.onload = function() {
                    qrCodeElement.appendChild(qrCodeImage);
                };
                qrcodeDialog.description = '付款价格：' + (data.price / 100) + ' 元';
                qrcodeDialog.open = true;
                pollOrderStatus(data.order, 3000);
            } else {
                snackbar({
                    message: data.msg
                });
            }
        })
        .catch(error => {
            console.error('检测到错误', error);
            snackbar({
                message: '请求支付时出错，请重试！'
            });
        });
}

function cdk() {
    const cdkConfirmBtn = document.getElementById('cdkConfirmBtn');
    const cdkInput = document.getElementById('cdkInput');
    if (!cdkInput.value) {
        cdkConfirmBtn.loading = false;
        snackbar({
            message: "兑换码不可为空"
        });
        return;
    }
    const params = {
        id: buyId,
        cdk: cdkInput.value ? cdkInput.value : undefined
    };
    fetch(api + '/cdk', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('错误响应码');
            }
            return response.json();
        })
        .then(data => {
            if (data.code === 200) {
                snackbar({
                    message: "兑换成功"
                });
                paymentDialog.open = false;
                fetchStreamLibrary()
                    .then(data => {
                        renderStreamList(data);
                    })
                    .catch(error => {
                        console.error('处理响应时出错:', error);
                    });
            } else {
                snackbar({
                    message: data.msg
                });
            }
            cdkConfirmBtn.loading = false;
        })
        .catch(error => {
            console.error('检测到错误', error);
            snackbar({
                message: '处理兑换请求时出错，请重试！'
            });
            cdkConfirmBtn.loading = false;
        });
    document.getElementById('cdkDialog').open = false;
    document.getElementById('cdkConfirmBtn').loading = false;
}

async function pollOrderStatus(orderId, interval = 3000) {
    do {
        const data = await checkOrder(orderId);
        if (data.code === 200) {
            qrcodeDialog.open = false;
            snackbar({
                message: "支付成功"
            });
            fetchStreamLibrary()
                .then(data => {
                    renderStreamList(data);
                })
                .catch(error => {
                    console.error('处理响应时出错:', error);
                });
            break;
        } else if (data.code !== 5000) {
            snackbar({
                message: data.msg
            });
            qrcodeDialog.open = false;
            break;
        }
        await new Promise(resolve => setTimeout(resolve, interval));
    } while (true);
}

async function checkOrder(order) {
    try {
        const params = new URLSearchParams({
            order: order
        });
        const url = api + `/pay?${params.toString()}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token()}`
            }
        });

        // 检查响应状态码
        return await response.json();
    } catch (error) {
        // 处理请求错误
        console.error('请求推流时出错:', error);
        return null;
    }
}

async function fetchStreamLibrary() {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });
        const url = api + `/stream?${params.toString()}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token()}`
            }
        });
        return await response.json();
    } catch (error) {
        console.error('请求推流时出错:', error);
        return null;
    }
}

function updatePriceText() {
    if (picPrice === 0 || videoPrice === 0) {
        snackbar({
            message: "获取价格出错，请刷新页面"
        });
        return;
    }
    const priceText = document.getElementById('priceText');
    const radio = document.getElementById('radio');
    let price;
    if (radio.value === "pic") {
        price = picPrice;
    } else if (radio.value === "video") {
        price = videoPrice;
    } else if (radio.value === "hdVideo") {
        price = hdVideoPrice;
    }
    priceText.textContent = (monthSlider.value * price) + " 元";
}

async function fetchMaterialLibrary(page = 1, size = 30) {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });
        const url = api + `/material?${params.toString()}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token()}`
            }
        });
        return await response.json();
    } catch (error) {
        // 处理请求错误
        console.error('请求素材库时出错:', error);
        return null;
    }
}

function renderMaterialList(data) {
    const selectMenu = document.getElementById('selectMenu');
    if (data && data.list) {
        if (data.list.length === 0) {
            selectMenu.label = "请先上传素材";
            selectMenu.disabled = true;
            return;
        }
        data.list.forEach(item => {
            const newMenu = document.createElement('mdui-menu-item');
            newMenu.innerHTML = item.name;
            newMenu.value = "item-" + item.id;
            newMenu.addEventListener('click', () => {
                materialId = item.id;
            });
            selectMenu.appendChild(newMenu);
        });
    } else {
        selectMenu.label = "获取素材失败";
        selectMenu.disabled = true;
    }
}