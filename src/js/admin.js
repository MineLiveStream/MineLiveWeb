import {
    api
} from './api';
import token from './api';
import {
    snackbar
} from "mdui/functions/snackbar";
import router from "@/router";

let page = 1;
const size = 9;
let maxPage = 1;
let changeId = 0;

export default function init() {
    const admin = localStorage.getItem('userAdmin');
    if (!(admin && admin === "true")) {
        router.push('/stream');
    }
    refresh();
    document.getElementById('materialBtn').addEventListener('click', function() {
        router.push("/material");
    });
    document.getElementById('streamBtn').addEventListener('click', function() {
        router.push("/stream");
    });
    const changeDialog = document.getElementById("changeDialog");
    // 搜索
    document.getElementById('search')
        .addEventListener('change', function() {
            page = 1;
            refresh();
        });
    // 登出
    document.getElementById('logoutBtn')
        .addEventListener('click', function() {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userAdmin');
            router.push('/');
        });
    document.getElementById('changeConfirmBtn')
        .addEventListener('click', function() {
            const streamName = document.getElementById('streamName').value;
            const streamUrl = document.getElementById('streamUrl').value;
            const streamKey = document.getElementById('streamKey').value;
            const expiredTime = document.getElementById('expiredTime').value;
            const materialType = document.getElementById('selectMenu').value;
            let expiredValue = undefined;
            if (expiredTime) {
                expiredValue = Number(expiredTime) * 60 * 60 * 1000;
                if (expiredValue < 0) expiredValue = 0;
            }
            const params = {
                id: changeId,
                name: streamName ? streamName : undefined,
                url: streamUrl ? streamUrl : undefined,
                key: streamKey ? streamKey : undefined,
                expired: expiredValue,
                materialType: materialType ? materialType : undefined
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
        });
    document.getElementById('changeCancelBtn')
        .addEventListener('click', function() {
            changeDialog.open = false;
        });
    document.getElementById('refreshAdminBtn')
        .addEventListener('click', function() {
            refresh();
            snackbar({
                message: '刷新成功'
            });
        });
    document.getElementById('lastPageBtn')
        .addEventListener('click', function() {
            if (page > 1) {
                page--;
                refresh();
            } else {
                snackbar({
                    message: '已经到尽头啦>.<'
                });
            }
        });
    document.getElementById('nextPageBtn')
        .addEventListener('click', function() {
            if (maxPage > page) {
                page++;
                refresh();
            } else {
                snackbar({
                    message: '已经到尽头啦>.<'
                });
            }
        });
    const clientDialog = document.getElementById("clientDialog");
    document.getElementById('clientDialogCloseBtn')
        .addEventListener('click', function() {
            clientDialog.open = false;
        });
    const clientBtn = document.getElementById('clientBtn');
    clientBtn.addEventListener('click', function() {
        clientBtn.loading = true;
        fetch(api + '/admin/client', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token(),
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('错误响应码');
                }
                return response.json();
            })
            .then(data => {
                if (data.code === 200) {
                    const clientDiv = document.getElementById('clientDiv');
                    while (clientDiv.firstChild) {
                        clientDiv.removeChild(clientDiv.firstChild);
                    }
                    let takeCount = 0;
                    let num = 0;
                    Object.keys(data.data).forEach(key => {
                        const values = data.data[key];
                        takeCount += data.data[key].length;
                        num++;
                        const tip = document.createElement('mdui-tooltip');
                        tip.content = "点击给予更多接管";
                        const clientBtn = document.createElement('mdui-chip');
                        clientBtn.innerHTML = '机器' + num + " 接管数量" + values.length;
                        clientBtn.style = "margin-bottom: 1px";
                        clientBtn.addEventListener('click', () => {
                            clientDialog.open = false;
                            const params = {
                                id: key
                            };
                            fetch(api + '/admin/client', {
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
                                            message: '已向该子端发出推流，请稍后'
                                        });
                                    } else {
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
                        });
                        tip.appendChild(clientBtn);
                        clientDiv.appendChild(tip)
                        clientDiv.appendChild(document.createElement('br'));
                    });
                    clientDialog.headline = "接管列表(" + takeCount + ")";
                    clientDialog.open = true;
                    clientBtn.loading = false;
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
    });
}

function truncateString(str) {
    if (str.length > 20) {
        return str.substring(0, 20) + "...";
    }
    return str;
}

function renderStreamList(data) {
    const container = document.getElementById("adminCardList");
    container.innerHTML = '';
    if (data && data.list) {
        maxPage = Math.ceil(data.total / size);
        document.getElementById("countText").textContent = "当前 " + data.streaming + " 个推流中";
        if (maxPage === 0) maxPage = 1;
        document.getElementById("pageText").textContent = "第" + page + "页，共" + maxPage + "页";
        if (data.list.length === 0) {
            container.innerHTML = '<h3>没有推流可展示</h3>';
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
                            switchBtn.disabled = true;
                            snackbar({
                                message: '推流' + (on ? "开启" : "关闭") + "中，请稍等..."
                            });
                        } else {
                            switchBtn.disabled = true;
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
                        <div style="font-size: 15px; color: gray;margin-top: 6px;">用户邮箱：${item["email"] || "未知"}</div>
                        <div style="font-size: 15px; color: gray;">推流地址：${truncateString(item["streamUrl"]) || "未知"}</div>
                        <div style="font-size: 15px; color: gray;">推流密钥：${truncateString(item["streamKey"]) || "未知"}</div>
                        <div style="font-size: 15px; color: gray;">素材名称：${item["materialName"] || "未知"}</div>
                        <div style="font-size: 15px; color: gray;">剩余时长：${expiredTime || "未知"}</div>
                    `;
            stats.style = "margin-bottom: 8px;";
            content.appendChild(stats);

            // 按钮
            const btnDiv = document.createElement('div');
            btnDiv.style = "display: flex; gap: 2px";

            const changeButton = document.createElement('mdui-chip');
            changeButton.style = "margin-right: 1px";
            changeButton.innerHTML = '更改';
            changeButton.addEventListener('click', () => {
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
            const deleteDialog = document.getElementById("deleteDialog");

            deleteButton.addEventListener('click', () => {
                deleteDialog.open = true;
                deleteDialog.description = item.name;
                document.getElementById("dialogCancelBtn").addEventListener('click', () => {
                    deleteDialog.open = false;
                });
                dialogConfirmBtn.addEventListener('click', () => {
                    deleteDialog.open = false;
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

async function fetchStreamLibrary() {
    try {
        const search = document.getElementById('search');
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        if (search.value) params.append("email", search.value);
        const url = api + `/admin/stream?${params.toString()}`;
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

function refresh() {
    document.getElementById('refreshAdminBtn').loading = true;
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
        })
        .finally(() => {
            document.getElementById('refreshAdminBtn').loading = false;
        });
}