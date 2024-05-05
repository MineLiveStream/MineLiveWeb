window.onload = function() {
    fetchStreamLibrary()
        .then(data => {
            if (data && data.code === 401) {
                window.location.href = '../#login';
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
                snackbar.textContent = data.msg;
                snackbar.open = true;
            }

        })
        .catch(error => {
            console.error('检测到错误', error);
        });
    checkAdmin();
}

let page = 1;
const size = 8;
let maxPage = 1;
let hdVideoPrice = 0;
let videoPrice = 0;
let picPrice = 0;
const dialog = document.getElementById("deleteDialog");
const snackbar = document.querySelector(".example-snackbar");
const dialogCancelBtn = document.getElementById('dialogCancelBtn');
const dialogConfirmBtn = document.getElementById('dialogConfirmBtn');
let buyId = 0;
const paymentDialog = document.getElementById('paymentDialog');
const qrcodeDialog = document.getElementById('qrcodeDialog');
const qrCodeElement = document.getElementById('qr-code');
let changeId = 0;
function truncateString(str) {
    if (str.length > 20) {
        return str.substring(0, 20)  + "...";
    }
    return str;
}

function renderStreamList(data) {
    const materialListTbody = document.getElementById('material-list-tbody');
    materialListTbody.innerHTML = ''; // 清空表格内容
    
    if (data && data.list) {
        maxPage = data.total / size;
        maxPage = Math.ceil(data.total / size);
        document.getElementById("pageText").textContent = "第" + page + "页，共" + maxPage + "页";
        if (data.list.length === 0) {
            materialListTbody.innerHTML = '<tr><td colspan="6" class="mdui-text-center">此页没有推流，请先创建</td></tr>';
            return;
        }
        data.list.forEach(item => {
            const expiredDate = new Date(item.expired);
            const expired = expiredDate.getTime() < new Date().getTime();
            const tr = document.createElement('tr');
            ['name', 'streamUrl', 'streamKey', "materialName"].forEach(key => {
                const td = document.createElement('td');
                if (key === 'streamUrl' || key === 'streamKey') {
                    const a = document.createElement('a');
                    const tip = document.createElement('mdui-tooltip');
                    tip.content = "点击复制";
                    td.addEventListener('click', () => {
                        navigator.clipboard.writeText(item[key]).then(() => {
                            snackbar.textContent = "复制成功";
                            snackbar.open = true;
                        });
                    });
                    a.innerHTML = truncateString(item[key]);
                    tip.appendChild(a);
                    td.appendChild(tip);
                } else {
                    td.textContent = truncateString(item[key]);
                }
                if (key === 'materialName') {
                    const tooltip = document.createElement('mdui-tooltip');
                    const icon = document.createElement('mdui-icon');
                    if (item.materialType === "HD_VIDEO") {
                        tooltip.content = "该推流允许使用高清视频或图片素材"
                        icon.style = "color: orange";
                        icon.name = "hd";
                    } else if (item.materialType === "VIDEO") {
                        tooltip.content = "该推流允许使用视频或图片素材" + (expired ? "" : "，点击升级");
                        icon.style = "color: orange";
                        icon.name = "ondemand_video";
                        if (!expired) {
                            icon.addEventListener('click', () => {
                                const priceDay = (hdVideoPrice - videoPrice) / 30;
                                const day = (expiredDate.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000);
                                document.getElementById('lastDayText').textContent = day.toFixed() + " 天";
                                document.getElementById('updatePriceText').textContent = (priceDay * day).toFixed(2) + " 元";
                                document.getElementById('updateDialog').open = true;
                                buyId = item.id;
                            });
                        }
                    } else {
                        tooltip.content = "该推流仅能使用图片素材" + (expired ? "" : "，点击升级");
                        icon.style = "color: gray";
                        icon.name = "photo";
                        if (!expired) {
                            icon.addEventListener('click', () => {
                                const priceDay = (videoPrice - picPrice) / 30;
                                const day = (expiredDate.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000);
                                document.getElementById('lastDayText').textContent = day.toFixed() + " 天";
                                document.getElementById('updatePriceText').textContent = (priceDay * day).toFixed(2) + " 元";
                                document.getElementById('updateDialog').open = true;
                                buyId = item.id;
                            });
                        }
                    }
                    tooltip.appendChild(icon);
                    td.appendChild(tooltip);
                }
                tr.appendChild(td);
            });
            const expiredTime = expiredDate.toLocaleString();
            const tdExpiredTime = document.createElement('td');
            tdExpiredTime.textContent = expiredTime;
            tr.appendChild(tdExpiredTime);

            const switchTd = document.createElement('td');
            const switchBtn = document.createElement('mdui-switch');
            switchBtn.className = 'div';
            switchBtn.checked = item.status !== "OFF";
            switchBtn.addEventListener('change', () => {
              const params = {
                  id: item.id
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
                        switchBtn.checked = on;
                        snackbar.textContent = '推流已' + (on ? "开启" : "关闭");
                        setTimeout(() => {
                            fetchStreamLibrary()
                                .then(data => {
                                    renderStreamList(data);
                                })
                                .catch(error => {
                                    console.error('处理响应时出错:', error);
                                });
                        }, 5000);
                    } else {
                        switchBtn.checked = false;
                        snackbar.textContent = data.msg;
                    }
                  snackbar.open = true;
              
              })
              .catch(error => {
                  console.error('检测到错误', error);
                  snackbar.textContent = '操作出错，请重试！';
                  snackbar.open = true;
              });
            });
            switchTd.appendChild(switchBtn);
            tr.appendChild(switchTd);

            const btnTd = document.createElement('td');
          
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
                if (expired) {
                    paymentDialog.headline = '开通推流';
                    radio.disabled = false;
                } else {
                    paymentDialog.headline = '续费推流';
                    radio.disabled = true;
                    if (item.materialType === "VIDEO") radio.value = "video";
                    if (item.materialType === "PIC") radio.value = "pic";
                    if (item.materialType === "HD_VIDEO") radio.value = "hdVideo";
                }
                paymentDialog.open = true;
                updatePriceText();
                buyId = item.id;
            });
            btnTd.appendChild(payButton);

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
            btnTd.appendChild(changeButton);

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
                        snackbar.textContent = "获取日志出错";
                        snackbar.open = true;
                        throw new Error('错误响应码');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.code === 200) {
                        if (data.log.length === 0) {
                            snackbar.textContent = "该推流暂无日志，请先启动";
                            snackbar.open = true;
                        } else {
                            data.log.forEach(line => {
                                const p = document.createElement('p');
                                p.innerHTML = line;
                                logDiv.appendChild(p);
                            });
                            logDialog.open = true;
                        }
                    } else {
                        snackbar.textContent = "获取日志失败" + resJson.msg;
                        snackbar.open = true;
                    }
                })
                .catch(error => {
                    console.error('检测到错误', error);
                });
                const closeButton = document.getElementById("logDialogCloseBtn");
                closeButton.addEventListener("click", () => logDialog.open = false);
            });
            btnTd.appendChild(logButton);

            const deleteButton = document.createElement('mdui-chip');
            deleteButton.innerHTML = '删除';
            deleteButton.addEventListener('click', () => {
                dialog.open = true;
                dialog.description = item.name;
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
                                snackbar.textContent = "删除成功";
                                tr.parentNode.removeChild(tr);
                            } else {
                                snackbar.textContent = data.msg;
                            }
                            snackbar.open = true;
                        })
                        .catch(error => {
                            console.error('检测到错误', error);
                        });
                });
            });
            btnTd.appendChild(deleteButton);
            tr.appendChild(btnTd);

            materialListTbody.appendChild(tr);
        });
    } else {
        materialListTbody.innerHTML = '<tr><td colspan="6" class="mdui-text-center">获取推流失败，请刷新列表</td></tr>';
    }
}

