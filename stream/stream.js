window.onload = function() {
    fetchStreamLibrary(1, 30)
        .then(data => {
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
    const token = localStorage.getItem('userToken');
    if (!token) {
        window.location.href = '../';
    }
    fetch('https://api.minelive.top:28080/price', {
        headers: {
            Authorization: `Bearer ${token}`
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
            } else {
                switchBtn.checked = false;
                snackbar.textContent = data.msg;
                snackbar.open = true;
            }

        })
        .catch(error => {
            console.error('检测到错误', error);
        });
}
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
    
    if (data && data.list && data.list.length > 0) {
        data.list.forEach(item => {
            const tr = document.createElement('tr');
            ['name', 'streamUrl', 'streamKey', "materialName"].forEach(key => {
                const td = document.createElement('td');
                td.textContent = truncateString(item[key]);
                if (key === 'streamUrl' || key === 'streamKey') {
                    td.title = item[key];
                }
                tr.appendChild(td);
            });

            const uploadTime = new Date(item.expired).toLocaleString();
            const tdUploadTime = document.createElement('td');
            tdUploadTime.textContent = uploadTime;
            tr.appendChild(tdUploadTime);

            const switchTd = document.createElement('td');
            const switchBtn = document.createElement('mdui-switch');
            switchBtn.className = 'div';
            if (item.status === "OFF") {
                switchBtn.checked = false;
            } else {
                switchBtn.checked = true;
            }
            switchBtn.addEventListener('change', () => {
              const token = localStorage.getItem('userToken');
              if (!token) {
                  window.location.href = '../';
              }
              const params = {
                  id: item.id
              };
              fetch('https://api.minelive.top:28080/switch-stream', {
                  method: 'POST',
                  headers: {
                      'Authorization': 'Bearer ' + token,
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
                            fetchStreamLibrary(1, 30)
                                .then(data => {
                                    renderStreamList(data);
                                })
                                .catch(error => {
                                    console.error('处理响应时出错:', error);
                                });
                        }, 2000);
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
            payButton.innerHTML = '开通/续费';
            payButton.addEventListener('click', () => {
                updatePriceText();
                paymentDialog.open = true;
                buyId = item.id;
            });
            btnTd.appendChild(payButton);

            const changeButton = document.createElement('mdui-chip');
            changeButton.innerHTML = '更改';
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
            logButton.addEventListener('click', () => {
                const logDialog = document.getElementById("logDialog");
                const logDiv = document.getElementById("logDiv");
                logDiv.innerHTML = '';
                const token = localStorage.getItem('userToken');
                if (!token) {
                    window.location.href = '../';
                }
                const params = new URLSearchParams({
                    id: item.id
                });
                const url = `https://api.minelive.top:28080/stream-log?${params.toString()}`;
                fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
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
                    const token = localStorage.getItem('userToken');
                    if (!token) {
                        window.location.href = '../';
                    }
                    const params = {
                        id: item.id
                    };
                    fetch('https://api.minelive.top:28080/stream', {
                        method: 'DELETE',
                        headers: {
                            'Authorization': 'Bearer ' + token,
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
        materialListTbody.innerHTML = '<tr><td colspan="6" class="mdui-text-center">没有推流可展示</td></tr>'; // 显示无内容提示
    }
}

function buy(type = "ALIPAY", month = 1) {
    snackbar.textContent = '正在创建订单，请稍后...';
    snackbar.open = true;
    const token = localStorage.getItem('userToken');
    if (!token) {
        window.location.href = '../';
    }
    let materialType;
    const radio = document.getElementById('radio');
    if (radio.value === "pic") {
        materialType = "PIC";
    } else {
        materialType = "VIDEO";
    }
    const params = {
        id: buyId,
        type: type,
        month: month,
        materialType: materialType
    };
    fetch('https://api.minelive.top:28080/pay', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
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

async function pollOrderStatus(orderId, interval = 3000) {
    do {
        const data = await checkOrder(orderId);
        if (data.code === 200) {
            qrcodeDialog.open = false;
            snackbar.textContent = "支付成功"
            snackbar.open = true;
            fetchStreamLibrary(1, 30)
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
        const token = localStorage.getItem('userToken');
        if (!token) {
            window.location.href = '../';
        }
        const params = new URLSearchParams({
            order: order
        });
        const url = `https://api.minelive.top:28080/pay?${params.toString()}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // 检查响应状态码
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        // 处理请求错误
        console.error('请求推流时出错:', error);
        return null;
    }
}

async function fetchStreamLibrary(page = 1, size = 30) {
    try {
        const token = localStorage.getItem('userToken');
        if (!token) {
            window.location.href = '../';
        }
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });
        const url = `https://api.minelive.top:28080/stream?${params.toString()}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result;
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
    } else {
        price = videoPrice;
    }
    priceText.textContent = (monthSlider.value * price) + " 元";
}

document.addEventListener('DOMContentLoaded', function() {
    // 登出
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('userToken');
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
    // 素材
    const materialBtn = document.getElementById('materialBtn');
    materialBtn.addEventListener('click', function() {
        window.location.href = '../material';
    });

    const radio = document.getElementById('radio');
    radio.addEventListener('click', function() {
        updatePriceText();
    });
    // 支付
    const monthSlider = document.getElementById('monthSlider');
    monthSlider.addEventListener('input', function() {
        updatePriceText();
    });
    const dialogAlipayBtn = document.getElementById('dialogAlipayBtn');
    dialogAlipayBtn.addEventListener('click', function() {
        buy("ALIPAY", monthSlider.value);
        paymentDialog.open = false;
    });
    // 取消支付
    const cancelPaymentBtn = document.getElementById('cancelPaymentBtn');
    cancelPaymentBtn.addEventListener('click', function() {
        paymentDialog.open = false;
    });
    const dialogWechatBtn = document.getElementById('dialogWechatBtn');
    dialogWechatBtn.addEventListener('click', function() {
        buy("WECHAT", monthSlider.value);
        paymentDialog.open = false;
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
        const token = localStorage.getItem('userToken');
        if (changeId === 0) {
            const params = {
                name: document.getElementById('streamName').value,
                url: document.getElementById('streamUrl').value,
                key: document.getElementById('streamKey').value,
                materialId: materialId
            };
            fetch('https://api.minelive.top:28080/stream', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
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
                        fetchStreamLibrary(1, 30)
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

            fetch('https://api.minelive.top:28080/stream', {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + token,
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
                        fetchStreamLibrary(1, 30)
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
    const groupBtn = document.getElementById('groupBtn');
    groupBtn.addEventListener('click', function() {
        window.open('https://qm.qq.com/q/hpYH0xIsuY', '_blank');
    });
    const changeCancelBtn = document.getElementById('changeCancelBtn');
    changeCancelBtn.addEventListener('click', function() {
        changeDialog.open = false;
    });
    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn.addEventListener('click', function() {
        fetchStreamLibrary(1, 30)
            .then(data => {
                renderStreamList(data);
            })
            .catch(error => {
                console.error('处理响应时出错:', error);
            });
        snackbar.textContent = "刷新成功";
        snackbar.open = true;
    });
});

async function fetchMaterialLibrary(page = 1, size = 30) {
    try {
        const token = localStorage.getItem('userToken');
        if (!token) {
            window.location.href = '../';
        }
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });
        const url = `https://api.minelive.top:28080/material?${params.toString()}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        // 处理请求错误
        console.error('请求素材库时出错:', error);
        return null;
    }
}

let materialId = 0;

function renderMaterialList(data) {
    const selectMenu = document.getElementById('selectMenu');
    if (data && data.list && data.list.length > 0) {
        data.list.forEach(item => {
            const newMenu = document.createElement('mdui-menu-item');
            newMenu.innerHTML = item.name;
            newMenu.value = "item-" + item.id;
            newMenu.addEventListener('click', () => {
                materialId = item.id;
            });
            selectMenu.appendChild(newMenu);
        });
    }
}