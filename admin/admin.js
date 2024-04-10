window.onload = function() {
    refresh();
}
const dialog = document.getElementById("deleteDialog");
const snackbar = document.querySelector(".example-snackbar");
const dialogCancelBtn = document.getElementById('dialogCancelBtn');
const dialogConfirmBtn = document.getElementById('dialogConfirmBtn');
const changeDialog = document.getElementById("changeDialog");
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
        if (data.list.length === 0) {
            materialListTbody.innerHTML = '<tr><td colspan="6" class="mdui-text-center">没有推流可展示</td></tr>';
        }
        data.list.forEach(item => {
            const tr = document.createElement('tr');
            ['name', 'streamUrl', 'streamKey', "materialName", "email"].forEach(key => {
                const td = document.createElement('td');
                if (key === 'streamUrl' || key === 'streamKey') {
                    const a = document.createElement('a');
                    const tip = document.createElement('mdui-tooltip');
                    tip.content = item[key];
                    td.addEventListener('click', () => {
                        const tempTextarea = document.createElement("textarea");
                        tempTextarea.value = item[key];
                        document.body.appendChild(tempTextarea);
                        tempTextarea.select();
                        document.execCommand("copy");
                        document.body.removeChild(tempTextarea);
                        snackbar.textContent = "复制成功";
                        snackbar.open = true;
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
                    icon.name = "ondemand_video";
                    if (item.materialType === "VIDEO") {
                        tooltip.content = "该推流允许使用视频或图片素材"
                        icon.style = "color: orange";
                    } else {
                        tooltip.content = "该推流仅能使用图片素材"
                        icon.style = "color: gray";
                    }
                    tooltip.appendChild(icon);
                    td.appendChild(tooltip);
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

            const changeButton = document.createElement('mdui-chip');
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

async function fetchStreamLibrary(page = 1, size = 30) {
    try {
        const search = document.getElementById('search');
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            email: search.value ? search.value : null
        });
        const url = api + `/admin/stream?${params.toString()}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token()}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('请求推流时出错:', error);
        return null;
    }
}

function refresh() {
    fetchStreamLibrary(1, 30)
        .then(data => {
            renderStreamList(data);
        })
        .catch(error => {
            console.error('处理响应时出错:', error);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    // 搜索
    document.getElementById('search')
        .addEventListener('change', function() {
        refresh();
    });
    // 登出
    document.getElementById('logoutBtn')
        .addEventListener('click', function() {
        localStorage.removeItem('userToken');
        window.location.href = '../';
    });
    document.getElementById('changeConfirmBtn')
        .addEventListener('click', function() {
        const streamName = document.getElementById('streamName').value;
        const streamUrl = document.getElementById('streamUrl').value;
        const streamKey = document.getElementById('streamKey').value;
        const expiredTime = document.getElementById('expiredTime').value;
        const materialType = document.getElementById('selectMenu').value;
        const params = {
            id: changeId,
            name: streamName ? streamName : undefined,
            url: streamUrl ? streamUrl : undefined,
            key: streamKey ? streamKey : undefined,
            expired: expiredTime ? new Date(expiredTime) : undefined,
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
    });
    document.getElementById('changeCancelBtn')
        .addEventListener('click', function() {
        changeDialog.open = false;
    });
    document.getElementById('refreshBtn')
        .addEventListener('click', function() {
        refresh();
        snackbar.textContent = "刷新成功";
        snackbar.open = true;
    });
});