function buy(type = "ALIPAY", month = 1) {
    snackbar.textContent = '正在创建订单，请稍后...';
    snackbar.open = true;
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
                var qr = new QRious();
                qr.backgroundAlpha = 0.5;
                qr.foregroundAlpha = 0.9;
                qr.size = 250;
                qr.value = data.qrcode;
                const qrCodeDataUrl = qr.toDataURL();
                const qrCodeImage = new Image();
                qrCodeImage.src = qrCodeDataUrl;
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
                snackbar.textContent = data.msg;
                snackbar.open = true;
            }
        })
        .catch(error => {
            console.error('检测到错误', error);
            snackbar.textContent = '请求支付时出错，请重试！';
            snackbar.open = true;
        });
}

function cdk() {
    const cdkConfirmBtn = document.getElementById('cdkConfirmBtn');
    const cdkInput = document.getElementById('cdkInput');
    if (!cdkInput.value) {
        cdkConfirmBtn.loading = false;
        snackbar.textContent = "兑换码不可为空";
        snackbar.open = true;
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
                snackbar.textContent = "兑换成功";
                paymentDialog.open = false;
                fetchStreamLibrary()
                    .then(data => {
                        renderStreamList(data);
                    })
                    .catch(error => {
                        console.error('处理响应时出错:', error);
                    });
            } else {
                snackbar.textContent = data.msg;
            }
            snackbar.open = true;
            cdkConfirmBtn.loading = false;
        })
        .catch(error => {
            console.error('检测到错误', error);
            snackbar.textContent = '处理兑换请求时出错，请重试！';
            snackbar.open = true;
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
            snackbar.textContent = "支付成功"
            snackbar.open = true;
            fetchStreamLibrary()
                .then(data => {
                    renderStreamList(data);
                })
                .catch(error => {
                    console.error('处理响应时出错:', error);
                });
            break;
        } else if (data.code !== 5000) {
            snackbar.textContent = data.msg;
            snackbar.open = true;
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
    if (picPrice === 0 || videoPrice === 0) {1
        snackbar.textContent = "获取价格出错，请刷新页面";
        snackbar.open = true;
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

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('lastPageBtn')
        .addEventListener('click', function() {
            if (page > 1) {
                page --;
                fetchStreamLibrary()
                    .then(data => {
                        renderStreamList(data);
                    })
                    .catch(error => {
                        console.error('处理响应时出错:', error);
                    });
            } else {
                snackbar.textContent = "已经到尽头啦>.<";
                snackbar.open = true;
            }
        });
    document.getElementById('nextPageBtn')
        .addEventListener('click', function() {
            if (maxPage > page) {
                page ++;
                fetchStreamLibrary()
                    .then(data => {
                        renderStreamList(data);
                    })
                    .catch(error => {
                        console.error('处理响应时出错:', error);
                    });
            } else {
                snackbar.textContent = "已经到尽头啦>.<";
                snackbar.open = true;
            }
        });
    // 登出
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userAdmin');
        window.location.href = '../';
    });
    // 取消订单
    const cancelOrderBtn = document.getElementById('cancelOrderBtn');
    cancelOrderBtn.addEventListener('click', function() {
        qrcodeDialog.open = false;
        while (qrCodeElement.firstChild) {
            qrCodeElement.removeChild(qrCodeElement.firstChild);
        }
    });
    const radio = document.getElementById('radio');
    radio.addEventListener('click', function() {
        updatePriceText();
    });
    const monthSlider = document.getElementById('monthSlider');
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
                        snackbar.textContent = '创建成功';
                        fetchStreamLibrary()
                            .then(data => {
                                renderStreamList(data);
                            })
                            .catch(error => {
                                console.error('处理响应时出错:', error);
                            });
                    } else {
                        snackbar.textContent = data.msg;
                    }
                    snackbar.open = true;

                })
                .catch(error => {
                    console.error('检测到错误', error);
                    snackbar.textContent = '操作出错，请重试！';
                    snackbar.open = true;
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
                        snackbar.textContent = '更新成功';
                        fetchStreamLibrary()
                            .then(data => {
                                renderStreamList(data);
                            })
                            .catch(error => {
                                console.error('处理响应时出错:', error);
                            });
                    } else {
                        snackbar.textContent = data.msg;
                    }
                    snackbar.open = true;

                })
                .catch(error => {
                    console.error('检测到错误', error);
                    snackbar.textContent = '操作出错，请重试！';
                    snackbar.open = true;
                });
        }
    });
    const changeCancelBtn = document.getElementById('changeCancelBtn');
    changeCancelBtn.addEventListener('click', function() {
        changeDialog.open = false;
    });
    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn.addEventListener('click', function() {
        refreshBtn.loading = true;
        fetchStreamLibrary()
            .then(data => {
                if (data.code === 200) {
                    renderStreamList(data);
                    snackbar.textContent = "刷新成功";
                    snackbar.open = true;
                    refreshBtn.loading = false;
                }
            })
            .catch(error => {
                console.error('处理响应时出错:', error);
                snackbar.textContent = "刷新失败";
                snackbar.open = true;
                refreshBtn.loading = false;
            });
    });
});

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

let materialId = 0;

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