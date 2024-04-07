window.onload = function() {
    fetchMaterialLibrary(1, 30)
        .then(data => {
            renderMaterialList(data);
        })
        .catch(error => {
            console.error('处理响应时出错:', error);
        });
}

const dialog = document.getElementById("deleteDialog");
const snackbar = document.querySelector(".example-snackbar");
const dialogCancelBtn = document.getElementById('dialogCancelBtn');
const dialogConfirmBtn = document.getElementById('dialogConfirmBtn');
let buyId = 0;
const paymentDialog = document.getElementById('paymentDialog');
const qrcodeDialog = document.getElementById('qrcodeDialog');
const qrCodeElement = document.getElementById('qr-code');
function truncateString(str) {  
    if (str.length > 20) {  
        return str.substring(0, 20)  + "...";  
    }  
    return str;  
} 

function renderMaterialList(data) {  
    const materialListTbody = document.getElementById('material-list-tbody');  
    materialListTbody.innerHTML = ''; // 清空表格内容  
      
    if (data && data.list && data.list.length > 0) {  
        data.list.forEach(item => {  
            const tr = document.createElement('tr');  
            ['name', 'streamUrl', 'streamKey', "materialId"].forEach(key => {  
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
                  window.location.href = '../login';
              }
              const params = {  
                  id: item.id
              };  
              fetch('https://stmcicp.ranmc.cc:24021/switch-stream', {  
                  method: 'POST',  
                  headers: {  
                      'Authorization': 'Bearer ' + token,  
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(params)  
              })  
              .then(response => {  
                  if (!response.ok) {  
                      throw new Error('Network response was not ok.');  
                  }  
                  return response.json();  
              })  
              .then(data => {
                    if (data.code === 200) {
                        const on = data.status === "ON";
                        switchBtn.checked = on;
                        snackbar.textContent = '推流已' + (on ? "开启" : "关闭");
                        setTimeout(() => {
                            fetchMaterialLibrary(1, 30)
                                .then(data => {
                                    renderMaterialList(data);
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
                  console.error('There has been a problem with your fetch operation:', error);
                  snackbar.textContent = '操作出错，请重试！';
                  snackbar.open = true;
              });
            });
            switchTd.appendChild(switchBtn);
            tr.appendChild(switchTd);
            
            const payButton = document.createElement('mdui-chip');
            payButton.innerHTML = '开通/续费';
            payButton.addEventListener('click', () => {
                paymentDialog.open = true;
                buyId = item.id;
            });

            const btnTd = document.createElement('td');
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
                        window.location.href = '../login';
                    }
                    const params = {
                        id: item.id
                    };
                    fetch('https://stmcicp.ranmc.cc:24021/stream', {
                        method: 'DELETE',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(params)
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok.');
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
                            console.error('There has been a problem with your fetch operation:', error);
                        });
                });
            });
            const changeButton = document.createElement('mdui-chip');
            changeButton.innerHTML = '更改';
            changeButton.addEventListener('click', () => {
                const changeDialog = document.getElementById("changeDialog");
                changeDialog.headline = "更新推流";
                changeDialog.description = "无变更内容可留空";
                changeDialog.open = true;
                const changeConfirmBtn = document.getElementById('changeConfirmBtn');
                changeConfirmBtn.addEventListener('click', function() {
                    const token = localStorage.getItem('userToken');
                    const streamName = document.getElementById('streamName').value;
                    const streamUrl = document.getElementById('streamUrl').value;
                    const streamKey = document.getElementById('streamKey').value;
                    const materialId = document.getElementById('materialId').value;

                    const params = {
                        id: item.id,
                        name: streamName ? streamName : undefined,
                        url: streamUrl ? streamUrl : undefined,
                        key: streamKey ? streamKey : undefined,
                        materialId: materialId ? materialId : undefined
                    };

                    fetch('https://stmcicp.ranmc.cc:24021/stream', {
                        method: 'PUT',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(params)
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok.');
                            }
                            return response.json();
                        })
                        .then(data => {
                            changeDialog.open = false;
                            if (data.code === 200) {
                                snackbar.textContent = '更新成功';
                                fetchMaterialLibrary(1, 30)
                                    .then(data => {
                                        renderMaterialList(data);
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
                            console.error('There has been a problem with your fetch operation:', error);
                            snackbar.textContent = '操作出错，请重试！';
                            snackbar.open = true;
                        });
                });
            });

            btnTd.appendChild(payButton);
            btnTd.appendChild(changeButton);
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
        window.location.href = '../login';
    }
    const params = {
        id: buyId,
        type: type,
        month: month
    };
    fetch('https://stmcicp.ranmc.cc:24021/pay', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
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
                qrcodeDialog.description = '付款价格：' + (data.price / 100) + ' 元(新平台优惠)';
                qrcodeDialog.open = true;
                pollOrderStatus(data.order, 3000);
            } else {
                snackbar.textContent = data.msg;
                snackbar.open = true;
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
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
            fetchMaterialLibrary(1, 30)
                .then(data => {
                    renderMaterialList(data);
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
            window.location.href = '../login';
        }
        const params = new URLSearchParams({
            order: order
        });
        const url = `https://stmcicp.ranmc.cc:24021/pay?${params.toString()}`;
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

async function fetchMaterialLibrary(page = 1, size = 10) {
    try {
        const token = localStorage.getItem('userToken');
        if (!token) {
            window.location.href = '../login';
        }
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });
        const url = `https://stmcicp.ranmc.cc:24021/stream?${params.toString()}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // 检查响应状态码
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 解析JSON响应
        const result = await response.json();

        // 返回解析后的数据
        return result;
    } catch (error) {
        // 处理请求错误
        console.error('请求推流时出错:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // 登出
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('userToken');
        window.location.href = '../login';
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
    // 支付
    const monthSlider = document.getElementById('monthSlider');
    const dialogAlipayBtn = document.getElementById('dialogAlipayBtn');
    dialogAlipayBtn.addEventListener('click', function() {
        buy("ALIPAY", monthSlider.value);
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
        const changeConfirmBtn = document.getElementById('changeConfirmBtn');
        changeConfirmBtn.addEventListener('click', function() {
            const token = localStorage.getItem('userToken');
            const params = {
                name: document.getElementById('streamName').value,
                url: document.getElementById('streamUrl').value,
                key: document.getElementById('streamKey').value,
                materialId: document.getElementById('materialId').value
            };
            fetch('https://stmcicp.ranmc.cc:24021/stream', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok.');
                    }
                    return response.json();
                })
                .then(data => {
                    changeDialog.open = false;
                    if (data.code === 200) {
                        snackbar.textContent = '创建成功';
                        fetchMaterialLibrary(1, 30)
                            .then(data => {
                                renderMaterialList(data);
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
                    console.error('There has been a problem with your fetch operation:', error);
                    snackbar.textContent = '操作出错，请重试！';
                    snackbar.open = true;
                });
        });
    });
    const groupBtn = document.getElementById('groupBtn');
    groupBtn.addEventListener('click', function() {
        window.open('https://qm.qq.com/q/hpYH0xIsuY', '_blank');
    });
    const helpBtn = document.getElementById('helpBtn');
    helpBtn.addEventListener('click', function() {
        window.open('../doc', '_blank');
    });
    const changeCancelBtn = document.getElementById('changeCancelBtn');
    changeCancelBtn.addEventListener('click', function() {
        changeDialog.open = false;
    });
    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn.addEventListener('click', function() {
        fetchMaterialLibrary(1, 30)
            .then(data => {
                renderMaterialList(data);
            })
            .catch(error => {
                console.error('处理响应时出错:', error);
            });
        snackbar.textContent = "刷新成功";
        snackbar.open = true;
    });
});