import { api } from './api';
import token from './api';
import {snackbar} from "mdui/functions/snackbar";
import router from "@/router";

let page = 1;
const size = 8;
let maxPage = 1;
let changeId = 0;

export default function init() {
    const admin = localStorage.getItem('userAdmin');
    if (!admin) {
        router.push('/');
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
                expiredValue = new Date(expiredTime).getTime() - new Date().getTime();
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
                        snackbar({message: '更新成功'});
                        fetchStreamLibrary()
                            .then(data => {
                                renderStreamList(data);
                            })
                            .catch(error => {
                                console.error('处理响应时出错:', error);
                            });
                    } else {
                        snackbar({message: data.msg});
                    }

                })
                .catch(error => {
                    console.error('检测到错误', error);
                    snackbar({message: '操作出错，请重试！'});
                });
        });
    document.getElementById('changeCancelBtn')
        .addEventListener('click', function() {
            changeDialog.open = false;
        });
    document.getElementById('refreshBtn')
        .addEventListener('click', function() {
            refresh();
            snackbar({message: '刷新成功'});
        });
    document.getElementById('lastPageBtn')
        .addEventListener('click', function() {
            if (page > 1) {
                page --;
                refresh();
            } else {
                snackbar({message: '已经到尽头啦>.<'});
            }
        });
    document.getElementById('nextPageBtn')
        .addEventListener('click', function() {
            if (maxPage > page) {
                page ++;
                refresh();
            } else {
                snackbar({message: '已经到尽头啦>.<'});
            }
        });
}

function truncateString(str) {
    if (str.length > 20) {
        return str.substring(0, 20)  + "...";
    }
    return str;
}

function renderStreamList(data) {
    const materialListTbody = document.getElementById('material-list-tbody');
    const dialog = document.getElementById("deleteDialog");
    const dialogCancelBtn = document.getElementById('dialogCancelBtn');
    const dialogConfirmBtn = document.getElementById('dialogConfirmBtn');
    const changeDialog = document.getElementById("changeDialog");
    materialListTbody.innerHTML = '';

    if (data && data.list) {
        maxPage = Math.ceil(data.total / size);
        document.getElementById("titleText").textContent = "管理推流 (" + data.streaming + "/" + data.total + "直播中)";
        if (maxPage === 0) maxPage = 1;
        document.getElementById("pageText").textContent = "第" + page + "页，共" + maxPage + "页";
        if (data.list.length === 0) {
            materialListTbody.innerHTML = '<tr><td colspan="6" class="mdui-text-center">没有推流可展示</td></tr>';
            return;
        }
        data.list.forEach(item => {
            const tr = document.createElement('tr');
            ['name', 'streamUrl', 'streamKey', "materialName", "email"].forEach(key => {
                const td = document.createElement('td');
                if (key === 'streamUrl' || key === 'streamKey') {
                    const a = document.createElement('a');
                    const tip = document.createElement('mdui-tooltip');
                    tip.content = "点击复制";
                    td.addEventListener('click', () => {
                        navigator.clipboard.writeText(item[key]).then(() => {
                            snackbar({message: "复制成功"});
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
                        tooltip.content = "该推流允许使用视频或图片素材"
                        icon.style = "color: orange";
                        icon.name = "ondemand_video";
                    } else {
                        tooltip.content = "该推流仅能使用图片素材";
                        icon.style = "color: gray";
                        icon.name = "photo";
                    }
                    tooltip.appendChild(icon);
                    td.appendChild(tooltip);
                }
                tr.appendChild(td);
            });

            const tdExpiredTime = document.createElement('td');
            if (item.expired <= 0) {
                tdExpiredTime.textContent = "已到期";
            } else if (item.expired < 1000 * 60) {
                tdExpiredTime.textContent = "即将到期";
            } else if (item.expired < 1000 * 60 * 60) {
                tdExpiredTime.textContent = (item.expired / (1000 * 60)).toFixed(0) + "分钟";
            } else {
                tdExpiredTime.textContent = (item.expired / (1000 * 60 * 60)).toFixed(1) + "小时";
            }
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
                            switchBtn.disabled = true;
                            snackbar({message: '推流' + (on ? "开启" : "关闭") + "中，请稍等"});
                        } else {
                            switchBtn.disabled = true;
                            snackbar({message: data.msg});
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
                        snackbar({message: '操作出错，请重试！'});
                    });
            });
            switchTd.appendChild(switchBtn);
            tr.appendChild(switchTd);

            const btnTd = document.createElement('td');

            const changeButton = document.createElement('mdui-chip');
            changeButton.style = "margin-right: 1px";
            changeButton.innerHTML = '更改';
            changeButton.addEventListener('click', () => {
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
                            snackbar({message: "获取日志出错"});
                            throw new Error('错误响应码');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.code === 200) {
                            if (data.log.length === 0) {
                                snackbar({message: "该推流暂无日志，请先启动"});
                            } else {
                                data.log.forEach(line => {
                                    const p = document.createElement('p');
                                    p.innerHTML = line;
                                    logDiv.appendChild(p);
                                });
                                logDialog.open = true;
                            }
                        } else {
                            snackbar({message: "获取日志失败" + resJson.msg});
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
                                snackbar({message: "删除成功"});
                                tr.parentNode.removeChild(tr);
                            } else {
                                snackbar({message: data.msg});
                            }
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
}